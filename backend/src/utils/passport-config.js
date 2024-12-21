const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;

const UsersService = require("../Users/Users");
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET || "secret";
const passport = require("passport");

passport.use(
  new JwtStrategy(opts, function (jwt_payload, done) {
    UsersService.getUser(jwt_payload.id).then((user) => {
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  })
);
