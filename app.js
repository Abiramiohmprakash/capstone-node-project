var express= require('express');
var path=require('path');
var bodyParser=require('body-Parser');
var cookieParser=require('cookie-Parser');
var expressSession=require('express-Session');
var passport= require('passport');
var passportLocal = require('passport-local');
var bcrypt= require('bcryptjs');
var passport = require('passport');
var passportLocal = require('passport-local');
var methodOverride = require('method-override');   

var app=express();

var mongoose = require('mongoose');
User = require('./models/user');
Splist=require('./models/Splist');
WishList=require('./models/WishList');
app.use(methodOverride());
var moviesJSON=require('./movies.json');

app.use(express.static(__dirname + '/public'));


mongoose.connect('mongodb://localhost:27017/hbcommunity');
var db = mongoose.connection;

app.set('view engine','ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


app.use(cookieParser());
app.use(expressSession({
    secret: 'secret123',
    resave: true,
    saveUninitialized: true,
    activeDuration: 5 * 60 * 1000
}));
// To do local authentication below lines are mandatory
app.use(passport.initialize());
app.use(passport.session());



passport.use(new passportLocal.Strategy(function (username, password,done) {


	  User.getUserByUsername(username, function (err, username) {
	  	if (err) throw err;
	  	 if (!username) {
                    console.log('Unknown user');
                    return done(null, false, {
                        message: 'Unknown user'
                    });
                }else{
                	//console.log(username);
                	var hash = username.password;
                	if (bcrypt.compareSync(password, hash)) {
                	  
                       console.log("Autehntication passed");
                        return done(null, {id:username._id,username:username.username});

                         }else{
                         	console.log('Invalid password');
                         	return done(null, false, {
                            message: 'Invalid password'
                           });
                         }   

                     }
	         });
   
}));



app.get('/',function(req,res){
  
	console.log("IS In Index"  , req.isAuthenticated());
	//if(req.isAuthenticated())
	 //  console.log(req.user.username);
	//console.log("Request object is " , req.body );
	if(req.isAuthenticated()) {
	res.render('index',{
		isAuthenticated:req.isAuthenticated(), 
		 user:req.user.username 
     
	 	
	   });
	 }else {
	 	res.render('index',{
		isAuthenticated:false, 
		 user:"no data" 	
	   });
	 }
});

app.get('/login',function(req,res){
	res.render('login',{
		isAuthenticated:req.isAuthenticated(), 
		user:req.user
	});
	//console.log("Inside login function" , req.isAuthenticated());
	//console.log("Inside login function", req.body);
}); 

app.post('/login',passport.authenticate('local', { failureRedirect: '/login' }),function(req,res){
     retStatus = 'Success';
                // res.redirect('/team');
                res.send({
                    retStatus: retStatus,
                    redirectTo: '/profile',
                    msg: 'Just go there please' // this should help
                });
});

passport.serializeUser(function (username, done) {
	
    done(null, username.id);
});

passport.deserializeUser(function (id, done) {
    User.getUserById(id, function (err, username) {
    	
        done(err, username);
    });
});



///////////----Logout route----------/////////////////////////////
app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});


// =====================================
// PROFILE SECTION =========================
// =====================================
// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
app.get('/profile',isLoggedIn,function (req, res) {
    //console.log(req);
    console.log("IS In PROFILE Index", req.isAuthenticated());
        res.render('profile', {
            isAuthenticated: req.isAuthenticated(),
            user: req.user

        });
  
});


app.get('/profile/mywishlist', isLoggedIn,function (req, res) { 
    console.log("Am I being called in WishList");
    WishList.find({username:req.user.username},function(err,data){
      //  console.log(data);
        if(err) throw err;
        res.render('mywishlist',{result:data});
    });

});


app.get('/profile/editwishlist/:id', isLoggedIn,function (req, res) { 
    console.log("Am I being called in Edit WishList");
    WishList.find({_id:req.params.id},function(err,data){
        //console.log(data);
         
        if(err) throw err;
        res.render('editwishlist',{
            result:data
        });
    }); 

});



app.put('/profile/updatewishlist/:id', isLoggedIn,function (req, res) { 
    console.log("Am I being called in Update WishList");
    // console.log(req);
   // console.log(req.body.wishlisttext);
   // console.log(req.body.wishlistlink);
   // console.log(req.body.wishlistcomment);
  //  console.log(req.params.id);

   


    WishList.findByIdAndUpdate({'_id':req.params.id},{username:req.user.username,
      email:req.user.email,
      wishlisttext: req.body.wishlisttext,
      wishlistlink: req.body.wishlistlink,
      wishlistcomment: req.body.wishlistcomment},function(err,result){
        console.log(JSON.stringify(result));
       
         
      if (err) {
            console.log(err.toString());
        } else {
            // handle document
            retStatus = 'Success';
          //res.send('done');

         // var value=res.json(data);
           // res.redirect('/team');
          res.send({
                retStatus: retStatus,
                 data:result,
                redirectTo: '/profile/editwishlist',
                msg: 'Just go there please' // this should help
            });  

        }
         
       // res.render('mywishlist',{
         //   result:data
      //  });
    }); 

/* WishList.find({username:req.user.username},function(err,data){
        console.log(data);
        if(err) throw err;
        res.render('mywishlist',{result:data});
    }); */


   

});



 app.delete('/profile/mywishlist/:id',function(req,res){
     
       console.log("Am I being called in DELETE WishList");
       // console.log(req.params.id);

      WishList.find({_id:req.params.id}).remove(function(err,data){
         if(err) throw err;
         res.render('mywishlist',{result:data});
      });
  });


