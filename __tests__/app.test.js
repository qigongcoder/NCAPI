const request = require('supertest');
const app = require("../app");
const endPoints = require("../endpoints.json");

const data = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");

const {
    getCommentCount
} = require("../models/utils")


beforeEach(() => seed(data));
afterAll(() => db.end());

describe("/api/topics", () => {
    test("Tests that this endpoint responds with all topics. It should reply with an array of topic object, each with the properties slug and description", () => {
        return request(app)
            .get("/api/topics")
            .expect(200)
            .then((response) => {
                const { body } = response;
                expect(body).toHaveProperty("topics");
                expect(Array.isArray(body.topics)).toBe(true);
            })
    })
})


describe("/api", () => {
    test("Tests that this endpoint responds with a JSON of all endpoints", () => {
        return request(app)
            .get("/api/")
            .expect(200)
            .then((response) => {
                const { body } = response;
                expect(body).toMatchObject(endPoints)
            })
    })
})


describe("GET: /api/articles/:article_id", () => {

    test("status 200: respond with the requested article_id", () => {
        return request(app)
            .get("/api/article/1/")
            .expect(200)
            .then(({ body }) => {
                expect(body.article).toMatchObject({
                    title: "Living in the shadow of a great man",
                    topic: "mitch",
                    author: "butter_bridge",
                    body: "I find this existence challenging",
                    created_at: "2020-07-09T20:11:00.000Z",
                    votes: 100,
                    article_img_url:
                        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                })
            })
    })

    test("400: responds with BAD REQUEST for invalid article_id", () => {
        return request(app)
            .get("/api/article/invalid_id")
            .expect(400)
            .then((response) => {
                const { body: { message } } = response;
                expect(message).toBe("BAD REQUEST")
            });
    });

    test("404: responds with NOT FOUND for valid but non-existent snack_id", () => {
        return request(app)
            .get("/api/article/1000")
            .expect(404)
            .then((response) => {
                expect(response.body.message).toBe("NOT FOUND");
            });
    });

});

describe("GET: /api/articles", () => {

    test("status 200: responds with an articles array of article objects", () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
                expect(body.articles.length).toBe(13);
                body.articles.forEach(article => {
                    expect(typeof article.author).toBe("string");
                    expect(typeof article.title).toBe("string");
                    expect(typeof article.article_id).toBe("number");
                    expect(typeof article.topic).toBe("string");
                    expect(typeof article.created_at).toBe("string");
                    expect(typeof article.votes).toBe("number");
                    expect(typeof article.article_img_url).toBe("string");
                    expect(typeof article.comment_count).toBe("number");
                });
                expect(body.articles).toBeSortedBy("created_at", {
                    descending: true
                })
            })
    })
})

describe("GET: /api/articles/:article_id/comments", () => {

    test("status 200: responds with all the comments for a given article", () => {
        return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body }) => {
                expect(body.comments.length).toBe(11);
                body.comments.forEach(comment => {
                    expect(typeof comment.comment_id).toBe("number");
                    expect(typeof comment.votes).toBe("number");
                    expect(typeof comment.created_at).toBe("string");
                    expect(typeof comment.author).toBe("string");
                    expect(typeof comment.body).toBe("string");
                    expect(typeof comment.article_id).toBe("number");
                })
                expect(body.comments).toBeSortedBy("created_at", {
                    descending: true
                })
            })
    })

    test("status 400: responds with BAD REQUEST for invalid article_id", () => {
        return request(app)
            .get("/api/articles/X/comments")
            .expect(400)
            .then(response => {
                const { body: { message } } = response;
                expect(message).toBe("BAD REQUEST")
            })
    })

    test("404: responds with NOT FOUND for valid but non-existent article_id", () => {
        return request(app)
            .get("/api/articles/1000/comments")
            .expect(404)
            .then((response) => {
                expect(response.body.message).toBe("NOT FOUND");
            });
    });

});



