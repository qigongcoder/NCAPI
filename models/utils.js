const db = require("../db/connection");

exports.getCommentCount = (article_id) =>{
    return db.query("SELECT COUNT(*) FROM comments WHERE article_id=$1",[article_id])
    .then((result)=>{
        return Number(result.rows[0].count)
    });
}