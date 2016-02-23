var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var pg = require('pg');
var Sequelize = require('sequelize');
var session = require('express-session');


var app = express();

app.use(bodyParser.urlencoded({
	extended: true
}));

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

	content: {

		type: Sequelize.TEXT
	}

});

//Model for comments

var Comment = sequelize.define('comments', {

	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},

	comment: {

		type: Sequelize.TEXT
	},

	author: {

		type: Sequelize.TEXT
	}

});

//Relation between models

User.hasMany(Post, {
	foreignKey: 'userId'
});
Post.belongsTo(User, {
	foreignKey: 'userId'
});

Post.hasMany(Comment);
Comment.belongsTo(Post);

//sequelize.sync();

// Routes

app.get('/', function(request, response) {

	var message = request.query.message;
	//console.log(message);
	if(message === undefined){

		message === false;
		response.render('landing', {message:message});

	} else {

		response.render('landing', {message: message});
	}

	
});



app.get('/home', function(request, response) {

	var user = request.session.user;

	if (user === undefined) {
		response.redirect('/?message=' + encodeURIComponent("Please log in to view your profile."));

	} else {

		response.render('home', {
			username: user.username,
			password: user.password
		});

	}

});


app.post('/login', bodyParser.urlencoded({
	extended: true
}), function(request, response) {


	User.findOne({
		where: {
			username: request.body.username,
			password: request.body.password
		}
	}).then(function(user) {

		if(user === null){

			response.redirect('/?message=' + encodeURIComponent("Invalid email or password."))

		} else {

			request.session.user = user;
			response.redirect('/home');
		}


	});

});


app.post('/register', function(request, response) {

	var usernameRegist = request.body.usernameR
	var passwordRegist = request.body.passwordR
	var emailRegist = request.body.emailR
	
	User.findAll({

		where: {

			username: usernameRegist
		}
	}).then(function(user){

		console.log(user)
	})


	User.create({

		username: usernameRegist,
		password: passwordRegist,
		email: emailRegist

	});

});



app.post('/addBlog', function(request, response) {

	var user = request.session.user;
	var title = request.body.blogTitle
	var body = request.body.bodyBlog


	Post.create({
		title: title,
		content: body,
		userId: user.id

	}).then(function(newpost) {
		console.log(newpost);
		response.redirect('/blog/' + newpost.dataValues.id);
	}, function(error) {
		response.send("Your blog has not been succesfully posted.");
	});

});



app.get('/logout', function(request, response) {

	request.session.destroy(function(error) {
		if (error) {
			throw error;
		}
		response.redirect('/?message=' + encodeURIComponent("Successfully logged out."));
	})
});



app.get('/profile', function(request, response) {

	var user = request.session.user;

	//console.log(id);

	if (user === undefined) {

		response.redirect('/?message=' + encodeURIComponent("Please log in to view your profile."));

	} else {

		var id = user.id

		Post.findAll({

			where: {

				userId: id
			}

		}).then(function(posts) {

			var data = posts.map(function(post) {
				return {
					title: post.dataValues.title,
					content: post.dataValues.content,
					id: post.dataValues.id
				};



			});
			
			response.render('profile', {
				username: user.username,
				data: data
			});

		});
	}

});

app.get('/allposts', function(request, response) {

	var user = request.session.user;


	if (user === undefined) {

		response.redirect('/?message=' + encodeURIComponent("Please log in to view your profile."));

	} else {

		var id = user.id

		Post.findAll().then(function(posts) {


			var data = posts.map(function(post) {
				return {
					title: post.dataValues.title,
					content: post.dataValues.content,
					id: post.dataValues.id,
					userId: post.dataValues.userId
				};
			});



			response.render('allposts', {
				username: user.username,
				data: data
			});

		}, function(error){

			response.send("Couldn't find the posts. Abort mission. Affirmative")

		})

	}

});

var blogid = '';


app.get('/blog/:blogId', function(request, response) {

	var user = request.session.user;
	blogid = request.params.blogId;

	var blogtitle = undefined;
	var blogtext = undefined;
	var userid = undefined;
	var dataComment = undefined;
	var author = undefined;

	if (user === undefined) {

		response.redirect('/?message=' + encodeURIComponent("Please log in to view your profile."));

	} else {

		Post.findOne({

			where: {
				id: blogid

			}

		}).then(function(posts) {

			blogtitle = posts.dataValues.title;
			blogtext = posts.dataValues.content;
			userid = posts.dataValues.userId;

		}, function(error){

			response.send("Error error")
		});



		Comment.findAll({

			where: {

				blog_id: blogid
			}
		}).then(function(comments) {

			var dataComment = comments.map(function(comments) {

				return {

					comment: comments.dataValues.comment,
					author: comments.dataValues.author,
					id: comments.dataValues.id

				};


			}, function(error){

				response.send("Failed to sync comment with database.")
			});



			response.render('blogpage', {
				username: user.username,
				blogtitle: blogtitle,
				blogtext: blogtext,
				userid: userid,
				comment: dataComment,


			});

		})


	};

});


app.post('/addComment', function(request, response) {

	var user = request.session.user;
	
	Comment.create({

		comment: request.body.comment,
		author: user.id,
		blog_id: blogid

	}).then(function(comment){

		response.redirect('/blog/' + blogid + '#comment' + comment.dataValues.id);

	}, function(error){

		response.send("Failed to post comment.")
	});

	


});

sequelize.sync().then(function() {

	var server = app.listen(3000);
})