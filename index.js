var express = require('express');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var devMongUrl = 'mongodb://localhost:27017/lovecoupons';

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