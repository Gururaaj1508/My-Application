import path from "path";
import cors from "cors";
import logger from "morgan";
import dotenv from "dotenv";
import express from "express";
import passport from "passport";
import bodyParser from "body-parser";
import createError from "http-errors";
import session from "express-session";
import cookieParser from "cookie-parser";
import { auth } from "express-openid-connect";

import indexRouter from "./routes/index";
import usersRouter from "./routes/warpusers";

const app = express();
const corsOptions = { origin: "http://localhost:3000" };

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
require('./public/config/passport');
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('WARP'));
app.use(express.static(path.join(__dirname, 'public')));

// const db = require("./public/javascripts/models");
// db.sequelize.sync();

app.use('/', indexRouter);
app.use('/user', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
