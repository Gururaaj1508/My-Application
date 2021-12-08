import bcrypt from "bcrypt";
import Sequelize from "sequelize";
import db from "../javascripts/models";
import jwtSecret from "../config/jwt.config";
import passport from "passport";

const BCRYPT_SALT_ROUNDS = 12;
const Op = Sequelize.Op;
const LocalStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const Users = db.warp_api_users;

passport.use(
    'register',
    new LocalStrategy(
        {
            usernameField: 'user_id',
            passwordField: 'password',
            passReqToCallback: true,
            session: false,
        },
        (req, user_id, password, done) => {
            try {
                Users.findOne({
                    where: {
                        [Op.or]: [
                        {
                            user_id,
                        },
                            { email_id: req.body.email_id },
                        ],
                    },
                }).then(user => {
                if (user != null) {
                    return done(null, false, {
                        message: 'username or email already existed',
                    });
                }
                bcrypt.hash(password, BCRYPT_SALT_ROUNDS).then(hashedPassword => {
                    Users.create({
                            user_id,
                            password: hashedPassword,
                            email_id: req.body.email_id,
                        }).then(user => {
                            console.log('user created');
                            return done(null, user);
                        });
                    });
                });
            } catch (err) {
                return done(err);
            }
        },
    ),
);

passport.use(
    'login',
    new LocalStrategy(
        {
            usernameField: 'user_id',
            passwordField: 'password',
            session: false,
        },
        (user_id, password, done) => {
        try {
            Users.findOne({
                where: {
                    user_id,
                },
            }).then(user => {
                if (user === null) {
                    return done(null, false, { message: 'bad username' });
                }
                bcrypt.compare(password, user.password).then(response => {
                    if (response !== true) {
                        return done(null, false, { message: 'passwords do not match' });
                    }
                    console.log('user found & authenticated');
                    return done(null, user);
                    });
                });
            } catch (err) {
                done(err);
            }
        },
    ),
);

const opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('JWT'),
    secretOrKey: jwtSecret.secret,
};

passport.use(
  'jwt',
    new JWTstrategy(opts, (jwt_payload, done) => {
        try {
            Users.findOne({
                where: {
                    user_id: jwt_payload.id
                },
            }).then(user => {
                if (user) {
                    console.log('user found in db in passport');
                    done(null, user);
                } else {
                    console.log('user not found in db');
                    done(null, false);
                }
            });
        } catch (err) {
            done(err);
        }
    }),
);