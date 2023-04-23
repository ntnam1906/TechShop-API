const express = require('express');
const AuthController = require('../apps/controllers/Auth');
const LocalController = require('../apps/controllers/Local');
const auth = require('../apps/middleware/auth')
const apiLocal = express.Router();

//GET

apiLocal.get('/', LocalController.indexLocal)
apiLocal.get('/cart', auth, LocalController.cartLocal)
apiLocal.get('/cart-payment',auth , LocalController.payCartLocal)
apiLocal.get('/cart-delete',auth , LocalController.deleteCartLocal)
apiLocal.get('/category/:id', LocalController.categoryLocal)
apiLocal.get('/category/:id?page=:page', LocalController.categoryLocal)

apiLocal.get('/product/:id', LocalController.productLocal)
apiLocal.get('/product/add-cart/:id', auth, LocalController.addProductLocal)
apiLocal.get('/search', LocalController.searchLocal)
apiLocal.get('/search?:keyword&page=:page', LocalController.searchLocal)

apiLocal.get('/logout', AuthController.logoutLocal)


//POST

apiLocal.post('/login', AuthController.loginLocal)
apiLocal.post('/register', AuthController.registerLocal)
apiLocal.post('/product/:id', auth, LocalController.commentPrdLocal)

module.exports = apiLocal;
