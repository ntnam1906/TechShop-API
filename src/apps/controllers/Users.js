const UsersModel = require('../models/users');

const indexUsers = async (req, res) => {
    const pagination = {
        page: req.params.page || 1,
        perPage: 10,
    }
    const noPage = (pagination.perPage * pagination.page) - pagination.perPage
    try {
        const users = await UsersModel.find().skip(noPage).limit(pagination.perPage)
        const countUsers = await UsersModel.countDocuments()
        res.render('admin/user', {
            users: users,
            current: pagination.page,
            pages: Math.ceil(countUsers / pagination.perPage),
            namepage: "user"
        })
    } catch (error) {
        console.log(error);
    }
}

const addUsers = async (req, res) => {
    res.render('admin/add_user', {
        error: null,
        message: null
    })
}

const newUsers = async (req, res) => {
    const User = {
        name: req.body.user_full,
        email: req.body.user_mail,
        pass: req.body.user_pass,
        rePass: req.body.user_re_pass,
        role: req.body.user_level
    }

    if (!User.name || !User.email || !User.pass || !User.rePass) {
        return res.render('admin/add_user', {
            error: "Không được để trống dữ liệu !",
            message: null
        })
    }

    if (User.pass.length < 5) {
        return res.render('admin/add_user', {
            error: "Mật khẩu phải từ 6 ký tự trở lên !",
            message: null
        })
    }

    try {
        const checkEmail = await findEmail(User)
        if (!checkEmail) {
            if (User.pass === User.rePass) {
                const createUser = new UsersModel({
                    full_name: User.name,
                    email: User.email,
                    password: User.pass,
                    role: User.role
                })
                const result = await createUser.save()
                return res.render('admin/add_user', {
                    message: "Thêm thành công",
                    error: null
                })
            } else {
                return res.render('admin/add_user', {
                    error: "Mật khẩu không khớp",
                    message: null
                })
            }
        } else if (User.email == checkEmail.email) {
            return res.render('admin/add_user', {
                error: "Email đã tồn tại !",
                message: null
            })
        }
    } catch (error) {
        return res.render('admin/add_user', {
            error: error.message,
            message: null
        })
    }
}

const editUsers = async (req, res) => {
    const user = await UsersModel.findOne({
        _id: req.params.id
    })
    res.render('admin/edit_user', {
        user: user,
        error: null,
        message: null
    })
}

const updateUsers = async (req, res) => {
    const User = {
        full_name: req.body.user_full,
        email: req.body.user_mail,
        pass: req.body.user_pass,
        rePass: req.body.user_re_pass,
        role: req.body.user_level
    }

    const dataUser = await UsersModel.findOne({
        _id: req.params.id
    })

    if (!User.full_name || !User.email || !User.pass || !User.rePass) {
        return res.render('admin/edit_user', {
            error: "Không được để trống dữ liệu !",
            message: null,
            user: dataUser
        })
    }
    if (User.pass.length < 5) {
        return res.render('admin/edit_user', {
            error: "Mật khẩu phải từ 6 ký tự trở lên !",
            message: null,
            user: dataUser
        })
    }

    try {
        const checkEmail = await findEmail(User)
        if (!checkEmail) {
            if (User.pass === User.rePass) {
                const updateUser = await UsersModel.findOneAndUpdate({
                    _id: req.params.id
                }, {
                    full_name: User.full_name,
                    email: User.email,
                    pass: User.pass,
                    role: User.role
                })

                return res.render('admin/edit_user', {
                    user: updateUser,
                    message: "Update thành công",
                    error: null
                })

            } else {
                return res.render('admin/edit_user', {
                    error: "Mật khẩu không khớp",
                    user: dataUser,
                    message: null
                })
            }
        } else if (User.email == checkEmail.email) {
            return res.render('admin/edit_user', {
                error: "Email đã tồn tại !",
                message: null,
                user: dataUser
            })
        }

    } catch (error) {
        res.render('admin/edit_user', {
            user: dataUser,
            error: error.message,
            message: null
        })
    }
}

const deleteUsers = async (req, res) => {
    try {
        const idUser = await UsersModel.deleteOne({
            _id: req.params.id
        })
        res.redirect('/admin/user')
    } catch (error) {
        console.log(error);
    }
}


const findEmail = async (User) => {
    const userEmail = await UsersModel.findOne({
        email: User.email
    })
    return userEmail
}


module.exports = {
    indexUsers: indexUsers,
    addUsers: addUsers,
    newUsers: newUsers,
    editUsers: editUsers,
    updateUsers: updateUsers,
    deleteUsers: deleteUsers
}