const UsersModel = require('../models/users')
const bcrypt = require('bcrypt')
const getToken = require('../services/JwtService')
const { sendActivationEmail } = require('../functions/sendEmail')
const { generateConfirmationToken } = require('../functions/token')
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
    res.clearCookie('access_admin_token');
    res.status(200).json({
        message: 'Đăng xuất thành công'
      });
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
                full_name: dataUser.full_name,
                email: dataUser.email,
                password: dataUser.password,
                isActivated: dataUser.isActivated
            })
            const refreshToken = await getToken.generalRefreshToken({
                id: dataUser._id,
            })
            if (!dataUser.isActivated) {
                return res.status(500).json({
                  message: `User is not activated`,
                  access_token: accessToken
                });
            }
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

const changePassword = async (req, res, next) => {
    try {
      let userId = req.userId;
      let user = await UsersModel.findById(userId);
      if (user == null) {
        return res.status(401).json({
          message: 'UNAUTHORIZED',
        });
      }
      const { currentPassword, newPassword } = req.body;
      // password
      
      const validPassword = await bcrypt.compare(currentPassword, user.password);
      if (!validPassword) {
        return res.status(400).json({
          message: 'Mật khẩu cũ không đúng !',
          code: 'CURRENT_PASSWORD_INCORRECT',
        });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({
            message: 'Mật khẩu mới phải từ 6 kí tự trở lên',
          });
    }
    if(newPassword === currentPassword) {
        return res.status(400).json({
            message: 'Mật khẩu mới phải khác mật khẩu cũ',
          });
    }
      //Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedNewPassword = await bcrypt.hash(newPassword, salt);
  
      user = await UsersModel.findOneAndUpdate(
        { _id: userId },
        {
          password: hashedNewPassword,
        },
        {
          new: true,
          runValidators: true,
        }
      );
  
      if (!user) {
        return res
          .status(404)
          .json({ message: 'Can not find user' });
      }
  
      // create and assign a token
      const accessToken = await getToken.generalAccessToken({
            full_name: user.full_name,
            email: user.email,
            password: user.password,
            id: user._id,
            isActivated: user.isActivated
        })
        const refreshToken = await getToken.generalRefreshToken({
            full_name: user.full_name,
            email: user.email,
            password: user.password,
            id: user._id,
        })
      user = await UsersModel.findById(userId)
      return res.status(200).json({
        message: "Đổi mật khẩu thành công",
        data: user,
        access_token: accessToken,
        refresh_token: refreshToken
      });
    } catch (e) {
      return res.status(500).json({
        message: e.message,
      });
    }
  };

const activateAccount =  async (req, res, next) => {
  
  try {
      const userId = req.userId
      const token = req.body.token
      const user = await UsersModel.findById(userId);
  
      if (!user) {
        return res.status(500).json({
          message: 'User not found!',
        });
      }
  
      if (user.confirmationToken !== token) {
        return res.status(500).json({
          message: 'Mã xác minh không chính xác',
        });
      }
  
      await UsersModel.findByIdAndUpdate(user._id, {
        isActivated: true,
      });
      const newUser = await UsersModel.findById(userId)
      const accessToken = await getToken.generalAccessToken({
        full_name: newUser.full_name,
        email: newUser.email,
        password: newUser.password,
        id: newUser._id,
        isActivated: newUser.isActivated
    })
      console
      res.status(201).json({
        message: "OK",
        access_token: accessToken,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  };

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
                    // confirmation
                    const confirmationToken = generateConfirmationToken();
                    sendActivationEmail(user.email, confirmationToken);
                    ////Hash Password
                    const hash = bcrypt.hashSync(user.password, 10)

                    const createUser = new UsersModel({
                        full_name: user.full_name,
                        email: user.email,
                        password: hash,
                        role: "member",
                        isActivated: false,
                        confirmationToken: confirmationToken
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
    res.clearCookie('access_token');
    res.status(200).json({
        message: 'Đăng xuất thành công'
      });
}
const sendToken = async (req, res) => {
  try {
    const email = req.body.email
    const dataUser = await UsersModel.findOne({
      email: email,
    })
    if(dataUser) {
      // confirmation
      const confirmationToken = generateConfirmationToken();
      sendActivationEmail(dataUser.email, confirmationToken);

      const user = await UsersModel.findOneAndUpdate(
        { _id: dataUser._id },
        {
          confirmationToken: confirmationToken,
        },
        {
          new: true,
        }
      );
  
      if (!user) {
        return res
          .status(404)
          .json({ message: 'Can not find user' });
      }
      return res.status(201).json({
        message: `Vui lòng kiểm tra ${dataUser.email} để nhận mã xác minh`
      })
    }
  else {
    return res.status(404).json({
      message: "Email chưa được đăng kí"
    })
  }
  }
  catch(error) {
    return res.status(500).json({
      message: e.message
    })
  }
}
const forgotPassword = async (req, res) => {
  try {
    const email = req.body.email
    const token = req.body.token
    const newPassword = req.body.newPassword
    const dataUser = await UsersModel.findOne({
      email: email,
    })
    if(!email) {
      return res.status(404).json({
        message: "Vui lòng nhập Email"
      })
    }
    
    if(dataUser) {
      if(token !== dataUser.confirmationToken) {
        return res.status(404).json({
          message: "Mã xác minh không đúng"
        })
      }
      if(newPassword.length < 6) {
        return res.status(404).json({
          message: "Mật khẩu phải từ 6 kí tự trở lên"
        })
      }
      const hash = bcrypt.hashSync(newPassword, 10)

      const user = await UsersModel.findOneAndUpdate(
        { _id: dataUser._id },
        {
          password: hash,
        },
        {
          new: true,
        }
      );
      return res.status(200).json({
        message: "Đổi mật khẩu thành công"
      })
    }
  else {
    return res.status(404).json({
      message: "Email chưa được đăng kí"
    })
  }
  }
  catch(error) {
    return res.status(404).json({
      message: error.message
    })
  }

}

module.exports = {
    loginAdmin: loginAdmin,
    getLogout: getLogout,
    loginLocal: loginLocal,
    registerLocal: registerLocal,
    logoutLocal: logoutLocal,
    changePassword: changePassword,
    activateAccount: activateAccount,
    forgotPassword: forgotPassword,
    sendToken: sendToken
}