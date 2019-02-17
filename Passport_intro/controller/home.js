const express=require('express');
const router=express.Router();

function authGuard(req,res,next){
     if (req.isAuthenticated()) {
         next();
     } else {
         req.flash('error_msg', 'You are not looged in');
         res.redirect('/user/login');
     }
}

router.get('/profile', authGuard, (req, res, next) => {
    res.render('profile',{
        name:req.user.name
    });
});

router.get('/',(req,res,next)=>{
    res.render('home');
});



module.exports=router;