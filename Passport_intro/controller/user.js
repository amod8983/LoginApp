const express = require('express');
const router = express.Router();
const User = require('../model/user');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


router.get('/login', (req, res, next) => {
    res.render('login');
});

router.get('/register', (req, res, next) => {
    res.render('register', {
        errormsg: null
    });
});

router.get('/logout',(req,res,next)=>{
    req.logOut();
    req.flash('success_msg','successfully logged out..!');
    res.redirect('/user/login');
});

router.get('/reset',(req,res,next)=>{
    res.render('reset',{
        errormsg:null
    });
});

router.post('/reset',(req,res,next)=>{
    let name = req.body.name;
    let username = req.body.username;
    let password = req.body.password;
    let cpassword = req.body.cpassword;

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('cpassword', 'Should be same as the password').equals(req.body.password);
    let errors = req.validationErrors();
    if (errors) {
        res.render('reset', {
            errormsg: errors
        });
    }else{
        User.findOne({
                username: username
            },(err,user)=>{
                if(user===null){
                    req.flash('error_msg','Invalid username');
                    res.redirect('/user/reset');
                }else{
                    if(user.name!==name){
                        req.flash('error_msg', 'Name does not matched');
                        res.redirect('/user/reset');
                    }
                    else{
                        bcrypt.genSalt(10, (err, salt) => {
                            bcrypt.hash(password, salt, (err, hash) => {
                                User.updateOne({username:username},{
                                    password:hash
                                },(err,raw)=>{
                                        req.flash('success_msg', 'Reset successfull');
                                        res.redirect('/user/login');
                                });
                            });
                        });
                    }
                }
            });
    }
});

router.post('/register', (req, res, next) => {
    let name = req.body.name;
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    let cpassword = req.body.cpassword;

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('email', 'Valid email is required').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('cpassword', 'Should be same as the password').equals(req.body.password);

    let errors = req.validationErrors();
    if (errors) {
        res.render('register', {
            errormsg: errors
        });
    } else {
        let user = new User({
            name: name,
            username: username,
            email: email,
            password: password
        });
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                user.save().then(
                    resl => {
                        req.flash('success_msg', 'Successfully registered..!!');
                        res.redirect('/');
                    }
                ).catch(err => console.log(err));
            });
        });
    }
});
 passport.serializeUser(function (user, done) {
     done(null, user.id);
 });

 passport.deserializeUser(function (id, done) {
     User.findById(id, function (err, user) {
         done(err, user);
     });
 });
 passport.use(new LocalStrategy(
    function (username, password, done) {
        User.findOne({username: username}, function (err, user) {
            console.log(user);
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, {
                    message: 'Incorrect username'
                });
            }
            if (!user.comparePassword(user.password,password)) {
                return done(null, false, {
                    message: 'Incorrect password'
                });
            }
            return done(null, user);
        });
    }
));

router.post('/login',passport.authenticate('local', {
            successRedirect: '/profile',
            failureRedirect: '/user/login',
            failureFlash: true,
            successFlash:true
        }),(req, res) => {
});
module.exports = router;