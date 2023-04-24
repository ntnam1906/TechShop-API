const ProductsModel = require('../models/products');
const CategoriesModel = require('../models/categories');
const config = require('config');
const slugify = require('slugify');
const multer = require('multer');
const fs = require('fs');
const Buffer = require('buffer')
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
        res.status(200).json({
            products: products,
            current: pagination.page,
            pages: Math.ceil(countProducts / pagination.perPage),
            namepage: "product"
        })
    } catch (error) {
        res.status(404).json({
            massage: error.message
        })
    }
}


const newProduct = async (req, res) => {
    try {
    const imagePath = req.file.path

    const buffer = fs.readFileSync(imagePath)
    const product = new ProductsModel({
        name: req.body.prd_name,
        slug: slugify(req.body.prd_name, { replacement: '-'}),
        price: req.body.prd_price,
        warranty: req.body.prd_warranty,
        accessories: req.body.prd_accessories,
        promotion: req.body.prd_promotion,
        status: req.body.prd_new,
        thumbnail: {
            data: buffer,
            contentType: 'image/png'
        },
        cat_id: req.body.cat_id,
        is_stock: req.body.prd_is_stock,
        features: req.body.prd_featured,
        description: req.body.prd_details
    })
    const saveProduct = await product.save()
    if(saveProduct) {
        res.status(201).json({
            message: 'Thêm sản phẩm thành công',
            data: saveProduct
        })
    }
    
        
    } catch (error) {
        return console.log(error)
    }
}


const updateProduct = async (req, res) => {
    
    try {
        const imagePath = req.file.path
    
        const buffer = fs.readFileSync(imagePath)
        const product = {
            name: req.body.prd_name,
            slug: req.body.prd_name,
            price: req.body.prd_price,
            warranty: req.body.prd_warranty,
            accessories: req.body.prd_accessories,
            promotion: req.body.prd_promotion,
            status: req.body.prd_new,
            thumbnail: {
                data: buffer,
                contentType: 'image/png'
            },
            cat_id: req.body.cat_id,
            is_stock: req.body.prd_is_stock,
            features: req.body.prd_featured,
            description: req.body.prd_details
        }
        
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
            thumbnail: product.thumbnail,
            cat_id: product.cat_id,
            is_stock: product.is_stock,
            features: product.features,
            description: product.description
        })
       
        if(updateProduct) {
            res.status(201).json({
                message: 'Update sản phẩm thành công',
            })
        }
    } catch (error) {
        res.status(500).json({
            message: error.message,
        })
    }

}

const deleteProduct = async (req, res) => {
    try {
        const product = await ProductsModel.deleteOne({
            _id: req.params.id
        })
       if(product) {
        res.status(200).json({
            message: "Xóa sản phẩm thành công",
            data: product
        })
       }
    } catch (error) {
        res.status(404).json({
            message: error.message
        })
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
    newProduct: newProduct,
    updateProduct: updateProduct,
    deleteProduct: deleteProduct
}