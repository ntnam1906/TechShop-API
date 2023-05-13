const express = require('express');
const apiAdmin = express.Router();
const AuthController = require('../apps/controllers/Auth');
const AdminController = require('../apps/controllers/Admin');
const UserController = require('../apps/controllers/Users');
const CategoriesController = require('../apps/controllers/Category');
const ProductController = require('../apps/controllers/Product');
const OrderController = require('../apps/controllers/Order')
const auth = require('../apps/middleware/auth')
const path = require('path');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, 'uploads/') // đường dẫn lưu trữ ảnh
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname )
    }
  })
const upload = multer({ storage: storage })

//GET

apiAdmin.get('/dashboard', auth, AdminController.getDashboard)


apiAdmin.get('/user', auth, UserController.indexUsers)
apiAdmin.get('/user/?page=:page', auth, UserController.indexUsers)

apiAdmin.get('/category', auth, CategoriesController.indexCategory)
apiAdmin.get('/category/?page=:page', auth, CategoriesController.indexCategory)

apiAdmin.get('/product', auth, ProductController.indexProduct)
apiAdmin.get('/product/?page=:page', auth, ProductController.indexProduct)

apiAdmin.get('/order', auth, OrderController.orderAdmin)
apiAdmin.get('/order/?page=:page', auth, OrderController.orderAdmin)

apiAdmin.get('/comment', auth, ProductController.getCommentAdmin)

//POST
apiAdmin.post('/logout', AuthController.getLogout)
apiAdmin.post('/login',  AuthController.loginAdmin)

apiAdmin.post('/user/add', UserController.newUsers)
apiAdmin.post('/user/edit/:id', UserController.updateUsers)
apiAdmin.post('/user/delete/:id', UserController.deleteUsers)

apiAdmin.post('/category/add', CategoriesController.newCategory)
apiAdmin.post('/category/edit/:id', CategoriesController.updateCategory)
apiAdmin.post('/category/delete/:id', CategoriesController.deleteCategory)

apiAdmin.post('/product/add', upload.single('thumbnail') , ProductController.newProduct)
apiAdmin.post('/product/edit/:id', upload.single('thumbnail'), ProductController.updateProduct)
apiAdmin.post('/product/delete/:id', ProductController.deleteProduct)

apiAdmin.post('/order/cancle/:id', OrderController.cancleOrderAdmin)
apiAdmin.post('/order/confirm/:id', OrderController.comfirmOrderAdmin)

apiAdmin.post('/comment/delete/:id', ProductController.deleteCommentAdmin)



module.exports = apiAdmin