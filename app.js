const express = require('express');
const app = express();
const {
    getTopics,
    getEndPoints,
    getArticleById,
    getArticles,
	getArticleComments,
	postComment,
	patchVoteCount,
} = require("./controllers/news-controllers");

app.use(express.json());

app.get('/api/topics',getTopics);

app.get('/api/',getEndPoints);

app.get('/api/article/:article_id',getArticleById);

app.get('/api/articles',getArticles)

app.get('/api/articles/:article_id/comments',getArticleComments)

app.post('/api/articles/:article_id/comments',postComment)

app.patch('/api/articles/:article_id',patchVoteCount)

app.use((error, request, response, next)=>{
	if(error.status && error.message){
		response.status(error.status).send({message: error.message});
	}else{
		next(error);
	}
});

app.use((error, request, response, next)=>{
	if(error.code==="22P02"){
		response.status(400).send({message: "BAD REQUEST"});
	}else{
		next(error);
	}
});

app.use((error, request, response, next)=>{
	if(error.code==="23502"){
		response.status(400).send({message: "BAD REQUEST"})
	}
})



module.exports = app;