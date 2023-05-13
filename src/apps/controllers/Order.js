const CartModel = require('../models/carts');
const UsersModel = require('../models/users');
const OrdersModel = require('../models/orders');
const paypal = require('@paypal/payouts-sdk');
const historOrder = async (req, res) => {
    try {
        const userId = req.userId
        const orders = await OrdersModel.find({user: userId}).sort({ updatedAt: -1 })
        
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
const payment = async (req, res) => {
    try {
        const userId = req.userId
        const paymentId = req.params.id
        const order = await OrdersModel.findById(paymentId)
        
        if(userId) {
            return res.status(200).json({
                order: order
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
const paymentSuccess = async (req, res) => {
    try {
        const paymentId = req.params.id
        const emailPayment = req.body.emailPayment
        const order = await OrdersModel.findByIdAndUpdate(paymentId, {
            isPaid: true,
            emailPayment: emailPayment
        })
        
        if(order) {
            return res.status(200).json({
                message: "OK"
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

    // Khởi tạo đối tượng PayPalClient
    const paypalClient = new paypal.core.PayPalHttpClient(
        new paypal.core.SandboxEnvironment(
        'AYy8VD-gSEsu1rd_HZ38RsZ6GWPwc-oA046I_yJPOH_b1xfNYOQb1NWMXYlffxf6ZmpmNNPqKhj4mBmh',
        'EKlC3Sc51pxea5bMirbRJeL5JfQeJnh2ADi4itXKP7MLdPoXDniUCkfXC9RhgjlZIusdppBfEwZcf2cW'
        )
    );
    
    const orderRefund = await OrdersModel.findById(req.params.id)
    
    if (user) {
        // Tạo request body để chuyển tiền
        const senderBatchId = Math.random().toString(36).substring(9); // Tạo sender batch id ngẫu nhiên
        // Tạo request body để chuyển tiền
        const requestBody = {
            sender_batch_header: {
                recipient_type: "EMAIL",
                email_message: "Refund money",
                note: "Enjoy your Payout!!",
                sender_batch_id: senderBatchId,
                email_subject: "This is a transaction refund money"
              },
              items: [{
                note: "Your Money !",
                amount: {
                  currency: "USD",
                  value: (orderRefund.totalPrice/23000).toFixed(2)
                },
                receiver: orderRefund.emailPayment,
                sender_item_id: "Refund"
              }]
          };
        // Tạo payout
        const request = new paypal.payouts.PayoutsPostRequest();
        request.requestBody(requestBody);
        // Thực hiện refund
        let createPayouts  = async function(){
            let response = await paypalClient.execute(request);
        }
        createPayouts();

        const order = await OrdersModel.findByIdAndUpdate({
            _id: req.params.id
        }, {
            isCancle: true,
            isPaid: false
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
        const orders = await OrdersModel.find().sort({ updatedAt: -1 })
        
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
    comfirmOrderAdmin: comfirmOrderAdmin,
    payment: payment,
    paymentSuccess: paymentSuccess
}