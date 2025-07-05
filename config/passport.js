const GoogleStrategy =require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')

const User = require('../models/User')
const { getFirstDynamicReason } = require('next/dist/server/app-render/dynamic-rendering')

module.exports =function(passport){
    passport.use(new GoogleStrategy({
        clientID:process.env.Google_CLIENT_ID,
        clientSecret:process.env.Google_CLIENT_SECRET,
        callbackURL:'/auth/google/callback'
    },
    async(accessToken,refreshToken,profile,done)=>{
const newUser={
  googleId:profile.id,
  displayName:profile.displayName,
  firstName:profile.name.givenName,
  lastName:profile.name.familyName,
  image:profile.photos[0].value
}   
try {
  let user = await User.findOne({googleId:profile.id});

  if(user){
    done(null,user)
  }else{
    user= await User.create(newUser)
    done(null,user)
  }
} catch (err) {
  console.error(err)
    }
  }
)
)
passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
  try {
    const user = await User.findById(id);
    cb(null, user);
  } catch (err) {
    cb(err);
  }
});
}