app.post('/profile/editwishlist/:id',function(req,res){
     
       console.log("Am I being called in EDIT WishList");
       //console.log(req.params.id);
       //console.log(req);

     WishList.find({_id:req.params.id},function(err,editdataset) {
        //console.log(editdataset);
         if(err) throw err;

         //res.render('editwishlist',{result:data});


          retStatus = 'Success';
          //res.send('done');

         // var value=res.json(data);
           // res.redirect('/team');
          res.send({
                retStatus: retStatus,
                 data:editdataset,
                redirectTo: '/profile/mywishlist',
                msg: 'Just go there please' // this should help
            });  

      }); 
  });

   
      



app.post('/profile/mywishlist', isLoggedIn,function (req, res) {
console.log(req.body.wishlisttext);
console.log(req.body.wishlistlink);
console.log(req.body.wishlistcomment);

    if (req.body.wishlisttext &&
        req.body.wishlistlink &&
        req.body.wishlistcomment)

        //if (req.body.password !== req.body.confpassword) {
          //  var err = new Error("passwords do not match");
          //  err.status = 400;
         ///   throw err;
       // } else {

            var newWishList = new WishList({
               // username: req.body.name,
               // email: req.body.email,
                username:req.user.username,
                email:req.user.email,
                wishlisttext: req.body.wishlisttext,
                wishlistlink:req.body.wishlistlink,
                wishlistcomment:req.body.wishlistcomment
                //wishlistimage:req.body.wishlistimage,


            });
           // console.log("All data captured in backend" + req.user.username + " , " + req.user.email + " , " + newWishList.wishlisttext + "," + newWishList.wishlistlink + "," + newWishList.wishlistcomment);

            newWishList.save(newWishList, function (err) {
                if (err) throw err;
                console.log('User created!');

                retStatus = 'Success';

       // var value=res.json(results);
            // res.redirect('/team');
            res.send({
                retStatus: retStatus,
                redirectTo: '/profile/mywishlist',
                msg: 'Just go there please' // this should help
            });

            });

});


// route middleware to make sure
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}


app.post('/profile/search/', isLoggedIn,function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
     console.log("AM I COMING IN THE PROFILE ZIPCODE ");
    //var zipcode = req.params.zipcode;
    //console.log( req.params.zipcode);
   // console.log( req.body.zipcode);
   // console.log( req.body);

   // console.log( req.params);


    //var collection = db.collection('serviceproviderdetails');
    var tableData = [];
    db.collection('serviceproviderdetails').find({'zipcode': req.body.zipcode} ).toArray(function(err, results) {
       console.log( JSON.stringify(results));

       //var items=JSON.stringify(results);

        retStatus = 'Success';

       // var value=res.json(results);
            // res.redirect('/team');
            res.send({
                retStatus: retStatus,
                redirectTo: '/profile',
                data: {
                    results
                },
                msg: 'Just go there please' // this should help
            });


        });

    });


app.post('/register', function (req, res) {

    if (req.body.name &&
        req.body.email &&
        req.body.password &&
        req.body.confpassword)



        if (req.body.password !== req.body.confpassword) {
            var err = new Error("passwords do not match");
            err.status = 400;
            throw err;
        } else {

            var newUser = new User({
                username: req.body.name,
                email: req.body.email,
                password: req.body.password
            });
           // console.log("All data captured in backend" + newUser.username + "," + newUser.email + "," + newUser.password);

            User.createUser(newUser, function (err, user) {
                if (err) throw err;
                res.send('done');

            });
           
        }
     
});




    /*Splist.findOne({
        zipcode: "95014",
    }, function (err, items) {
        console.log("items ->", items);
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        } else if ((!items) || (items == "") || (items.length == 0)) {
            //bad username
            //console.log(items);
            return res.status(404).json({
                message: 'No items' + err
            });
        } else {
            console.log(items);

            retStatus = 'Success';
            // res.redirect('/team');
            res.send({
                retStatus: retStatus,
                redirectTo: '/',
                data: {
                    items
                },
                msg: 'Just go there please' // this should help
            });
            //res.sendFile(path.join(publicDir, "/index.html"));
            //res.send('done');
        }

    });*/



var port = process.env.PORT || 3000;

app.listen(port, function () {
    console.log("local host" + port);
});