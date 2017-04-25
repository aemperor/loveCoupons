var express = require('express');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var MongoClient = require('mongodb').MongoClient;

var devMongUrl = 'mongodb://localhost:27017/lovecoupons';
var loginService = require('./services/LoginService.js');
var couponService = require('./services/CouponService.js');

var SALT_ROUNDS = 10;

var db;
var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

// connect to the database
MongoClient.connect(devMongUrl, function(err, database) {
	if (err) {
		console.log('Ah sheeeeet');
	}

	console.log('Connected successfully to database');
	db = database;
});

// GET calls

// login page (default)
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/login.html');
});

// registration page
app.get('/register', function(req, res) {
	res.sendFile(__dirname + '/register.html');
});

// home page
app.get('/home', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

// show user's coupons
app.get('/showCoupons', function(req, res) {
	couponService.showCoupons(db, req, function(err, result) {
		res.render('index.ejs', {coupons: result});
	});
});

// POST calls

// login
app.post('/login', function(req, res) {
	console.log('req', req.body);
	loginService.login(db, req, function(err, compare) {
		compare ? res.redirect('/home') : res.redirect('/');
	}); 
});

// register
app.post('/register', function(req, res) {
	var hashedPassword = bcrypt.hashSync(req.body.password, SALT_ROUNDS);
	req.body.password = hashedPassword;
	loginService.register(db, req, function(err, result) {
		console.log('RESULT ' ,result);
		if (err) {
			throw err;
		}

		console.log('User saved to database');
		res.redirect('/');
	});
});

// add new coupon
app.post('/addCoupon', function(req, res) {
	couponService.addCoupon(db, req, function(err) {
		if (err) {
			throw err;
		}

		console.log('Coupon saved to the database');
		res.redirect('/home');
	});
});






app.listen(3000, function() {
	console.log('listening on 3000');
});