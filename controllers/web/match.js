var express = require('express')
	, router = express.Router()
	, Match = require('../../models/match')
	, Team = require('../../models/team')
	, User = require('../../models/user')
	, slug = require('slug');

var default_route = "/home";
var request = require('request');
var url = 'https://raw.githubusercontent.com/lsv/fifa-worldcup-2018/master/data.json';

var fs = require('fs');

// var obj = JSON.parse(fs.readFileSync('json_data.json', 'utf8'));

router.get('/lock', isLoggedInAsAdmin, function (req, res) {
	var match_id = req.query.match_id;
	var match_data = {
		status: '1'
	};
	Match.getById(match_id, function (err, doc) {
		if (err)
			res.send("Some error occured");
		else if (doc) {
			Match.update(match_id, match_data, function (err, doc) {
				if (err)
					res.send("Some error occured");
				else {
					req.flash('alert', "Locked!, Your data has been locked., success");
					res.redirect(default_route);
				}
			})
		}
		else {
			req.flash('alert', "Error!, Data not found., error");
			res.redirect(default_route);
		}
	})
});

router.get('/choose', isLoggedInAsAdmin, function (req, res) {
	var match_name = req.query.match_name;
	var choose = req.query.c;
	var matches = {
		match_name : match_name,
		choose: choose
	};
	User.update(req.user._id, matches, function (err, doc) {
		if (err)
			res.send("Some error occured");
		else {
			req.flash('alert', "Success!, Your data has been store., success");
			res.redirect('/home');
		}
	})
});

var type_score = require('../../config/score');

router.get('/refresh', function (req, res) {
	User.getAll(function (err, users) {
		if (err)
			res.send("Some error occured");
		else {
			request.get(url, function (error, response, body) {
				if (!error && response.statusCode == 200) {
					var obj = JSON.parse(body);
					var data = obj.groups;
					var score = 1;
					for (var k in data) {
						if (data[k].name.slice(0,5) == "Group")
							score = type_score['Group'];

						for (var j in data[k].matches) {
							if(data[k].matches[j].home_result != null && data[k].matches[j].away_result != null)
								users.forEach(function(user) {
								if (!user.status.includes(data[k].matches[j].name.toString()))
									for (var u in user.matches) {
										if (data[k].matches[j].name == user.matches[u].match_name) {
											if (data[k].matches[j].home_result < data[k].matches[j].away_result && user.matches[u].choose == data[k].matches[j].away_team) {
												User.updateScore(user._id, {score: user.score + score }, user.matches[u].match_name, function (err, doc) {
													if (err)
														res.send("Some error occured");
												})
											}
											else if(data[k].matches[j].home_result > data[k].matches[j].away_result && user.matches[u].choose == data[k].matches[j].home_team){
												User.updateScore(user._id, {score: user.score + score }, user.matches[u].match_name, function (err, doc) {
													if (err)
														res.send("Some error occured");
												})
											}
											else if(data[k].matches[j].home_result == data[k].matches[j].away_result && user.matches[u].choose == 'draw'){
												User.updateScore(user._id, {score: user.score + score }, user.matches[u].match_name, function (err, doc) {
													if (err)
														res.send("Some error occured");
												})
											}

										}
									}
							});
						}
					}

					res.redirect('/home');
				}
			});
		}
	})
});

module.exports = router;

function isLoggedInAsAdmin(req, res, next) {
	if (req.isAuthenticated() && req.user.usertype == 'user') {
		return next();
	}
	res.redirect('/');
}
