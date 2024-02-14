const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const keys = require('../config/keys');
const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

const options = {
  clientID: keys.googleClientID,
  clientSecret: keys.googleClientSecret,
  callbackURL: '/auth/google/callback',
  proxy: true
};

passport.use(new GoogleStrategy(options, async (accessToken, refreshToken, profile, done) => {
  const email = profile.emails[0].value;

  // TODO: do this with the /api/user/new route?

  const existingUser = await User.findOne({ email });
  
  if (existingUser) {
    if (!existingUser.name) {
      return User.findByIdAndUpdate(existingUser._id, { name: profile.displayName }, function(err, doc) {
        done(err, doc);
      });
    }
    return done(null, existingUser);
  }

  const user = new User({ name: profile.displayName, email });
  user.save(function(err, doc) {
    done(err, doc);
  });
}));
