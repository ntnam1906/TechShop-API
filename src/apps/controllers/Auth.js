const UsersModel = require('../models/users')
const bcrypt = require('bcrypt')
const getToken = require('../services/JwtService')


const loginAdmin = async (req, res) => {
    const mail = req.body.email
    const pass = req.body.pass

    const dataUser = await UsersModel.findOne({
        email: mail,
    })
    if (dataUser) {
        const comparePassword = await bcrypt.compareSync(pass, dataUser.password)
        if(!comparePassword) {
            return res.status(401).json({
                message: 'Mật khẩu không đúng',
            });
        }
        else {
            if(dataUser.role !== "admin") {
                return res.status(401).json({
                    message: 'Bạn chưa đủ quyền để vào trang này',
                });
            }
            else {
                const accessToken = await getToken.generalAccessToken({
                    id: dataUser._id,
                })
                const refreshToken = await getToken.generalRefreshToken({
                    id: dataUser._id,
                })
                return res.status(200).json({
                    message: 'Đăng nhập thành công',
                    access_token: accessToken,
                    refresh_token: refreshToken,
                    isAdmin: dataUser.isAdmin
                });
            }
        }
    } else {
        return res.status(401).json({
            message: 'Email chưa được đăng ký',
        });
    }
}

const getLogout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login')
    })
}


const loginLocal = async (req, res) => {
    const mail = req.body.email
    const pass = req.body.pass

    const dataUser = await UsersModel.findOne({
        email: mail,
    })

    if (dataUser) {
        const comparePassword = await bcrypt.compareSync(pass, dataUser.password)
        if(!comparePassword) {
            return res.status(401).json({
                message: 'Mật khẩu không đúng',
            });
        }
        else {
            const accessToken = await getToken.generalAccessToken({
                id: dataUser._id,
            })
            const refreshToken = await getToken.generalRefreshToken({
                id: dataUser._id,
            })
            return res.status(200).json({
                message: 'Đăng nhập thành công',
                access_token: accessToken,
                refresh_token: refreshToken,
                isAdmin: dataUser.isAdmin
            });
        }
    } else {
        return res.status(401).json({
            message: 'Email chưa được đăng ký',
        });
    }
}


const registerLocal = async (req, res) => {
    try {
        const user = {
            full_name: req.body.full_name,
            email: req.body.email,
            password: req.body.pass,
            re_pass: req.body.re_pass
        }
    
        if (!user.full_name || !user.email || !user.password || !user.re_pass) {
            return res.status(401).json({
                message: 'Không được để trống dữ liệu',
            });
        }
    
        if (user.password.length < 6) {
            return res.status(401).json({
                message: 'Mật khẩu phải từ 6 kí tự trở lên',
              });
        }
        const checkemail = await UsersModel.findOne({
            email: user.email
        })
        try {
            if (!checkemail) {
                if (user.password === user.re_pass) {
                    ////Hash Password
                    const hash = bcrypt.hashSync(user.password, 10)

                    const createUser = new UsersModel({
                        full_name: user.full_name,
                        email: user.email,
                        password: hash,
                        role: "member"
                    })
                    const result = await createUser.save()
                    if (result) {
                        req.session.mail = result.email
                        req.session.pass = result.password
                        req.session.userId = result._id
                        res.status(201).json({
                            message: 'Tạo tài khoản thành công',
                            data: result
                        })
                    }
                } else {
                    return res.status(401).json({
                        message: 'Nhập lại mật khẩu không đúng',
                    });
                }
            } else {
                return res.status(401).json({
                    message: 'Email đã được sử dụng',
                });
            }
        } catch (error) {
            return res.status(401).json({
                message: error.message,
            });
        }
    }
    catch(e) {
        return res.status(401).json({
            message: e.message
        })
    }
}

const logoutLocal = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
}
module.exports = {
    loginAdmin: loginAdmin,
    getLogout: getLogout,
    loginLocal: loginLocal,
    registerLocal: registerLocal,
    logoutLocal: logoutLocal,
}