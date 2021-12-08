// const db = require("../models");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const passport = require("passport");
// const nodemailer = require('nodemailer');
// const jwtSecret = require("../../config/jwt.config");
// const Users = db.users;
// const Op = db.Sequelize.Op;

// exports.registerUser = (req, res, next) => {
//     passport.authenticate('register', (err, user, info) => {
//         if(err){
//             console.log(err);
//         }
//         if(info !== undefined){
//             console.error(info.message);
//             res.status(403).send(info.message);
//         }else{
//             req.logIn(user, err => {
//                 const data = {
//                     first_name: req.body.first_name,
//                     last_name: req.body.last_name,
//                     email: req.body.email,
//                     username: user.username,
//                 };
//                 Users.findOne({
//                     where:{ username:data.username }
//                 }).then(user => {
//                     user.update({
//                         first_name: data.first_name,
//                         last_name: data.last_name,
//                         email: data.email,
//                     }).then(() => {
//                         console.log('user created in db');
//                         res.status(200).send({ message: 'user created' });
//                     });
//                 });
//             });
//         }
//     })(req, res, next);
// };

// exports.findAllUsers = (req, res) => {
//     Users.findAll()
//     .then((data) => {
//         res.send(data);
//     })
//     .catch((err) => {
//         res.status(500).send({
//             message: err.message || "Some error occured while retrieving Notes",
//         });
//     });
// };

// exports.loginUser = (req, res, next) => {
//     passport.authenticate('login', (err, user, info) => {
//         if(err){
//             console.log(err);
//         }
//         if(info !== undefined){
//             console.error(info.message);
//             res.send(info.message);
//         }else{
//             req.logIn(user, err => {
//                 Users.findOne({
//                     where:{ username: user.username }
//                 }).then(user => {
//                     const token = jwt.sign({ id: user.username}, jwtSecret.secret);
//                     res.status(200).send({
//                         auth: true,
//                         token,
//                         message : 'user found & logged in'
//                     });
//                 });
//             });
//         }
//     })(req, res, next);
// };

// exports.findUser = (req, res, next) => {
//     passport.authenticate('jwt', { session: false }, (err, user, info) => {
//         if (err) {
//             console.log(err);
//         }
//         if (info !== undefined) {
//             res.status(401).send(info.message);
//         } else if (user.username === req.query.username) {
//             Users.findOne({
//                 where:{ username: user.username }
//             }).then(userInfo => {
//                 if(userInfo!==null){
//                     console.log('user found in db from findUsers');
//                     res.status(200).send({
//                         auth: true,
//                         first_name: userInfo.first_name,
//                         last_name: userInfo.last_name,
//                         email: userInfo.email,
//                         username: userInfo.username,
//                         password: userInfo.password,
//                         message: 'user found in db',
//                     });
//                 }else{
//                     console.error('no user exists in db with that username');
//                     res.status(401).send('no user exists in db with that username');
//                 }
//             });
//         } else {
//             console.error('jwt id and username do not match');
//             res.status(403).send('username and jwt token do not match');
//         }
//     })(req, res, next);
// };

// exports.deleteUser = (req, res, next) => {
//     passport.authenticate('jwt', { session:false }, (err, user, info) => {
//         if(err){
//             console.log(err);
//         }
//         if(info !== undefined){
//             console.log(info.message);
//             res.status(403).send(info.message);
//         }else{
//             Users.destroy({
//                 where:{ username: req.query.username }
//             }).then((userInfo) => {
//                 if (userInfo === 1) {
//                     console.log('user deleted from db');
//                     res.status(200).send('user deleted from db');
//                 } else {
//                     console.error('user not found in db');
//                     res.status(404).send('no user with that username to delete');
//                 }
//             }).catch((error) => {
//                 console.error('problem communicating with db');
//                 res.status(500).send(error);
//             });
//         }
//     })(req, res, next);
// };

// exports.updateUser = (req, res, next) => {
//     passport.authenticate('jwt', {session : false }, (err, user, info) => {
//         if(err){
//             console.log(err);
//         }
//         if(info !== undefined){
//             console.error(info.message);
//             res.status(403).send(info.message);
//         }else{
//             Users.findOne({
//                 where:{ username: req.body.username}
//             }).then((userInfo) => {
//                 if(userInfo !== null){
//                     console.log('user found in db');
//                     userInfo.update({
//                         first_name: req.body.first_name,
//                         last_name: req.body.last_name,
//                         email: req.body.email,
//                     }).then(() => {
//                         console.log('user updated');
//                         res.status(200).send({ auth: true, message: 'user updated' });
//                     })
//                 }else{
//                     console.error('no user exists in db to update');
//                     res.status(401).send('no user exists in db to update');
//                 }
//             });
//         }
//     })(req, res, next);
// };

