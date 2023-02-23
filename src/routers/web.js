const express = require('express');
const router = express.Router();
const AuthController = require('../apps/controllers/Auth');
const AdminController = require('../apps/controllers/Admin');
const UserController = require('../apps/controllers/Users');
const CategoriesController = require('../apps/controllers/Category');
const ProductController = require('../apps/controllers/Product');
const AuthMiddleware = require('../apps/middlerware/auth');
const LocalController = require('../apps/controllers/Local');


//GET

//ADMIN
router.get('/admin/dashboard', AdminController.getDashboard)

router.get('/admin/login', AuthController.getLogin)
router.get('/admin/logout', AuthController.getLogout)

router.get('/admin/user', UserController.indexUsers)
router.get('/admin/user/?page=:page', UserController.indexUsers)
router.get('/admin/user/add', UserController.addUsers)
router.get('/admin/user/edit/:id', UserController.editUsers)
router.get('/admin/user/delete/:id', UserController.deleteUsers)

router.get('/admin/category', CategoriesController.indexCategory)
router.get('/admin/category/?page=:page', CategoriesController.indexCategory)
router.get('/admin/category/add', CategoriesController.addCategory)
router.get('/admin/category/edit/:id', CategoriesController.editCategory)
router.get('/admin/category/delete/:id', CategoriesController.deleteCategory)

router.get('/admin/product', ProductController.indexProduct)
router.get('/admin/product/?page=:page', ProductController.indexProduct)
router.get('/admin/product/add', ProductController.addProduct)
router.get('/admin/product/edit/:id', ProductController.editProduct)
router.get('/admin/product/delete/:id', ProductController.deleteProduct)

//LOCAL
router.get('/', LocalController.indexLocal)
router.get('/cart', LocalController.cartLocal)
router.get('/cart-payment', LocalController.payCartLocal)
router.get('/cart-delete', LocalController.deleteCartLocal)
router.get('/category/:id', LocalController.categoryLocal)
router.get('/category/:id?page=:page', LocalController.categoryLocal)
router.get('/product/:id', LocalController.productLocal)
router.get('/product/add-cart/:id', LocalController.addProductLocal)
router.get('/search', LocalController.searchLocal)
router.get('/search?:keyword&page=:page', LocalController.searchLocal)
router.get('/login', AuthController.loginLocal) 
router.get('/register', AuthController.registerLocal)
router.get('/logout', AuthController.logoutLocal)
//POST

//ADMIN
router.post('/admin/login',  AuthController.postLogin)

router.post('/admin/user/add', UserController.newUsers)
router.post('/admin/user/edit/:id', UserController.updateUsers)

router.post('/admin/category/add', CategoriesController.newCategory)
router.post('/admin/category/edit/:id', CategoriesController.updateCategory)

router.post('/admin/product/add', ProductController.newProduct)
router.post('/admin/product/edit/:id', ProductController.updateProduct)

//LOCAL
router.post('/login', AuthController.postLoginLocal)
router.post('/register', AuthController.postRegisterLocal)
router.post('/cart-reload', LocalController.cartReloadLocal)
router.post('/product/:id', LocalController.commentPrdLocal)
module.exports = router