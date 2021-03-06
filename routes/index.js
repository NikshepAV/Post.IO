var express 	= require('express');
var router 		= express.Router();
var passport 	= require('passport');
var User 		= require('../models/user');
var middleware 	= require('../middleware')

//root route
router.get('/', function(req, res) {
	res.render('landing');
});


//show the register form
router.get('/register', function(req, res) {
	res.render('register');
});

//handle sign up logic
router.post('/register', function(req, res) {
	//Form validation - limiting username size
	if(req.body.username.length > 14) {
		req.flash('error', 'Enter a username of length between 0-14');
		return res.redirect('/register');
	}
	//Form validation - confirming password
	if(req.body.password === req.body.confirm_password) {
		var newUser = new User({username: req.body.username});
		User.register(newUser, req.body.password, function(err, user) {
			if(err) {
				req.flash('error', err.message);
				return res.redirect('register');
			}
			passport.authenticate('local')(req, res, function() {
				req.flash('success', 'Welcome here, ' + user.username + '.');
				res.redirect('/posts');
			});
		});
	} else {
		req.flash('error', 'Passwords do not match. Try again.');
		return res.redirect('/register');
	}
});

//show the login form
router.get('/login', function(req, res) {
	res.render('login');
});	

//handle the login logic
router.post('/login', passport.authenticate('local', {
	successRedirect: '/posts',
	failureRedirect: '/login'
	}));

//logout route
router.get('/logout', function(req, res) {
	req.logout();
	req.flash('success', 'Successfully logged out.');
	res.redirect('/posts');
});


module.exports = router;