// exports.forgotPassword = (req, res, next) => {
//     if(req.body.email === ''){
//         res.status(400).send('email required');
//     }
//     console.error(req.body.email);
//     Users.findOne({
//         where:{email: req.body.email}
//     }).then((user)=>{
//         if(user === null){
//             console.error('email not in database');
//             res.status(403).send('email not in db');
//         }else{
//             const token = crypto.randomBytes(20).toString('hex');
//             user.update({
//                 resetPasswordToken: token,
//                 resetPasswordExpires: Date.now() + 3600000,
//             });

//             const transporter = nodemailer.createTransport({
//             service: 'gmail',
//                 auth: {
//                     user: `${process.env.EMAIL_ADDRESS}`,
//                     pass: `${process.env.EMAIL_PASSWORD}`,
//                 },
//             });

//             const mailOptions = {
//                 from: 'mySqlDemoEmail@gmail.com',
//                 to: `${user.email}`,
//                 subject: 'Link To Reset Password',
//                 text:
//                   'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n'
//                   + 'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n'
//                   + `http://localhost:3031/reset/${token}\n\n`
//                   + 'If you did not request this, please ignore this email and your password will remain unchanged.\n',
//             };
      
//             console.log('sending mail');
            
//             transporter.sendMail(mailOptions, (err, response) => {
//                 if (err) {
//                     console.error('there was an error: ', err);
//                 } else {
//                     console.log('here is the res: ', response);
//                     res.status(200).json('recovery email sent');
//                 }
//             });
//         }
//     });
// };

// exports.resetPassword = (req, res, next) => {
//     Users.findOne({
//         where:{
//             resetPasswordToken: req.query.resetPasswordToken,
//             resetPasswordExpires: {
//                 [Op.gt]:Date.now()
//             }
//         }
//     }).then((user) => {
//         if(user === null){
//             console.error('password reset link is invalid or has expired');
//             res.status(403).send('password reset link is invalid or has expired');
//         }else{
//             res.status(200).send({
//                 username: user.username,
//                 message: 'password reset link a-ok',
//             });
//         }
//     });
// };

// const BCRYPT_SALT_ROUNDS = 12;
// exports.updatePassword = (req, res, next) => {
//     passport.authenticate('jwt', { session:false }, (err, user, info) => {
//         if(err){
//             console.error(err);
//         }
//         if(info !== undefined){
//             console.log(info.message);
//             res.status(403).send(info.message);
//         }else{
//             Users.findOne({
//                 where:{username : req.body.username}
//             }).then((userInfo) => {
//                 if(userInfo !== null){
//                     console.log('user found in db');
//                     bcrypt.hash(req.body.password, BCRYPT_SALT_ROUNDS)
//                     .then((hashedPassword) => {
//                         userInfo.update({password: hashedPassword});
//                     }).then(() => {
//                         console.log('Password updated');
//                         res.status(200).send({ auth:true, message: 'password updated' });
//                     });
//                 }else{
//                     console.error('no user exists in db to update');
//                     res.status(404).json('no user exists in db to update');
//                 }
//             });
//         }
//     })(req, res, next);
// };

// exports.updatePasswordViaEmail = (req, res, next) => {
//     Users.findOne({
//         where: {
//             username: req.body.username,
//             resetPasswordToken: req.body.resetPasswordToken,
//             resetPasswordExpires: {
//               [Op.gt]: Date.now(),
//             },
//         },
//     }).then((user)=>{
//         if (user == null) {
//             console.error('password reset link is invalid or has expired');
//             res.status(403).send('password reset link is invalid or has expired');
//         }else if(user !== null){
//             console.log('user exists in db');
//             bcrypt
//             .hash(req.body.password, BCRYPT_SALT_ROUNDS)
//             .then(hashedPassword => {
//                 user.update({
//                     password: hashedPassword,
//                     resetPasswordToken: null,
//                     resetPasswordExpires: null,
//                 });
//             })
//             .then(() => {
//                 console.log('password updated');
//                 res.status(200).send({ message: 'password updated' });
//             });
//         } else {
//             console.error('no user exists in db to update');
//             res.status(401).json('no user exists in db to update');
//         }
//     });
// };