var express = require('express');
var router = express.Router();

var db = require('monk')(MONGO_URI);

var admin_collection = db.get('admins');

module.exports = {

	getByUserName: function (username, cb) {

		admin_collection.findOne({username: username}, cb);
	},

	getByUserId: function (_id, cb) {

		admin_collection.findOne({_id: _id}, cb);
	},

	update: function (prevusername, admin, cb) {
		admin_collection.update({username: prevusername},
			{
				$set: admin
			},
			cb);
	},

};







