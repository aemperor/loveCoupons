var express = require('express');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var bcrypt = require('bcrypt');

var devMongUrl = 'mongodb://localhost:27017/lovecoupons';
var SALT_ROUNDS = 10;

var db;
var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');


MongoClient.connect(devMongUrl, function(err, database) {
	if (err) {
		console.log('Ah sheeeeet');
	}

	console.log('Connected successfully to server');
	db = database;
});


app.get('/', function(req, res) {
	res.sendFile(__dirname + '/login.html');
});

app.post('/login', function(req, res) {
	db.collection('users').find({username: req.body.username}).toArray(function(err, result) {
		var compare;
		if (result) {
			compare = bcrypt.compareSync(req.body.password, result[0].password);
		}

		compare ? res.redirect('/home') : res.redirect('/');
	});
});

app.get('/register', function(req, res) {
	res.sendFile(__dirname + '/register.html');
});

app.post('/register', function(req, res) {
	var hashedPassword = bcrypt.hashSync(req.body.password, SALT_ROUNDS);
	req.body.password = hashedPassword;
	db.collection('users').save(req.body, function(err, result) {
		if (err) {
			console.log(err);
		}

		console.log('saved user to database');
		res.redirect('/');
	});
});

app.get('/home', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

app.post('/addCoupon', function(req, res) {
	db.collection('coupons').save(req.body, function(err, result) {
		if (err) {
			return console.log(err);
		}

		console.log('saved to database');
		res.redirect('/');
	});
});

app.get('/showCoupons', function(req, res) {
	db.collection('coupons').find().toArray(function(err, result) {
		console.log("RESULT " , result);

		res.render('index.ejs', {coupons: result});
	});
})

app.listen(3000, function() {
	console.log('listening on 3000');
});