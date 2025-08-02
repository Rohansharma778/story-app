const express =require('express')
const router =express.Router()
const{ ensureAuth,ensureGuest } = require('../middleware/Auth.js')
const Story =require('../models/Story.js')
// const story = require('../models/story.js')

//@desc login/landing page
//@route Get/
router.get('/',ensureGuest,(req,res)=>{
    res.render('login',{
        layout:'login',
    })
})

//@desc dashboard
//@route Get/
router.get('/dashboard',ensureAuth,async(req,res)=>{
    try {
        const stories = await Story.find({ user: req.user.id }).lean()
    res.render('dashboard', {
    name: req.user.firstName,
    stories
})
    } catch (error) {
        console.error(err)
        res.render('error/500')
    }

   
})

module.exports = router