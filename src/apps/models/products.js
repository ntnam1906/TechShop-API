const mongoose = require('../../common/database')();
const Schema = mongoose.Schema;
const productSchema = new Schema({
    thumbnail: {
        data: Buffer,
        contentType: String
    },
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

const ProductsModel = mongoose.model("products", productSchema, "products")
module.exports = ProductsModel