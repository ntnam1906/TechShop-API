const express = require('express');
const AuthController = require('../apps/controllers/Auth');
const LocalController = require('../apps/controllers/Local');
const OrderController = require('../apps/controllers/Order')
const auth = require('../apps/middleware/auth')
const apiLocal = express.Router();

//GET

apiLocal.get('/', LocalController.indexLocal)
apiLocal.get('/cart', auth, LocalController.cartLocal)
apiLocal.get('/order', auth, OrderController.historOrder)
apiLocal.get('/payment/:id', auth, OrderController.payment)
apiLocal.get('/category/:id', LocalController.categoryLocal)
apiLocal.get('/category/:id?page=:page', LocalController.categoryLocal)

apiLocal.get('/product/:id', LocalController.productLocal)
apiLocal.get('/get-comment/:id', LocalController.getCommentProduct)
apiLocal.get('/search', LocalController.searchLocal)
apiLocal.get('/search?:keyword&page=:page', LocalController.searchLocal)



//POST

apiLocal.post('/logout', AuthController.logoutLocal)
apiLocal.post('/login', AuthController.loginLocal)
apiLocal.post('/register', AuthController.registerLocal)
apiLocal.post('/change-password', auth, AuthController.changePassword)
apiLocal.post('/active', auth, AuthController.activateAccount)
apiLocal.post('/forgot-password', AuthController.forgotPassword)
apiLocal.post('/send-mail', AuthController.sendToken)
apiLocal.post('/comment-product/:id', auth, LocalController.commentPrdLocal)
apiLocal.post('/product/add-cart/:id', auth, LocalController.addProductLocal)
apiLocal.post('/cart-delete/:id',auth , LocalController.deleteCartLocal)
apiLocal.post('/cart-payment',auth , LocalController.payCartLocal)
apiLocal.post('/order-delete/:id',auth , OrderController.deleteOrderLocal)
apiLocal.post('/payment-success/:id', auth, OrderController.paymentSuccess)


module.exports = apiLocal;
