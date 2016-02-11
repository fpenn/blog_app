var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var pg = require('pg');
var Sequelize = require('sequelize');

var app = express();

app.use(bodyParser.urlencoded({
	extended: true
}));

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use('/static', express.static('/images'));

// Routes

app.get('/', function(request, response) {

	response.render('landing');

});

var username = '';
var password = '';


app.get('/home', function(request, response) {

	response.render('home', {username: username, password: password});

});


app.post('/home', function(request, response) {

	//console.log(request.body.title);
	//console.log(request.body.message);
	username = request.body.username
	password = request.body.password

	response.redirect('home');

});

var server = app.listen(3000);