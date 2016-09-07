var express = require('express');
var router = express.Router();

var User = require('../models/user');
// Register 
router.get('/register', function(req,res){
	res.render('register');
});


// Register Post 
router.post('/register', function(req,res){
	
	//Validation
	req.checkBody('name', 'Name is Required').notEmpty();
	req.checkBody('email', 'Email is Required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'UserName is Required').notEmpty();
	req.checkBody('password', 'Password is Required').notEmpty();
	req.checkBody('password2', 'Confirm Password is Required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);


	var errors = req.validationErrors();
	if(errors){
		res.render('register',{
			errors: errors
		});
	}else {
		var username = req.body.username;
		var name = req.body.name;
		var email = req.body.email;
		var password = req.body.password;
		var password2 = req.body.password2;
		
		var newUser = new User({
			name: name,
			email: email,
			username: username,
			password: password
		});

		User.createUser(newUser,function(err,user){
			if (err) throw err;
			console.log(user);
		});
		req.flash('success_msg', 'You are registered and can now login');

		res.redirect('/users/login');
	}

});


// login 
router.get('/login', function(req,res){
	res.render('login');
});

// logout 
router.get('/logout', function(req,res){
	res.render('logout');
});


module.exports = router;