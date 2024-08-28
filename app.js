const express = require('express');
const app = express();
const {
    getTopics,
    getEndPoints,
    getArticleById,
    getArticles,
} = require("./controllers/news-controllers");

app.get('/api/topics',getTopics);

app.get('/api/',getEndPoints);

app.get('/api/article/:article_id',getArticleById);

app.get('/api/articles',getArticles)


app.use((error, request, response, next)=>{
	if(error.status && error.message){
		response.status(error.status).send({message: error.message});
    }else if(error.code==="22P02"){
		response.status(400).send({message: "BAD REQUEST"});
	}else{
		next(error);
	}
});


module.exports = app;