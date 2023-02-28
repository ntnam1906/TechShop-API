const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const db = () => {
    mongoose.connect('mongodb://0.0.0.0:27017/tech_shop', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    });
    return mongoose; 
};
module.exports = db;