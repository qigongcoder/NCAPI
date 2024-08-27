const {selectTopics} = require("../models/news-models.js");
const endPoints = require("../endpoints.json");

exports.getTopics = (require, response) => {
    selectTopics().then((topics)=>{
        response.status(200).send({topics});
    });
};

exports.getEndPoints = (require, response) =>{
        return response.status(200).send(endPoints);
}



