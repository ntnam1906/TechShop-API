const UsersModel = require('../models/users')

const getLogin = (req, res) => {
    res.render('admin/login', {
        error: null
    })
}

const postLogin = async (req, res) => {
    const mail = req.body.mail
    const pass = req.body.pass

    const dataUser = await UsersModel.findOne({
        email: mail,
        password: pass
    })
    if (dataUser) {
        if (dataUser.role === 'admin') {
            req.session.mail
            req.session.pass
            res.redirect('/admin/dashboard')
        } else {
            res.render('admin/login', {
                error: "Bạn chưa đủ quyền để vào trang này!!"
            })
        }
    } else {
        res.render('admin/login', {
            error: "Email hoặc mật khẩu không đúng "
        })
    }
}

const getLogout = (req, res) => {
    req.session.destroy()
    res.render('admin/login', {
        error: null
    })
}


const loginLocal = (req, res) => {
    const userId = req.session.userId
    if (userId) {
        res.redirect('/')
    } else {
        res.render('local/login', {
            error: null
        })
    }
}

const postLoginLocal = async (req, res) => {
    const mail = req.body.mail
    const pass = req.body.pass

    const dataUser = await UsersModel.findOne({
        email: mail,
        password: pass
    })

    if (dataUser) {
        if (dataUser.role === 'member') {
            req.session.mail
            req.session.pass
            req.session.userId = dataUser._id
            res.redirect('/')
        } else if (dataUser.role) {
            res.redirect('/admin/dashboard')
        }
    } else {
        res.render('local/login', {
            error: "Email hoặc mật khẩu không đúng "
        })
    }
}

const registerLocal = (req, res) => {
    res.render('local/register', {
        error: null,
    })
}

const postRegisterLocal = async (req, res) => {
    const user = {
        full_name: req.body.full_name,
        email: req.body.email,
        password: req.body.pass,
        re_pass: req.body.re_pass
    }

    if (!user.full_name || !user.email || !user.password || !user.re_pass) {
        return res.render('local/register', {
            error: "Không được để trống dữ liệu",
        })
    }

    if (user.password.length < 5) {
        return res.render('local/register', {
            error: "Mật khẩu phải từ 6 ký tự trở lên !",
        })
    }
    const checkemail = await UsersModel.findOne({
        email: user.email
    })
    try {
        if (!checkemail) {
            if (user.password === user.re_pass) {
                const createUser = new UsersModel({
                    full_name: user.full_name,
                    email: user.email,
                    password: user.password,
                    role: "member"
                })
                const result = await createUser.save()
                if (result) {
                    req.session.mail = result.email
                    req.session.pass = result.password
                    req.session.userId = result._id
                    res.render('local/success', {
                        message: " Đăng ký thành công "
                    })
                }
            }
        } else {
            res.render('local/register', {
                error: "Email đã được sử dụng !!",
            })
        }
    } catch (error) {
        res.render('local/register', {
            error: error.message,
        })
    }
}

const logoutLocal = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
}
module.exports = {
    getLogin: getLogin,
    postLogin: postLogin,
    getLogout: getLogout,
    loginLocal: loginLocal,
    registerLocal: registerLocal,
    postLoginLocal: postLoginLocal,
    postRegisterLocal: postRegisterLocal,
    logoutLocal: logoutLocal,
}