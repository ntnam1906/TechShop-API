const ProductsModel = require('../models/products');
const CategoriesModel = require('../models/categories');
const config = require('config');
const slugify = require('slugify');

const indexProduct = async (req, res) => {
    const pagination = {
        page: Number(req.query.page) || 1,
        perPage: 10,
    }
    const noPage = (pagination.perPage * pagination.page) - pagination.perPage
    try {
        const products = await ProductsModel.find().populate({
            path: "cat_id"
        }).skip(noPage).limit(pagination.perPage)
        const countProducts = await ProductsModel.countDocuments()
        res.render('admin/product', {
            products: products,
            current: pagination.page,
            pages: Math.ceil(countProducts / pagination.perPage),
            namepage: "product"
        })
    } catch (error) {
        console.log(error);
    }
}

const addProduct = async (req, res) => {
    const dataCategory = await CategoriesModel.find()
    res.render('admin/add_product', {
        categories: dataCategory,
        error: null,
        message: null
    })
}

const newProduct = async (req, res) => {
    const product = {
        name: req.body.prd_name,
        slug: slugify(req.body.prd_name, { replacement: '-'}),
        price: req.body.prd_price,
        warranty: req.body.prd_warranty,
        accessories: req.body.prd_accessories,
        promotion: req.body.prd_promotion,
        status: req.body.prd_new,
        thumbnail: req.files.prd_image,
        cat_id: req.body.cat_id,
        is_stock: req.body.prd_is_stock,
        features: req.body.prd_featured,
        description: req.body.prd_details
    }
    const uploadImage = config.get('app.file_upload') + product.thumbnail.name
    product.thumbnail.mv(uploadImage)
    const dataCategory = await CategoriesModel.find()
    try {
        const createProduct = new ProductsModel({
            name: product.name,
            slug: product.slug,
            price: product.price,
            warranty: product.warranty,
            accessories: product.accessories,
            promotion: product.promotion,
            status: product.status,
            thumbnail: '/products/' + product.thumbnail.name,
            cat_id: product.cat_id,
            is_stock: product.is_stock,
            features: product.features,
            description: product.description
        })
        const saveProduct = await createProduct.save()
        res.render('admin/add_product', {
            message: "Thêm thành công ",
            error: null,
            categories: dataCategory
        })
    } catch (error) {
        res.render('admin/add_product', {
            error: error.message,
            message: null,
            categories: dataCategory
        })
    }
}

const editProduct = async (req, res) => {
    const product = await findIdProduct(req.params.id)
    const dataCategory = await CategoriesModel.find()
    res.render('admin/edit_product', {
        categories: dataCategory,
        product: product,
        error: null,
        message: null
    })
}

const updateProduct = async (req, res) => {
    const product = {
        name: req.body.prd_name,
        slug: req.body.prd_name,
        price: req.body.prd_price,
        warranty: req.body.prd_warranty,
        accessories: req.body.prd_accessories,
        promotion: req.body.prd_promotion,
        status: req.body.prd_new,
        thumbnail: req.files.prd_image,
        cat_id: req.body.cat_id,
        is_stock: req.body.prd_is_stock,
        features: req.body.prd_featured,
        description: req.body.prd_details
    }
    const uploadImage = config.get('app.file_upload') + product.thumbnail.name
    product.thumbnail.mv(uploadImage)
    const dataProduct = await findIdProduct(req.params.id)
    const dataCategory = await CategoriesModel.find()
    try {
        const updateProduct = await ProductsModel.findByIdAndUpdate({
            _id: req.params.id
        }, {
            name: product.name,
            slug: product.slug,
            price: product.price,
            warranty: product.warranty,
            accessories: product.accessories,
            promotion: product.promotion,
            status: product.status,
            thumbnail: '/products/' + product.thumbnail.name,
            cat_id: product.cat_id,
            is_stock: product.is_stock,
            features: product.features,
            description: product.description
        })
        const updateData = await findIdProduct(req.params.id)
        res.render('admin/edit_product', {
            message: "Update thành công ",
            product: updateProduct,
            error: null,
            categories: dataCategory
        })
    } catch (error) {
        res.render('admin/edit_product', {
            error: error.message,
            message: null,
            product: dataProduct,
            categories: dataCategory
        })
    }

}

const deleteProduct = async (req, res) => {
    try {
        const product = await ProductsModel.deleteOne({
            _id: req.params.id
        })
        res.redirect('/admin/product')
    } catch (error) {
        console.log(error);
    }
}

const findIdProduct = async (idProduct) => {
    const productId = await ProductsModel.findOne({
        _id: idProduct
    })
    return productId
}
module.exports = {
    indexProduct: indexProduct,
    addProduct: addProduct,
    newProduct: newProduct,
    editProduct: editProduct,
    updateProduct: updateProduct,
    deleteProduct: deleteProduct
}