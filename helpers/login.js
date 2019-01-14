
const Idea = require('../model/Idea')
module.exports ={
  isAunthorized:function(req,res,next){
     if(!req.isAuthenticated()){
       req.flash('error_msg','You are not Authorized')
       res.redirect('/users/login')
       return
     }
     next();
  },
  isTheIdeaPoster:async(req,res,next)=>{
     const idea= await Idea.findOne({_id:req.params.id})
     if(idea.user !== req.user.id){
      req.flash('error_msg','You are not Authorized')
      res.redirect('/users/login')
      return
     }
     next()

  }
}