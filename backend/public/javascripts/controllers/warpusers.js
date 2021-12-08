import db from "../models";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import nodemailer from "nodemailer";
import jwtSecret from "../../config/jwt.config";

const WARPUsers = db.warp_api_users;
// const Op = db.Sequelize.Op;

export const registerUser = (req, res, next) => {
    passport.authenticate('register', (error, user, info) => {
        if(error){ res.status(403).send(error) }

        if(info !== undefined){
            res.status(403).send(info.message);
        }else{
            req.logIn(user, err => {
                WARPUsers
                .findOne({where:{ user_id:user.user_id }})
                .then((userInfo) => {
                    userInfo
                    .update({
                        user_id:user.user_id,
                        email_id:user.email_id,
                        admin:req.body.admin
                    })
                    .then(() => res.status(200).send({ message: 'user created' }))
                });
            });
        }
    })(req, res, next);
};

export const loginUser = (req, res, next) => {
    passport.authenticate('login', (error, user, info) => {
        if(error){console.log(error)}
        if(info !== undefined){
            res.status(401).send(info.message);
        }else{
            req.logIn(user, err => {
                WARPUsers
                .findOne({where:{ user_id:user.user_id }})
                .then((userInfo) => {
                    const token = jwt.sign({ id: userInfo.user_id}, jwtSecret.secret);
                    res.status(200).send({ auth: true, token, message : 'user found & logged in' });
                });
            });
        }
    })(req, res, next);
};

export const findUser = (req, res, next) => {
    passport.authenticate('jwt', { session:false }, (error, user, info) => {
        if(error){console.log(error)}
        if(info !== undefined){
            res.status(401).send(info.message);
        } else if(user.user_id === req.query.user_id){
            WARPUsers
            .findOne({where:{ user_id:user.user_id }})
            .then((userInfo) => {
                res.status(200).send({
                    auth: true,
                    user_id: userInfo.user_id,
                    email_id: userInfo.email_id,
                    password: userInfo.password,
                    message: 'user found in db',
                });
            });
        } else{
            console.error('jwt id and username do not match');
            res.status(403).send('username and jwt token do not match');
        }
    })(req, res, next);
};

export const deleteUser = (req, res, next) => {
    passport.authenticate('jwt', { session:false }, (error, user, info) => {
        if(error){console.log(error)}
        if(info !== undefined){
            res.status(401).send(info.message);
        } else if(user.user_id === req.query.user_id){
            WARPUsers
            .destroy({where:{ user_id:user.user_id }})
            .then((userInfo) => {
                if (userInfo === 1) {
                    res.status(200).send('user deleted from db');
                } else {
                    res.status(404).send('no user with that username to delete');
                }
            }).catch((error) => { res.status(500).send(error) });
        } else{
            res.status(403).send('username and jwt token do not match');
        }
    })(req, res, next);
};

export const updateUser = (req, res, next) => {
    passport.authenticate('jwt', { session:false }, (error, user, info) => {
        if(error){console.log(error)}
        if(info !== undefined){
            res.status(401).send(info.message);
        } else {
            WARPUsers.update({
                email_id:req.body.email_id,
                admin:req.body.admin
            },{ where: {user_id: user.user_id }})
            .then(() => res.status(200).send({ auth: true, message: 'user updated' }))
            .catch((error) => { res.status(500).send(error) });
        }
    })(req, res, next);
};