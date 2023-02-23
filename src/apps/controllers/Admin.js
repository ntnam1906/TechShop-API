const ProductsModel = require('../models/products');
const UsersModel = require('../models/users');
const CommentsModel = require('../models/comments');

const getDashboard = async (req, res)=> {
    const products = await ProductsModel.find()
    const users = await UsersModel.find()
    const comments = await CommentsModel.find()
    res.render('admin/dashboard', {
        products: products.length,
        users: users.length,
        comments: comments.length
    })
}

module.exports = {
    getDashboard: getDashboard,
}