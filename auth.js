// auth.js - Passport JWT authentication setup

var passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var User = require('./User');

var opts = {};
// Checks for the JWT in the header of the request
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt"); 
opts.secretOrKey = process.env.SECRET_KEY; // secret key for encoding/decoding JWT

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findById(jwt_payload.id, function(err, user) {
        if (user) {
            done(null, user);
        } else {
            done(null, false);
        }
    });
}));

exports.isAuthenticated = passport.authenticate('jwt', { session: false });
exports.secret = opts.secretOrKey;
