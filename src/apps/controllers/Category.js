const CategoriesModel = require('../models/categories');
const ProductsModel = require('../models/products');
const indexCategory = async (req, res) => {
    const pagination = {
        page: req.params.page || 1,
        perPage: 10,
    }
    const noPage = (pagination.perPage * pagination.page) - pagination.perPage
    try {
        const categories = await CategoriesModel.find().skip(noPage).limit(pagination.perPage).sort({ updatedAt: -1 })
        const countCategories = await CategoriesModel.countDocuments()
        res.status(200).json({
            categories: categories,
            current: pagination.page,
            pages: Math.ceil(countCategories / pagination.perPage),
            namepage: "category"
        })
        
    } catch (error) {
        res.status(404).json({
            massage: error.message
        })
    }
}


const newCategory = async (req, res) => {
    const titleCategory = req.body.cat_name

    const checkTitle = await findCategory(titleCategory)
    try {
        if (!checkTitle) {
            const createCategory = new CategoriesModel({
                description: null,
                title: titleCategory,
                slug: titleCategory
            })
            const saveCategory = await createCategory.save()
            if(saveCategory) {
                res.status(201).json({
                    message: 'Thêm danh mục thành công',
                    data: saveCategory
                })
            }
        } else if (titleCategory == checkTitle.title) {
            res.status(404).json({
                message: 'Danh mục đã tồn tại',
            })
        }
    } catch (error) {
        res.status(404).json({
            message: error.message,
        })
    }
}


const updateCategory = async (req, res) => {
    const titleCategory = req.body.cat_name

    const dataCategory = await findIdCategory(req.params.id)

    try {
        const checkTitle = await findCategory(titleCategory)
        if (!checkTitle) {
            const updateCategory = await CategoriesModel.findByIdAndUpdate({
                _id: req.params.id
            }, {
                description: null,
                title: titleCategory,
                slug: titleCategory
            })
            // const updateData = await findIdCategory(req.params.id)
            if(updateCategory) {
                res.status(200).json({
                    message: "Update danh mục thành công"
                })
            }
        } else if (titleCategory === checkTitle.title) {
            res.status(404).json({
                message: "Danh mục đã tồn tại"
            })
        }

    } catch (error) {
        res.status(404).json({
            message: error.message
        })
    }
}

const deleteCategory = async (req, res) => {
    try {
        const products = await ProductsModel.find()
        const idCategory = await CategoriesModel.deleteOne({
            _id: req.params.id
        })
        await products.forEach(async (product) => {
            if (product.cat_id.equals(req.params.id)) {
              const success = await ProductsModel.deleteOne({ _id: product._id });
            }
        });
        if(idCategory) {
            res.status(200).json({
                message: "Xóa danh mục thành công",
                data: idCategory,
            })
           }
    } catch (error) {
        res.status(404).json({
            message: error.message
        })
    }
}

const findCategory = async (category) => {
    const categoryTitle = await CategoriesModel.findOne({
        title: category
    })
    return categoryTitle
}

const findIdCategory = async (idCategory) => {
    const categoryId = await CategoriesModel.findOne({
        _id: idCategory
    })
    return categoryId
}
module.exports = {
    indexCategory: indexCategory,
    newCategory: newCategory,
    updateCategory: updateCategory,
    deleteCategory: deleteCategory
}