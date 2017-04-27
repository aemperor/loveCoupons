'use strict';

var couponTable = require('../constants/db.json').COUPON_TABLE;
var loginService = require('./LoginService.js');

class CouponService {
	/**
	 * Add a coupon for the current user
	 * 
	 * @param {Object} db - Database object
	 * @param {Object} req - Request object
	 * @param {Function} callback - callback function
	 */
	addCoupon(db, req, callback) {
		var coupon = req.body;
		coupon.username = loginService.getCurrentUser();
		if (coupon.username) {
			db.collection(couponTable).save(coupon, function(err, result) {
				if (err) {
					callback('Cannot add coupon');
				}

				callback(null, 'Coupon added');
			});
		}
		else {
			callback('User not authenticated');
		}
	}

	/**
	 * Shows the coupons related to the current user
	 * 
	 * @param  {Object} db - Database object
	 * @param  {req} req - Request object
	 * @param  {Function} callback - callback function
	 * @return {Array} Coupon results for the current user
	 */
	showCoupons(db, req, callback) {
		db.collection(couponTable)
			.find({username: loginService.getCurrentUser()})
			.toArray(function(err, result) {
				if (err) {
					callback('No coupons for current user');
				}

				if (result) {
					callback(null, result);
				}
		});
	}
}

module.exports = new CouponService();