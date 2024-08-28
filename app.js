const express = require('express');
const app = express();
const {
    getTopics,
    getEndPoints,
    getArticleById,
} = require("./controllers/news-controllers");

app.use(express.json())

app.get('/api/topics',getTopics);

app.get('/api/',getEndPoints);

app.get('/api/article/:article_id',getArticleById);


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