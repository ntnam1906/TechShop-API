const UsersModel = require('../models/users');
const CommentsModel = require('../models/comments');
const bcrypt = require('bcrypt')
const { sendActivationEmail } = require('../functions/sendEmail')
const { generateConfirmationToken } = require('../functions/token')

const indexUsers = async (req, res) => {
    const pagination = {
        page: req.params.page || 1,
        perPage: 10,
    }
    const noPage = (pagination.perPage * pagination.page) - pagination.perPage
    try {
        const users = await UsersModel.find().skip(noPage).limit(pagination.perPage).sort({ updatedAt: -1 })
        const countUsers = await UsersModel.countDocuments()
        res.status(200).json({
            users: users,
            current: pagination.page,
            pages: Math.ceil(countUsers / pagination.perPage),
            namepage: "user"
        })
    } catch (error) {
        res.status(404).json({
            massage: error.massage
        })
    }
}


const newUsers = async (req, res) => {
    const User = {
        name: req.body.full_name,
        email: req.body.email,
        pass: req.body.pass,
        role: req.body.role
    }

    if (!User.name || !User.email || !User.pass) {
        return res.status(404).json({
            message: 'Không được để trống dữ liệu',
        });
    }

    if (User.pass.length < 6) {
        return res.status(404).json({
            message: 'Mật khẩu phải từ 6 kí tự trở lên',
        });
    }

    try {
        const checkEmail = await findEmail(User)
        if (!checkEmail) {
            const confirmationToken = generateConfirmationToken();
            sendActivationEmail(User.email, confirmationToken);

            const hash = bcrypt.hashSync(User.pass, 10)

            const createUser = new UsersModel({
                full_name: User.name,
                email: User.email,
                password: hash,
                role: User.role,
                isActivated: false,
                confirmationToken: confirmationToken
            })
            const result = await createUser.save()
            if(result) {
                res.status(201).json({
                    message: 'Thêm tài khoản thành công',
                    data: result
                })
            }
        } else if (User.email == checkEmail.email) {
            return res.status(404).json({
                message: 'Email đã tồn tại',
            });
        }
    } catch (error) {
        return res.status(404).json({
            message: error.message,
        });
    }
}



const updateUsers = async (req, res) => {
    const User = {
        name: req.body.full_name,
        email: req.body.email,
        pass: req.body.pass,
        role: req.body.role
    }
    const dataUser = await UsersModel.findOne({
        _id: req.params.id
    })

    if (!User.name || !User.email || !User.pass || !User.role) {
        return res.status(404).json({
            message: 'Không được để trống dữ liệu',
        });
    }

    if (User.pass.length < 6) {
        return res.status(404).json({
            message: 'Mật khẩu phải từ 6 kí tự trở lên',
        });
    }
    

    try {
        if(dataUser.email === User.email) {
            const hash = bcrypt.hashSync(User.pass, 10)

            const updateUser = await UsersModel.findOneAndUpdate({
                _id: req.params.id
            }, {
                full_name: User.name,
                pass: hash,
                role: User.role
            })

            if(updateUser) {
                res.status(201).json({
                    message: 'Update thành công',
                    data: updateUser
                })
            }
        }
        else {
            const checkEmail = await findEmail(User)
            if (!checkEmail) {
                const hash = bcrypt.hashSync(User.pass, 10)
    
                const updateUser = await UsersModel.findOneAndUpdate({
                    _id: req.params.id
                }, {
                    full_name: User.name,
                    email: User.email,
                    pass: hash,
                    role: User.role,
                    isActivated: false
                })
    
                if(updateUser) {
                    res.status(201).json({
                        message: 'Update thành công',
                        data: updateUser
                    })
                }
               
            } else if (User.email == checkEmail.email) {
                return res.status(404).json({
                    message: 'Email đã tồn tại',
                });
            }
        }

    } catch (error) {
        return res.status(404).json({
            message: error.message,
        });
    }
}

const deleteUsers = async (req, res) => {
    try {
        const userId = req.userId
        if(userId === req.params.id) {
            return res.status(500).json({
                message: 'Không thể tự xóa chính mình'
            })
        }
        else {
            const comments = await CommentsModel.find()
            const idUser = await UsersModel.deleteOne({
                _id: req.params.id
            })
            await comments.forEach(async (comment) => {
                if (comment.user_id.equals(req.params.id)) {
                  const success = await CommentsModel.deleteOne({ _id: comment._id });
                }
            });
            if(idUser) {
                res.status(200).json({
                    message: 'Xóa thành công',
                })
            }
        }
    } catch (error) {
        res.status(404).json({
            message: error.message
        })
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
    newUsers: newUsers,
    updateUsers: updateUsers,
    deleteUsers: deleteUsers
}