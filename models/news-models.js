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

exports.fetchArticleComments = (article_id)=>{
    return db
    .query("SELECT comment_id, votes, created_at, author, body, article_id FROM comments WHERE article_id = $1 ORDER BY created_at DESC",[article_id])
    .then(({rows})=>{
        if(rows.length===0){
            return Promise.reject({status: 404, message:"NOT FOUND"});
        }
        return rows
    });
};

exports.insertComment = (newComment,article_id)=>{
    return db
    .query("INSERT INTO comments (body,article_id,author) VALUES ($1, $2, $3) RETURNING *;",[newComment.body, article_id.article_id, newComment.username])
    .then((result)=>{
        return result.rows[0];
    });
}

exports.incrementVoteCount = (voteChange,article_id)=>{
    return db
    .query("UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",[voteChange.inc_votes,article_id.article_id])
    .then((result)=>{
        if(result.rows.length===0){
            return Promise.reject({status: 404, message:"NOT FOUND"});
        }
        return result.rows[0];
    })
}

exports.removeCommentById = (comment_id) => {
    return db
    .query('DELETE FROM comments WHERE comment_id = $1;', [comment_id])
    .then((result)=>{
        if(result.rowCount===1){
            return true
        }if(result.rowCount===0){
            return Promise.reject({status: 404, message:"NOT FOUND"});
        }else{
            return Promise.reject({status: 400, message:"BAD REQUEST"});
        }
    })
  };
  