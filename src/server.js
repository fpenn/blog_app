var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var pg = require('pg');
var Sequelize = require('sequelize');
var session = require('express-session');


var app = express();

app.use(bodyParser.urlencoded({	extended: true}));
app.use(session({
	secret: 'dunno what this does',
	resave: true,
	saveUninitialized: false
}));


app.set('views', __dirname + '/views');
app.set('view engine', 'jade');



//Connecting with database

var sequelize = new Sequelize('blog_app', 'postgres', null, {
	host: 'localhost',
	dialect: 'postgres',
	define: {
    underscored: true,
    timestamps: false
  }
});


//var connectionString = "postgres://postgres:0000@localhost/blog_app";
var connectionString = 'postgres://' + process.env.POSTGRES_USER + ':' + process.env.POSTGRES_PASSWORD + '@localhost/blog_app';

// Model for creating Users

var User = sequelize.define('users', {
	
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},

	username: {
		
		type: Sequelize.STRING
		
	},

	password: {

		type: Sequelize.STRING
	},

	email: {
		type: Sequelize.STRING
	}

	
});

// Model for Blog posts

var Post = sequelize.define('blogs', {
	
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},

	title: {
		
		type: Sequelize.TEXT
	},

	body: {

		type: Sequelize.TEXT
	}

	
});



// Routes

app.get('/', function(request, response) {

	response.render('landing');

});

var username = '';
var password = '';


app.get('/home', function(request, response) {

	var user = request.session.user;
	// var username = user.username;
	// var password = user.password

	// console.log(username);
	// console.log(password);

	if (user === undefined) {
		response.redirect('/?message=' + encodeURIComponent("Please log in to view your profile."));

	} else {

		response.render('home', {
			username: user.username,
			password: user.password
		});

	}

});


app.post('/login', bodyParser.urlencoded({extended: true}), function(request, response) {

	//console.log(request.body.username);

	User.findOne({
		 where: {username: request.body.username}
	}).then(function (user) {
		
		
		if(request.body.password === user.password){

			request.session.user = user;
			response.redirect('/home');

		} else {

			response.redirect('/?message=' + encodeURIComponent("Invalid email or password."));
		}
			
	});
	
});


app.post('/register', function(request, response) {

	var usernameRegist = request.body.usernameR
	var passwordRegist = request.body.passwordR
	var emailRegist = request.body.emailR

	console.log(usernameRegist);
	console.log(passwordRegist);

	sequelize.sync().then(function() {

		User.create({

			username: usernameRegist,
			password: passwordRegist,
			email: emailRegist

		});

	});

});


app.post('/addBlog', function(request, response) {

	//console.log(request);
	var title = request.body.blogTitle
	var body = request.body.body

	sequelize.sync().then(function() {

		Post.create({

			title: title,
			body: body
			

		});

	});
});

app.get('/logout', function (request, response) {
	request.session.destroy(function(error) {
		if(error) {
			throw error;
		}
		response.redirect('/?message=' + encodeURIComponent("Successfully logged out."));
	})
});

var server = app.listen(3000);