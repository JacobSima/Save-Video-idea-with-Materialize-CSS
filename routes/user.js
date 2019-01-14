const express = require('express')
const router = express.Router()
const User = require('../model/User')
const bcrypt = require('bcrypt')
const passport = require('passport')

router.get('/register',async(req,res)=>{
  res.render('users/register')
})

router.get('/login',async(req,res)=>{
  res.render('users/login')
})

router.get('/logout',async(req, res)=>{
  req.logout();
  res.redirect('/');
});

router.post('/login',async(req,res,next)=>{
  if(req.body.email ===''|| req.body.password===''){
    res.redirect('/users/login') 
    return}
  passport.authenticate('local',{
    successRedirect:'/ideas',
    failureRedirect:'/users/login',
    failureFlash:true
  })(req,res,next)
})

router.post('/register',async(req,res)=>{
  if(req.body.name ==='' || req.body.email ==='' || req.body.password ===''|| req.body.password2===''){
    req.flash('error','All fields required')
    res.render('users/register',{
      name:req.body.name,
      email:req.body.email,
      password:req.body.password,
      password2:req.body.password2
    })
    return
  }
  if(req.body.password.length<5){
    req.flash('error','Password must be at least 5 characters')
    res.render('users/register',{
      name:req.body.name,
      email:req.body.email,
      password:req.body.password,
      password2:req.body.password2
    })
    return
  }
  if(req.body.password !==req.body.password2 ){
    req.flash('error','Password do not match')
    res.render('users/register',{
      name:req.body.name,
      email:req.body.email,
      password:req.body.password,
      password2:req.body.password2
    })
    return
  }
   const email = await User.findOne({email:req.body.email})
   if(email){
    req.flash('error_msg','Email already exist')
    res.redirect('/users/login')
    return
   }
  //hash the password
  const password = await bcrypt.hash(req.body.password,10)
  const newUser = new User({
    name:req.body.name,
    email:req.body.email,
    password
  })
   await newUser.save()
   req.flash('success_msg','You are not registered You can log in')
   res.redirect('/users/login')
})


module.exports = router