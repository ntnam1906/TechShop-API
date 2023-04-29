const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    products: {
        type: Array,
        require: false
    },
    shippingAddress: {
        fullName: { type: String, required: true },
        address: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: Number, required: true },
    },
    totalPrice: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    isPaid: { type: Boolean, default: false },
    isComfirmed: { type: Boolean, default: false },
    isCancle: { type: Boolean, default: false },
    emailPayment: { type: String }
},
    {
        timestamps: true,
    }
);
const Order = mongoose.model('orders', orderSchema, "orders");
module.exports = Order