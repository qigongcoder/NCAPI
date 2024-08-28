const express = require('express');
const app = express();
const {
    getTopics,
    getEndPoints,
    getArticleById,
} = require("./controllers/news-controllers");

app.get('/api/topics',getTopics);

app.get('/api/',getEndPoints);

app.get('/api/article/:article_id',getArticleById);

module.exports = app;