var db = require('monk')(MONGO_URI);

var users = db.get('users');

module.exports = {

	getByGoogleID: function (google_id, cb) {
		users.findOne({google_id: google_id}, cb);
	},
	getByID: function (_id, cb) {
		users.findOne({_id: _id}, cb);
	},
	getAll: function (cb) {
		users.find({}, {sort: {"score": -1}}, cb);
	},
	create: function (user_data, cb) {
		users.insert(user_data, cb);
	},
	update: function (user_id, user_data, cb) {
		users.update({_id: user_id}, {$push: {'matches': user_data}}, cb);
	},
	updateScore: function (user_id, user_data, match_name, cb) {
		users.update({_id: user_id}, {$set: user_data, $push: {'status' : match_name}}, cb);
	},

};