var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
app.use(cookieParser());
app.set('view engine', 'ejs')
app.use(express.static('public'));
var fs = require('fs');
var _ = require('underscore');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var sha1 = require('sha1');



app.get('/', function (req, res) {
	if(req.cookies.login && req.cookies.email){
		res.render('home.ejs');
	}else{
		res.redirect('/signin')
	}
});

app.get('/signup', function (req, res) {
	res.render('signup.ejs');
});

app.post('/signup', function (req, res) {
	if(req.body.login.length < 2 || req.body.email.length < 5 || req.body.password.length < 6 || req.body.password !== req.body.repassword){
		res.send('not valid data')
	}else{
		fs.readFile('./users.json', 'utf-8', function(err, data){
			if(err){
				console.log(err);
			}else{
				var json = JSON.parse(data);
				var user = _.find(json, function (elm, index) {
					return elm.email == req.body.email && elm.password == sha1(req.body.password);
				}) 
				if(user){
					res.cookie('email', req.body.email);
					res.cookie('login', user.login);
					res.redirect('/signin');
				}else{
					var dataArr = JSON.parse(data);
					var newData = {
						login: req.body.login,
						email: req.body.email,
						password: sha1(req.body.password)
					};
					dataArr.push(newData);
					fs.writeFile("./users.json", JSON.stringify(dataArr), function() {
							console.log(JSON.stringify(dataArr))
					});
					res.redirect('/signin');
				}
			}
		})
	}
});

app.get('/signin', function (req, res) {
	res.render('signin.ejs');
});

app.post('/signin', function (req, res) {
	fs.readFile('./users.json', 'utf-8', function(err, data){
		if(err){
			console.log(err);
		}else{
			console.log(req.body);
			var json = JSON.parse(data);
			var user = _.find(json, function (elm, index) {
				return elm.email == req.body.email && elm.password == sha1(req.body.password);
			}) 
			if(user){
				res.cookie('email', req.body.email);
				res.cookie('login', user.login);
				res.redirect('/');
			}else{
				res.redirect('/signin');
			}
		}
	})
});

app.listen(3000);