const { ExtractJwt, Strategy } = require('passport-jwt');
const  User = require('../models/User');
const CONFIG = require('../config/config');
const {to} = require('../services/util.service.js');

module.exports = function(passport){
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = CONFIG.jwt_encryption;
    passport.use(new Strategy(opts, async function(jwt_payload, done){
        let err, user;
        [err, user] = await to(User.findById(jwt_payload.user_id));
        if(err) return done(err, false);
        if(user) {
            return done(null, user._id);
        }else{
            return done(null, false);
        }
    }));
    
    
    return passport
}