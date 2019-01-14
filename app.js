const express= require('express')
const exphbs  = require('express-handlebars')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash');
const passport = require('passport')


//define express app
const app = express()
//load router
const home = require('./routes/home')
const ideas = require('./routes/idea')
const users = require('./routes/user')

//passport 
require('./config/passport')(passport)

//connect to mongodb
mongoose.connect('mongodb://localhost/videoApp2',{ useNewUrlParser: true })
  .then(()=>{console.log('MongoDB connected...')})

//handlebars Middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//bodyparser Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// method overrride middleware
app.use(methodOverride('_method'))

//serve static folder
app.use(express.static(path.join(__dirname,'public')))
// session and connect middleware
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());




//locas variables
app.use((req,res,next)=>{
   res.locals.success_msg = req.flash('success_msg')
   res.locals.error_msg = req.flash('error_msg')
   res.locals.error = req.flash('error')
   res.locals.user =req.user || null
   next()
})

//use routes
app.use('/',home)
app.use('/ideas',ideas)
app.use('/users',users)


const port = 5000
app.listen(port,()=>{
  console.log(`Server started at port: ${port}`)
})