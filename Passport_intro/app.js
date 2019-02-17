const express=require('express');
const path=require('path');
const bodyParser=require('body-parser');
const cookieParser=require('cookie-parser');
const flash=require('connect-flash');
const expressValidator=require('express-validator');
const session=require('express-session');
const passport=require('passport');
const mongoose=require('mongoose');

const app=express();
const homeRoutes=require('./controller/home');
const userRoutes=require('./controller/user');


app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret:'admin',
    saveUninitialized:true,
    resave:true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

app.use(flash());
app.use((req,res,next)=>{
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.error=req.flash('error');
    res.locals.user=req.user||null;
    next();
});


app.use('/user', userRoutes);
app.use('/',homeRoutes);


mongoose.connect('mongodb+srv://amod:amod8983@cluster0-jqhvu.mongodb.net/loginUser?retryWrites=true')
.then((result)=>{
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
})
.catch(err=>console.log(err));