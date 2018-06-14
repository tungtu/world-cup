var monk = require('monk');
var db = monk(MONGO_URI);
var team = db.get('teams');

module.exports = {
	getAll: function (cb) {
		team.find({}, {}, cb);
	},

	getById: function (_id, cb) {
		team.findOne({_id: _id}, {}, cb);
	},

	getByName: function (name, cb) {
		team.findOne({name: name}, {}, cb);
	},

};







