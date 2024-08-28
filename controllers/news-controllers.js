const {
    selectTopics,
    selectArticleById,
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


exports.getArticleById = (request, response) => {
    const {article_id} = request.params;
    console.log(article_id,"<--article_id")
    selectArticleById(article_id).then((article)=>{
        console.log(article,"<--article")
        response.status(200).send({article});
    });
};
