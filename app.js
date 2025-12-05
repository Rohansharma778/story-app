const path = require('path')
const express= require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const passport = require('passport')
const session=require('express-session')
const MongoStore = require('connect-mongo')
const connectDB= require('./config/db.js')

//Load config
dotenv.config({path:'./config/config.env'})

//passport config
require('./config/passport')(passport)

connectDB()

const app=express()

//Body parser
app.use(express.urlencoded({extended:false}))
app.use(express.json())

//methodovrride
app.use(methodOverride(function(req,res){
  if(req.body && typeof req.body ==='object' && '_method' in req.body){
    // look in url POST bodies and delete it
    let method = req.body._method
    delete req.body._method
    return method
  }
}))

//Logging
if(process.env.NODE.ENV==='development'){
    app.use(morgan('dev'))
}

//handlerbars helper 
const {formatDate,stripTags,truncate,editIcon,select}=require('./helper/hbs')

//handlebars
const hbs = exphbs.create({
  helpers: {
    formatDate,
    stripTags,
    truncate,
    editIcon,
    select,
  },
  defaultLayout: 'main',
  extname: 'hbs'
});

app.engine('.hbs', hbs.engine)
app.set('view engine', '.hbs')

//sessions
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store:MongoStore.create({mongoUrl:process.env.MONGO_URI})
}))

//passport middlewarer
app.use(passport.initialize())
app.use(passport.session())

//SET  global var
app.use(function(req,res,next){
  res.locals.user=req.user || null
  next();
})


//static folder
app.use(express.static(path.join(__dirname,'public')))

//routes
app.use('/',require('./routes/index'))
app.use('/auth',require('./routes/auth'))
app.use('/stories',require('./routes/stories'))

// 404 handler (should be after all other routes)
app.use((req, res) => {
  res.status(404).render('error/404');
});
                       
// 500 handler (should be after all other middleware and routes)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error/500');
});

// Export for Vercel serverless
module.exports = app;

// Only listen when running locally (not on Vercel)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
}