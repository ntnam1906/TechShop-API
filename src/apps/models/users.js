const mongoose = require('../../common/database')();
const Schema = mongoose.Schema;
const userSchema = new Schema(
    {
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        full_name: {type: String, required: true},
        access_token: {type: String, require: true},
        refresh_token: {type: String, require: true},
        isActivated: {
            type: Boolean,
            default: false,
        },
        confirmationToken: {
            type: String,
            required: false,
        },
        role: String
    },
    {
        timestamps: true
    }
)

const UsersModel = mongoose.model("users", userSchema, "users");
module.exports = UsersModel;