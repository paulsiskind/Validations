var express = require('express');
var bcrypt = require('bcrypt')
var router = express.Router();
var db = require('monk')('localhost/valid-demo');
var signCollection = db.get('valid');

router.get('/valid/signup', function(req, res, next){
  res.render('valid/signup')
});

router.get('/valid', function(req, res, next){
  signCollection.find({}, function(err, data){
    res.render('valid/index',{allSign: data});
  });
});

router.get('/valid/signin', function(req, res, next){
  res.render('valid/signin')
});

router.post('/signup', function (req, res, next) {
  var errors = []
  if (req.body.email.length == 0) {
    errors.push("Email Can't Be Blank!")
    console.log('Name')
  }
  if (req.body.password.length == 0) {
    errors.push("Password Can't be Blank")
    console.log('Hobby')
  }
  if (req.body.password !== req.body.passwordB){
    errors.push('Password must match confirmation!')
    console.log('match')
  }
  if(errors.length) {
    res.render('valid/signup', {errors: errors})
  } 
  else {signCollection.find({email: req.body.email},
  function(err,data){
  if (data.length>0){
      errors.push('Email already exists');
      res.render('valid/signup', {errors: errors});
    }
else {
    var hash = bcrypt.hashSync(req.body.password, 8)
    signCollection.insert({ email: req.body.email,
                            password: hash
  }).then(function (err, data) {
    req.session.user = req.body.email;
  res.redirect('valid/show')
    })
  }
})
}
})

router.post('/signin', function (req, res, next) {
  var errors = [];
  if (req.body.email.length === 0) {
    errors.push("Email Can't Be Blank!");
    console.log('Name');
  }
  if (req.body.password.length === 0) {
    errors.push("Password Can't be Blank");
    console.log('Hobby');
  }
 
  if(errors.length) {
    res.render('valid/signin', {errors: errors});
  } 
  else {
    signCollection.find({email: req.body.email}, function(err, data) {
    if (data.length<=0) {
      errors.push('Email is not regestered');
      res.render('valid/signin', {errors: errors});
      console.log(data);
    }
    else if (bcrypt.compareSync(req.body.email, data[0].password)){
      errors.push('Password Does not Match');
      res.render('valid/signin', {errors: errors});
      
    }
    else {
      console.log('here')
         req.session.user = req.body.email;
         console.log(req.body.email)
         console.log(req.session)
         console.log(req.session.user)
         res.redirect('valid/show');
      
    }
  });
  } 
});
// req.body.password !== data[0].password)
router.get('/logout', function(req, res, next){
  req.session= null
  res.redirect("/")
});

router.get('/valid/show', function(req, res, next){
  console.log(req.session)
  console.log(req.session.user)
  res.render('valid/show', {user: req.session.user})
});
// res.session("user", req.body.email);

module.exports = router;