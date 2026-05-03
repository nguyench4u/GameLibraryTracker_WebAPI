// auth.js - Passport JWT authentication setup

var passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var User = require('./User');

var opts = {};
// Checks for the JWT in the header of the request
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt"); 
opts.secretOrKey = process.env.SECRET_KEY; // secret key for encoding/decoding JWT

passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {
    try {
        const user = await User.findById(jwt_payload.id);
        return user ? done(null, user) : done(null, false);
    } catch (err) {
        return done(err, false);
    }
}));

exports.isAuthenticated = passport.authenticate('jwt', { session: false });
exports.secret = opts.secretOrKey;
