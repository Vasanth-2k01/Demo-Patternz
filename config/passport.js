const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const { ExtractJwt } = require('passport-jwt')
const JWTStrategy = require('passport-jwt').Strategy
var knex = require("../knex");
const common = require('../common/common')
const dotenv = require('dotenv').config()

passport.use('jwt', new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: process.env.JWT_SECRET,
    passReqToCallback: true
}, async (req, payload, done) => {
    console.log("JWTStrategypayload", payload)
    try {
        req.body.userid = common.decrypt(payload.sub); console.log("payload.sub", payload.sub);
        console.log("req.body.userid", req.body.userid);
        return done(null, payload.sub);
    } catch (error) {
        console.log('error');
        return done({
            success: 0,
            message: error.message,
            data: {}
        }, false);
    }
}));

passport.use('jwtUser', new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
}, async (req, email, password, done) => {
    try {
        console.log(req, email, password, 'req, email, password');
        let query = knex(process.env.USERS).where('email', email)
            .andWhere('password', common.encryptPWD(password))
            .andWhere("isdeleted", 1)
        console.log(query, 'query');
        let result = await query
        console.log(result, 'result');
        if (result.length) {
            done(null, result)
        } else {
            done("Invalid Credentials", false)
        }
    } catch (e) {
        return done(e, false)
    }
}
))