var express = require('express');
var router = express.Router();

// Get Homepage
router.get('/', validateUser,function(req,res){
	res.render('index');
});

function validateUser(req,res,next){
	if (req.isAuthenticated()){
		req.flash('success_msg','You are logged in');
		return next();
	} else {
		req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;