var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User       = require('../models/user');
var configAuth;
var express = require('express');

var app = express();

if (app.get('env') === 'development') {
	configAuth = require('./auth_dev');
}
else if(app.get('env') === 'production'){
	configAuth = require('./auth');
}

module.exports = function (passport) {

	passport.serializeUser(function (user, done) {
		done(null, JSON.stringify(user));
	});

	passport.deserializeUser(function (user, done) {
		done(null, JSON.parse(user));
	});

	// Google
	passport.use(new GoogleStrategy({
			clientID        : configAuth.googleAuth.clientID,
			clientSecret    : configAuth.googleAuth.clientSecret,
			callbackURL     : configAuth.googleAuth.callbackURL,
		},
		function (token, refreshToken, profile, done) {
			process.nextTick(function () {

				User.getByGoogleID(profile.id.toString() , function (err, user) {
					if (err)
						return done(err, req.flash('loginMessage', 'Some error occured.'));
					if (user) {
						user.usertype = 'user';
						return done(null, user);
					} else {
						var newUser = {
							google_id    : profile.id,
							token : token,
							name  : profile.displayName,
							score : 0,
							role : 'User',
							matches: [],
							email : profile.emails[0].value
						};

						User.create( newUser, function(err, user) {
							if (err)
								return done(null, false, req.flash('loginMessage', 'Some error occured.'));
							else{
								user.usertype = 'user';
								return done(null, newUser);
							}
						});
					}

				});
			});

		}));

};
