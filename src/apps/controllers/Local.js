const ProductsModel = require('../models/products');
const CategoriesModel = require('../models/categories');
const CartModel = require('../models/carts');
const CommentModel = require('../models/comments');
const UsersModel = require('../models/users');
const OrdersModel = require('../models/orders');
const indexLocal = async (req, res) => {
    try {
        const userId = req.session.userId
        const featuredPrd = await ProductsModel.find({
            featured: true
        }).limit(6).sort({ updatedAt: -1 })

        const statusPrd = await ProductsModel.find({
            status: "Máy Mới 100%",
            is_stock: true
        }).limit(6).sort({ updatedAt: -1 })

        const dataCategory = await getAllCategories()

        if (userId) {
            const result = await checkCart(userId)
            res.status(200).json({
                featuredPrds: featuredPrd,
                statusPrds: statusPrd,
                cartPrds: result,
                categories: dataCategory
            })
            
        } else {
           res.status(200).json({
                featuredPrds: featuredPrd,
                statusPrds: statusPrd,
                categories: dataCategory
            })
        }
        
    }
    catch (err) {
        res.status(404).json({
            message: err.message
        })
    }
}

const categoryLocal = async (req, res) => {
    const idCategory = req.params.id
    const userId = req.session.userId
    const pagination = {
        page: Number(req.query.page) || 1,
        perPage: 9,
    }
    const noPage = (pagination.perPage * pagination.page) - pagination.perPage
    try {
        const titleCategory = await CategoriesModel.findById({
            _id: idCategory
        })

        const limitPrd = await ProductsModel.find({
            cat_id: idCategory
        }).skip(noPage).limit(pagination.perPage)

        const dataPrds = await ProductsModel.countDocuments({
            cat_id: idCategory
        })

        const dataCategory = await getAllCategories()

        if (userId) {
            const result = await checkCart(userId)
            res.status(200).json({
                products: limitPrd,
                total: dataPrds,
                title: titleCategory.title,
                current: pagination.page,
                pages: Math.ceil(dataPrds / pagination.perPage),
                url: `/category/${idCategory}?`,
                cartPrds: result,
                categories: dataCategory
            })
        } else {
            res.status(200).json({
                products: limitPrd,
                total: dataPrds,
                title: titleCategory.title,
                current: pagination.page,
                pages: Math.ceil(dataPrds / pagination.perPage),
                url: `/category/${idCategory}?`,
                categories: dataCategory
            })
        }
    } catch (error) {
        res.status(404).json({
            message: error.message
        })
    }
}

const productLocal = async (req, res) => {
    const idPrd = req.params.id
    const userId = req.session.userId
    const dataPrd = await ProductsModel.findById({
        _id: idPrd
    })
    const dataComment = await CommentModel.find({
        prd_id: idPrd
    }).populate({
        path: 'user_id',
        select: 'full_name',
    })

    const dataCategory = await getAllCategories()
    try {
        if (userId) {
            const result = await checkCart(userId)
            res.status(200).json({
                product: dataPrd,
                cartPrds: result,
                categories: dataCategory,
                comments: dataComment
            })
        } else {
            res.status(200).json({
                product: dataPrd,
                categories: dataCategory,
                comments: dataComment
            })
        }
    } catch (error) {
        res.status(404).json({
            message: "Không có thiết bị này"
        })
    }
}

