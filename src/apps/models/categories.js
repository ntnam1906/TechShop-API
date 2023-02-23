const mongoose = require('../../common/database')();
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    description: {
        type: String
    },
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        lowercase: true
    }
}, {
    timestamps: true,
})

const CategoriesModel = mongoose.model("categories", categorySchema, "categories");
module.exports = CategoriesModel;