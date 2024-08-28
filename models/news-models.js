const db = require("../db/connection");
const {getCommentCount} = require("./utils")

exports.selectTopics = () =>{
    return db.query("SELECT * FROM topics;")
    .then((result)=>{
        return result.rows
    });
}

exports.selectArticleById = (article_id)=>{
	return db
		.query("SELECT * FROM articles WHERE article_id = $1", [article_id])
		.then(({rows})=>{
			if(rows.length===0){
                return Promise.reject({status: 404, message:"NOT FOUND"});
            }
			return rows[0]
	});
};

exports.fetchArticles = () =>{
    let listOfArticles = []
    return db.query("SELECT author, title, article_id, topic, created_at, votes, article_img_url FROM articles ORDER BY created_at DESC;")
    .then((result)=>{
         listOfArticles = result.rows;
        const articleCountPromise = listOfArticles.map(article=>{
            return getCommentCount(article.article_id)
        })
        return Promise.all(articleCountPromise)
    }).then(articleCount=>{
        for(let i=0;i<listOfArticles.length;i++){
            listOfArticles[i].comment_count = articleCount[i]
        }
        return listOfArticles;
    })
}