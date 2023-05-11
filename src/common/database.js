const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const db = () => {
    mongoose.connect('mongodb+srv://nguyenthenamuet:112233As@cluster0.9q78hpl.mongodb.net/?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    });
    return mongoose; 
};
module.exports = db;