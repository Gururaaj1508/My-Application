import path from 'path';
import cors from 'cors';
import logger from 'morgan';
import dotenv from 'dotenv';
import express from 'express';
import createError from 'http-errors';
// import session from 'express-session';
import cookieParser from 'cookie-parser';
// import { auth } from 'express-openid-connect';

const usersRouter = require('./routes/users');
dotenv.config();
const app = express(cors());

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
// app.use(
//   session({
//     secret: 'WITH_GREAT_POWER_COMES_GREAT_RESPONSIBILITY',
//     cookie: {
//       // Sets the session cookie to expire after 7 days.
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     },
//     resave: false,
//     saveUninitialized: true,
//   }),
// );

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', express.static('frontend'));
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
