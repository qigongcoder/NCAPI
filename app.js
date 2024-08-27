const express = require('express');
const app = express();
const {getTopics, getEndPoints} = require("./controllers/news-controllers");

app.get('/api/topics',getTopics);

app.get('/api/',getEndPoints);

module.exports = app;