const addProductLocal = async (req, res) => {
    try {
        const userId = req.userId
        if (userId) {
            const idPrd = req.params.id
            const dataPrd = await ProductsModel.findById({
                _id: idPrd
            })
            const addCart = await CartModel.create({
                user_id: userId,
                items: dataPrd
            })
            if (addCart) {
                const result = await checkCart(userId)
                res.status(200).json({
                    message: "Sản phẩm đã được thêm vào giỏ hàng",
                    cartPrds: result
                })
            }
        } else {
            return res.status(401).json({
                message: 'UNAUTHORIZED',
            });
        }
    }
    catch(error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

const commentPrdLocal = async (req, res) => {
    const userId = req.userId
    const user = await UsersModel.findById(userId)
    if (user) {
        const prdId = req.params.id
        const content = req.body.comm_details
        const comment = await CommentModel.create({
            user_id: userId,
            prd_id: prdId,
            body: content
        })
        if (comment) {
            res.status(200).json({
                message: 'SUCCESS',
            });
        }
    } else {
        return res.status(401).json({
            message: 'UNAUTHORIZED',
          });
    }
}
const getCommentProduct = async(req, res) => {
    try {
        const prdId = req.params.id
        const comments = await CommentModel.find({prd_id: prdId}).populate('user_id')
        const users = await UsersModel.find()

        res.status(200).json({
            comments: comments,
            users: users,
            message: "ok"
        })

    }
    catch(error) {
        console.log(error)
    }
}


const cartLocal = async (req, res) => {
    const userId = req.userId
    const user = await UsersModel.findById(userId)
    if (user) {
        const dataCategory = await getAllCategories()
        const dataCart = await CartModel.find({
            user_id: userId
        })
        const result = await checkCart(userId)
        let totalMoney = 0
        for (const doc of dataCart) {
            totalMoney += doc.items.price
        }
        if (dataCart) {
            res.status(200).json({
                dataCart: dataCart,
                totalMoney: totalMoney,
                cartPrds: result,
            })
        }
    } else {
        res.status(401).json({
            message: "UNAUTHORIZED"
        })
    }
}

const deleteCartLocal = async (req, res) => {
    const userId = req.userId
    const user = await UsersModel.findById(userId)
    if (user) {
        const dataCart = await CartModel.deleteOne({
            _id: req.params.id
        })
        if (dataCart) {
            res.status(200).json({
                message: 'Xóa thành công',
                data: dataCart
            })
        }
    } else {
        res.status(401).json({
            message: "UNAUTHORIZED"
        })
    }
}


const payCartLocal = async (req, res) => {
    try {
        const userId = req.userId
        const shippingAddress = {
            fullName: req.body.fullName,
            address: req.body.address,
            email: req.body.email,
            phone: req.body.phone,
        }
        const user = await UsersModel.findById(userId)
        if (user) {
            const dataCart = await CartModel.find({
                user_id: userId
            })
            let totalMoney = 0
            for (const doc of dataCart) {
                totalMoney += doc.items.price
            }
            const addOrder = await OrdersModel.create({
                products: dataCart,
                shippingAddress: shippingAddress,
                totalPrice: totalMoney,
                user: userId,
                isPaid: false,
                isComfirmed: false,
                isCancle: false,
            })
            if(addOrder) {
                await CartModel.deleteMany({user_id: userId})
                return res.status(201).json({
                    message: "Sản phẩm đã được mua thành công",
                    id: addOrder._id
                })
            }
        } else {
            res.status(401).json({
                message: "UNAUTHORIZED"
            })
        }
    }
    catch(error) {
        res.status(500).json({
            message: error.message

        })
    } 
}

const searchLocal = async (req, res) => {
    const keyword = req.query.keyword
    if (keyword) {
        const regex = new RegExp(escapeRegex(keyword), 'gi')
        const userId = req.session.userId
        const pagination = {
            page: Number(req.query.page) || 1,
            perPage: 9,
        }
        const noPage = (pagination.perPage * pagination.page) - pagination.perPage

        const dataPrd = await ProductsModel.find({
            name: regex
        }).skip(noPage).limit(pagination.perPage).sort({ updatedAt: -1 })
        const length = await ProductsModel.countDocuments({
            name: regex
        })

        const dataCategory = await getAllCategories()

        if (userId) {
            const result = await checkCart(userId)

            res.status(200).json({
                cartPrds: result,
                dataPrd: dataPrd,
                search: keyword,
                current: pagination.page,
                pages: Math.ceil(length / pagination.perPage),
                url: `/search?keyword=${keyword}&`,
                categories: dataCategory,
                length: length
            })
        } else {
            res.status(200).json({
                dataPrd: dataPrd,
                search: keyword,
                current: pagination.page,
                pages: Math.ceil(length / pagination.perPage),
                url: `/search?keyword=${keyword}&`,
                categories: dataCategory,
                length: length
            })
        }
    } else {
        res.redirect('/')
    }
}

async function checkCart(idUser) {
    const amoutCart = await CartModel.countDocuments({
        user_id: idUser
    })
    return amoutCart
}

async function getAllCategories() {
    const categories = await CategoriesModel.find()
    return categories
}

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
}

module.exports = {
    indexLocal: indexLocal,
    categoryLocal: categoryLocal,
    productLocal: productLocal,
    addProductLocal: addProductLocal,
    cartLocal: cartLocal,
    deleteCartLocal: deleteCartLocal,
    payCartLocal: payCartLocal,
    searchLocal: searchLocal,
    commentPrdLocal: commentPrdLocal,
    getCommentProduct: getCommentProduct,
}