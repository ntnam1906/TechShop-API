const mongoose = require('../../common/database')();
const Schema = mongoose.Schema;
const commentSchema = new Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: "users"
    },
    prd_id: {
        type: mongoose.Types.ObjectId,
        ref: "products"
    },
    body: {
        type: String,
    },
}, {timestamps: true})

const CommentsModel = mongoose.model("comments", commentSchema, "comments");
module.exports = CommentsModel;