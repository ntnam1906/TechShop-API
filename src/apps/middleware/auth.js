const jwt = require('jsonwebtoken');
const UserModel = require('../models/users');
const dotenv = require('dotenv');
dotenv.config()

const auth = async (req, res, next) => {
    try {
        let authorization = req?.headers?.token?.split(' ')?.[1],
            decoded;
        try {
            decoded = jwt.verify(authorization, process.env.ACCESS_TOKEN);
        } catch (e) {
            return res.status(401).json({
                success: false,
                message: 'unauthorized',
            });
        }
        const userId = decoded.id;
        let user;
        try {
            user = await UserModel.findById(userId);
            if (user == null) {
                return res.status(401).json({
                    message: 'UNAUTHORIZED',
                });
            }
        } catch (error) {
            return res
                .status(500)
                .json({ message: error.message });
        }

        req.userId = userId;
        next();
    } catch (err) {
        return res
            .status(500)
            .json({ message: err.message });
    }
};

module.exports = auth;
