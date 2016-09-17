var express = require('express');
var router = express.Router();
var passport =require('passport');
var LocalStrategy = require('passport-local').Strategy;

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
router.post('/login'
	, passport.authenticate('local',{successRedirect:'/',failureRedirect:'/users/login',failureFlash:true})
	,function(req,res){
		res.redirect('/');
});

// logout 

router.get('/logout',function(req,res){
	req.logout();
	req.flash('success_msg','You are logged out!');
	res.redirect('/users/login');
});

///----------------------------------
passport.use(new LocalStrategy(
	function(username,password,done){
		User.getUserByUsername(username,function(err,user){
			if (err) return done(err);
			if (!user){
				return done(null,false,{message:'Incorrect username.'});
			}
			User.comparePassword(password,user.password,function(err,isMatch){
				if (isMatch){
					return done(null,user);
				} else {
					return done(null,false,{message:'Incorrect password.'});
				}
			})
		});
	}
	));


passport.serializeUser(function(user,done){
	done(null,user.id);
})
passport.deserializeUser(function(id,done){
	User.getUserById(id,function(err,user){
		done(err,user);
	})
})


module.exports = router;
