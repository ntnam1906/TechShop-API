const CartModel = require('../models/carts');
const UsersModel = require('../models/users');
const OrdersModel = require('../models/orders');

const historOrder = async (req, res) => {
    try {
        const userId = req.userId
        const orders = await OrdersModel.find({user: userId})
        
        if(userId) {
            if (!orders) {
                return res.status(404).json({
                    message: 'Bạn không có đơn hàng nào',
                });
            }
            return res.status(200).json({
                orders: orders
            })
        }
        else {
            return res.status(401).json({
                message: 'UNAUTHORIZED',
            });
        }
        
    }
    catch (err) {
        res.status(404).json({
            message: err.message
        })
    }
}
const deleteOrderLocal = async (req, res) => {
    const userId = req.userId
    const user = await UsersModel.findById(userId)
    if (user) {
        const order = await OrdersModel.findByIdAndUpdate({
            _id: req.params.id
        }, {
            isCancle: true
        })
        if (order) {
            
            res.status(201).json({
                message: 'Xóa thành công',
            })
        }
    } else {
        res.status(401).json({
            message: "UNAUTHORIZED"
        })
    }
}
const orderAdmin = async (req, res) => {
    try {
        const userId = req.userId
        const orders = await OrdersModel.find()
        
        if(userId) {
            return res.status(200).json({
                orders: orders
            })
        }
        else {
            return res.status(401).json({
                message: 'UNAUTHORIZED',
            });
        }
        
    }
    catch (err) {
        res.status(404).json({
            message: err.message
        })
    }
}
const cancleOrderAdmin = async (req, res) => {
    try {
        const order = await OrdersModel.findByIdAndUpdate({
            _id: req.params.id
        }, {
            isCancle: true
        })
        if (order) {
            res.status(202).json({
                message: 'Hủy đơn hàng thành công',
            })
        }
    }
    catch(error) {
        res.status(500).json({
            message: error.message
        })
    }
}
const comfirmOrderAdmin = async (req, res) => {
    try {
        const order = await OrdersModel.findByIdAndUpdate({
            _id: req.params.id
        }, {
            isComfirmed: true
        })
        if (order) {
            res.status(201).json({
                message: 'Xác nhận đơn hàng thành công',
            })
        }
    }
    catch(error) {
        res.status(500).json({
            message: error.message
        })
    }
}
module.exports = {
    historOrder: historOrder,
    deleteOrderLocal: deleteOrderLocal,
    orderAdmin: orderAdmin,
    cancleOrderAdmin: cancleOrderAdmin,
    comfirmOrderAdmin: comfirmOrderAdmin
}