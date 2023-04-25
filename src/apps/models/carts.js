const mongoose = require('../../common/database')();
const Schema = mongoose.Schema;
const cartSchema = new Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: "users"
    },
    items: {
        type: Object,
        require: false
    },
}, {
    timestamps: true
})

const CartModel = mongoose.model("carts", cartSchema, "carts")
module.exports = CartModel