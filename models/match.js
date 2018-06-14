var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk(MONGO_URI);
var match = db.get('matches');

module.exports = {
	create: function (match, cb) {
		match.insert(match, cb);
	},

	getAll: function (cb) {
		match.find({}, {}, cb);
	},

	getStatus: function (cb) {
		match.find({'status': '1'}, {}, cb);
	},

	getById: function (_id, cb) {
		match.findOne({_id: _id}, {}, cb);
	},

	getByDate: function (date, cb) {
		match.findOne({'date': {$gt: date}, 'status':'0'}, {}, cb);
	},

	update: function (match_id, match_data, cb) {
		match.update({_id: match_id},
			{
				$set: match_data
			},
			cb);
	},

	remove: function (match_id, cb) {
		match.remove({_id: match_id}, cb);
	}

};







