const express = require('express');
const app = express();
const ejs = require('ejs');
const config = require('config');
const bodyParser = require('body-parser');
const session = require('express-session');
const fileUpload = require('express-fileupload');


app.use('/static', express.static(config.get('app.static_folder')))
app.set('views', config.get('app.view_folder'))
app.set('view engine', config.get('app.view_engine'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())

//session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

global.loggedIn = null
app.use("*", (req, res, next) => {
  loggedIn = req.session.userId
  next()
})

//fileupload
app.use(fileUpload())

//Router
const webRouter = require('../routers/web');
app.use(webRouter);


module.exports = app;