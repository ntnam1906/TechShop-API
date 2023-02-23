const CategoriesModel = require('../models/categories');

const indexCategory = async (req, res) => {
    const pagination = {
        page: req.params.page || 1,
        perPage: 10,
    }
    const noPage = (pagination.perPage * pagination.page) - pagination.perPage
    try {
        const categories = await CategoriesModel.find().skip(noPage).limit(pagination.perPage)
        const countUsers = await CategoriesModel.countDocuments()
        res.render('admin/category', {
            categories: categories,
            current: pagination.page,
            pages: Math.ceil(countUsers / pagination.perPage),
            namepage: "category"
        })
    } catch (error) {
        console.log(error);
    }
}

const addCategory = (req, res) => {
    res.render('admin/add_category', {
        error: null,
        message: null,
    })
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
            res.render('admin/add_category', {
                error: null,
                message: "Thêm thành công "
            })
        } else if (titleCategory == checkTitle.title) {
            res.render('admin/add_category', {
                error: "Danh mục đã tồn tại ! ",
                message: null
            })
        }
    } catch (error) {
        res.render('admin/add_category', {
            error: error.message,
            message: null,
        })
    }
}

const editCategory = async (req, res) => {
    const dataCategory = await findIdCategory(req.params.id)
    res.render('admin/edit_category', {
        category: dataCategory,
        error: null,
        message: null
    })
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
            const updateData = await findIdCategory(req.params.id)
            res.render('admin/edit_category', {
                category: updateData,
                error: null,
                message: "Update thành công"
            })
        } else if (titleCategory === checkTitle.title) {
            res.render('admin/edit_category', {
                category: dataCategory,
                error: "Danh mục đã tồn tại !",
                message: null
            })
        }

    } catch (error) {
        res.render('admin/edit_category', {
            category: dataCategory,
            error: error.message,
            message: null
        })
    }
}

const deleteCategory = async (req, res) => {
    try {
        const idCategory = await CategoriesModel.deleteOne({
            _id: req.params.id
        })
        res.redirect('/admin/category')
    } catch (error) {
        console.log(error);
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
    addCategory: addCategory,
    newCategory: newCategory,
    editCategory: editCategory,
    updateCategory: updateCategory,
    deleteCategory: deleteCategory
}