const express = require('express');
const app = express();
const ejs = require('ejs');
const config = require('config');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const cors = require('cors')

const mongoose = require('../common/database')();
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', "*");
  next();
});

app.use('/static', express.static(config.get('app.static_folder')))
app.set('views', config.get('app.view_folder'))
app.set('view engine', config.get('app.view_engine'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use('/uploads', express.static('uploads'));

app.use(
  cors({
    preflightContinue: true,
  }),
);


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

const mainRouter = require('../routers/index');
app.use(mainRouter);


module.exports = app;