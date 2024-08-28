const request = require('supertest');
const app = require("../app");
const endPoints = require("../endpoints.json");

const data = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");

beforeEach(()=>seed(data));
afterAll(()=>db.end());

describe("/api/topics",()=>{
    test("Tests that this endpoint responds with all topics. It should reply with an array of topic object, each with the properties slug and description", () =>{
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response)=>{
            const {body}= response;
            expect(body).toHaveProperty("topics");
            expect(Array.isArray(body.topics)).toBe(true);
        })
    })
})


describe("/api",()=>{
    test("Tests that this endpoint responds with a JSON of all endpoints", () =>{
        return request(app)
        .get("/api/")
        .expect(200)
        .then((response)=>{
            const {body}= response;
            expect(body).toMatchObject(endPoints)
        })
    })
})


describe("GET: /api/articles/:article_id", ()=>{

	test("status 200: respond with the requested article_id",()=>{
		return request(app)
		    .get("/api/article/1/")
		    .expect(200)
		    .then(({body})=>{
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
    
	test("400: responds with BAD REQUEST for invalid article_id", ()=>{
		return request(app)
			.get("/api/article/invalid_id")
			.expect(400)
			.then((response)=>{
				const {body:{message}} = response;
				expect (message).toBe("BAD REQUEST")
		});
	});

    test("404: responds with NOT FOUND for valid but non-existent snack_id",()=>{
        return request(app)
            .get("/api/article/1000")
            .expect(404)
            .then((response)=>{
                expect(response.body.message).toBe("NOT FOUND");
            });
        });

});

