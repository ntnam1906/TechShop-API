const mongoose = require('../../common/database')();
const Schema = mongoose.Schema;
const fearturedPrdsSchema = new Schema({
    thumbnail: String,
    description: String,
    price: Number,
    cat_id: {
        type: mongoose.Types.ObjectId,
        ref: "categories"
    },
    status: String,
    features: Boolean,
    promotion: String,
    warranty: String,
    accessories: String,
    is_stock: Boolean,
    name: String,
    slug: {
        type: String,
        require: true,
        lowercase: true,
    }
}, {
    timestamps: true

})

const FearturedPrdsSchema = mongoose.model("fearturedPrds", productSchema, "fearturedPrds")
module.exports = FearturedPrdsSchema