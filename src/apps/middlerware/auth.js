const checkLogin = (req, res, next) => {
    if(req.session.mail && req.session.pass){
       return res.redirect('/admin/dashboard')
    }
    next();
}

const checkAdmin = (req, res, next) => {
    if(!req.session.mail || !req.session.pass) {
       return res.redirect('/admin/login')
    }
    next();
}

module.exports = {
    checkLogin: checkLogin,
    checkAdmin: checkAdmin,
}