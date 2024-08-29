const {
    selectTopics,
    selectArticleById,
    fetchArticles,
} = require("../models/news-models.js");

const endPoints = require("../endpoints.json");

exports.getTopics = (request, response) => {
    selectTopics().then((topics)=>{
        response.status(200).send({topics});
    });
};

exports.getEndPoints = (request, response) =>{
        return response.status(200).send(endPoints);
}


exports.getArticleById = (request, response,next) => {
    const {article_id} = request.params;
    selectArticleById(article_id).then((article)=>{
        response.status(200).send({article});
    })
    .catch((error)=>{
        next(error)
    })
};

exports.getArticles = (request, response, next) =>{
    fetchArticles().then((articles)=>{
        response.status(200).send({articles})
    })
    .catch((error)=>{
        next(error)
    })
}