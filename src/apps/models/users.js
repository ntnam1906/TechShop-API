const mongoose = require('../../common/database')()
const Schema = mongoose.Schema;
const userSchema = new Schema({
    email: String,
    password: String,
    role: String,
    full_name: String,
})

const UsersModel = mongoose.model("users", userSchema, "users");
module.exports = UsersModel;