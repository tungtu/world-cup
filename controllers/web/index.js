var express = require('express')
	, passport = require('passport')
	, User = require('../../models/user')
	, Match = require('../../models/match')
	, router = express.Router();

var default_route = '/home';

var fs = require('fs');

// var obj = JSON.parse(fs.readFileSync('json_data.json', 'utf8'));

var request = require('request');
var url = 'https://raw.githubusercontent.com/lsv/fifa-worldcup-2018/master/data.json';

router.get('/', function (req, res) {
	if (req.user) {
		var usertype = req.user.usertype;
		if (usertype == 'user')
			return res.redirect('/home')
	}
	else
		res.redirect('/login')
});

router.get('/logout', function (req, res) {
	req.logout();
	res.redirect('/');
});

router.get('/login', function (req, res) {
	if (req.user && req.user.usertype == 'user')
		res.redirect("/home");
	else {
		res.render('web/login', {
			message: req.flash('error')
		});
	}
});

router.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

router.get('/auth/google/callback',
	passport.authenticate('google', {
		successRedirect : '/home',
		failureRedirect : '/login',
		failureFlash : true
	}));

router.get('/home', isLoggedInAdmin, function (req, res) {
	request.get(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var obj = JSON.parse(body);
			User.getAll(function (err, users) {
				if (err)
					res.send("Some error occured");
				else {
					if (users) {

						User.getByID(req.user._id.toString(), function (err, user) {
							if (err)
								res.send("Some error occured");
							else {
								// var date_current = new Date();
								var date_current = new Date();
								var date_next = new Date(date_current.getTime() + 86400000);
								var data = obj.groups;
								var matches = [];

								for (var k in data) {
									for (var j in data[k].matches) {
										if (data[k].matches[j].finished == false && new Date(data[k].matches[j].date).toDateString() == date_current.toDateString()) {
											matches.push(data[k].matches[j]);
										}
										if (data[k].matches[j].finished == false && new Date(data[k].matches[j].date).toDateString() == date_next.toDateString()) {
											matches.push(data[k].matches[j]);
										}
									}
								}

								var matches_name = [];

								for (var i in user.matches) {
									matches_name.push(user.matches[i].match_name);
								}

								res.render('web/home', {
									curent_user: user,
									users: users,
									teams: obj.teams,
									groups: obj.groups,
									matches: matches,
									matches_name: matches_name,
									alert: req.flash('alert')
								});
							}
						})
					}
				}
			});
		}
	});
});

router.get('/history', isLoggedInAdmin, function (req, res) {
	request.get(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var obj = JSON.parse(body);
			User.getAll(function (err, users) {
				if (err)
					res.send("Some error occured");
				else {
					if (users) {

						User.getByID(req.user._id.toString(), function (err, user) {
							if (err)
								res.send("Some error occured");
							else {
								res.render('web/history', {
									curent_user: user,
									users: users,
									teams: obj.teams,
									groups: obj.groups,
								});
							}
						})
					}
				}
			});
		}
	});
});

module.exports = router;

function isLoggedInAdmin(req, res, next) {
	if (req.isAuthenticated() && req.user.usertype == 'user') {
		return next();
	}
	res.redirect('/');
}