const {
    selectTopics,
    selectArticleById,
    fetchArticles,
    fetchArticleComments,
    insertComment,
    incrementVoteCount,
    removeCommentById,
} = require("../models/news-models.js");

const endPoints = require("../endpoints.json");

exports.getTopics = (request, response) => {
    selectTopics().then((topics) => {
        response.status(200).send({ topics });
    });
};

exports.getEndPoints = (request, response) => {
    return response.status(200).send(endPoints);
}


exports.getArticleById = (request, response, next) => {
    const { article_id } = request.params;
    selectArticleById(article_id).then((article) => {
        response.status(200).send({ article });
    })
        .catch((error) => {
            next(error)
        })
};

exports.getArticles = (request, response, next) => {
    fetchArticles().then((articles) => {
        response.status(200).send({ articles })
    })
        .catch((error) => {
            next(error)
        })
}

exports.getArticleComments = (request, response, next) => {
    const { article_id } = request.params;
    fetchArticleComments(article_id).then((comments) => {
        response.status(200).send({ comments })
    })
        .catch((error) => {
            next(error)
        })
}

exports.postComment = (request, response, next) => {
    const newComment = request.body;
    const article_id = request.params;
    insertComment(newComment, article_id).then((comment) => {
        response.status(201).send({ comment })
    })
        .catch((error) => {
            next(error)
        });
}

exports.patchVoteCount = (request, response, next) => {
    const voteChange = request.body
    const article_id = request.params;
    incrementVoteCount(voteChange, article_id).then(article => {
        response.status(200).send({ article })
    })
        .catch((error) => {
            next(error)
        })
}


exports.deleteCommentById = (request, response, next) => {
    const { comment_id } = request.params;
    removeCommentById(comment_id).then(() => {
        response.status(204).send();
    })
        .catch((error) => {
            next(error)
        })
};