describe("POST: /api/articles/:article_id/comments", () => {

    test('POST:201 inserts a new comment for an article and sends the comment back to the client', () => {
        const newComment = {
            username: "butter_bridge",
            body: "hi",
        };
        return request(app)
            .post('/api/articles/2/comments')
            .send(newComment)
            .expect(201)
            .then((response) => {
                expect(response.body.comment.article_id).toBe(2);
                expect(response.body.comment.author).toBe('butter_bridge');
                expect(response.body.comment.body).toBe('hi');
            });
    });

    test('POST:400 responds with an appropriate status and error message when provided with a bad comment (no user name)', () => {
        const newComment = {
            body: "XXX"
        };
        return request(app)
            .post('/api/articles/1/comments')
            .send(newComment)
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe('BAD REQUEST');
            });
    });

    test("POST 400: responds with BAD REQUEST for invalid article_id", () => {
        const newComment = {
            username: "butter_bridge",
            body: "hi",
        };
        return request(app)
            .post('/api/articles/X/comments')
            .send(newComment)
            .expect(400)
            .then(response => {
                const { body: { message } } = response;
                expect(message).toBe("BAD REQUEST")
            })
    })

});


describe("PATCH: /api/articles/:article_id", () => {

    test('PATCH: 200 changes vote count of given article by given value', () => {
        const voteChange = { inc_votes: 1 };
        return request(app)
            .patch('/api/articles/1')
            .send(voteChange)
            .expect(200)
            .then((response) => {
                expect(response.body.article.votes).toBe(101)
            })
    })

    test('PATCH: 200 changes vote count of given article by given value while ignoring uneccessary key values in send object', () => {
        const voteChange = { inc_votes: 1, extra_info: 0 };
        return request(app)
            .patch('/api/articles/1')
            .send(voteChange)
            .expect(200)
            .then((response) => {
                expect(response.body.article.votes).toBe(101)
            })
    })

    test('PATCH: 404 error value when given non-existent article_id', () => {
        const voteChange = { inc_votes: 1 };
        return request(app)
            .patch('/api/articles/100')
            .send(voteChange)
            .expect(404)
            .then((response) => {
                expect(response.body.message).toBe('NOT FOUND');
            });
    })

    test('PATCH: 404 error value when given invalid article_id', () => {
        const voteChange = { inc_votes: 1 };
        return request(app)
            .patch('/api/articles/X')
            .send(voteChange)
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe('BAD REQUEST');
            });
    })

    test('PATCH: 404 error value when given incorrect key in patch body', () => {
        const voteChange = { xxxx: 1 };
        return request(app)
            .patch('/api/articles/X')
            .send(voteChange)
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe('BAD REQUEST');
            });
    })

})

describe("DELETE: /api/comments/:comment_id", () => {

    test('DELETE:204 deletes the specified comment and sends no body back', () => {
        return request(app)
            .delete('/api/comments/1')
            .expect(204);
    });

    test('DELETE:404 responds with an appropriate status and error message when given a non-existent id', () => {
        return request(app)
            .delete('/api/comments/999')
            .expect(404)
            .then((response) => {
                expect(response.body.message).toBe('NOT FOUND');
            });
    });

    test('DELETE:400 responds with an appropriate status and error message when given an invalid id', () => {
        return request(app)
            .delete('/api/comments/not-a-comment')
            .expect(400)
            .then((response) => {
                expect(response.body.message).toBe('BAD REQUEST');
            });
    });
});


describe("/api/users", () => {
    test("Tests that this endpoint responds with all the users", () => {
        return request(app)
            .get("/api/users")
            .expect(200)
            .then((response) => {
                const { body } = response;
                expect(body.users.length).toBe(4);
                body.users.forEach(user => {
                    expect(typeof user.username).toBe("string");
                    expect(typeof user.name).toBe("string");
                    expect(typeof user.avatar_url).toBe("string");
                })
            })
    })
})



describe("getCommentCount", () => {
    test("returns correct comment count for article", () => {
        const input = 3;
        return getCommentCount(input)
            .then(data => {
                expect(data).toBe(2)
            })
    })
    test("does not mutate origin input", () => {
        const input = 3;
        return getCommentCount(input)
            .then(() => {
                expect(input).toBe(input)
            })
    })
    test("returns 0 comment count for invalid article", () => {
        const input = 1000;
        return getCommentCount(input)
            .then(data => {
                expect(data).toBe(0)
            })
    })
})