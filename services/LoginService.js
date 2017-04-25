'use strict';

var bcrypt = require('bcrypt');
var userTable = require('../constants/db.json').USER_TABLE;
var SALT_ROUNDS = 10;
var currentUser;

class LoginService {
	/**
	 * Login a user to the system. 
	 *
	 * @param  {Object} db - Database connection object
	 * @param  {Object} req - Request object
	 * @param  {function} callback - Callback function
	 * @return {boolean} Returns true if the password matches the hash. False otherwise.
	 */
	login(db, req, callback) {
		db.collection(userTable).find({username: req.body.username}).toArray(function(err, result) {
			if (result) {
				console.log(result[0]);
				console.log(req.body.password);
				currentUser = req.body.username;
				callback(err, bcrypt.compareSync(req.body.password, result[0].password));
			}
		});
	}

	/**
	 * Registers a user in the system.
	 * 
	 * @param  {Object} db - Database connection object
	 * @param  {Object} req - Request object
	 */
	register(db, req, callback) {
		db.collection(userTable).save(req.body, function(err, result) {
			if (err) {
				callback('User could not be registered');
			}

			callback(null, 'User was registered');
		});
	}

	/**
	 * Gets the current user
	 * 
	 * @return {String} Current logged in username
	 */
	getCurrentUser() {
		return currentUser;
	}

}


module.exports = new LoginService();