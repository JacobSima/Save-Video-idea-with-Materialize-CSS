const LocalStrategy = require('passport-local').Strategy
const User = require('../model/User')
const bcrypt = require('bcrypt')


module.exports =function(passport){
    passport.use(new LocalStrategy({usernameField:'email'},async(email,password,done)=>{
          const user = await User.findOne({email:email})
          if(!user){
            return done(null,false,{message:'User not Found'}) }
          const match = await bcrypt.compare(password,user.password)
          if(!match){
            req.flash('error_msg','Wrong password')
            return done(null,false)
          }
          return done(null, user);  
    }))

    passport.serializeUser(function(user, done) {
      done(null, user.id);
    });
    
    passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
        done(err, user);
      });
    });
}
