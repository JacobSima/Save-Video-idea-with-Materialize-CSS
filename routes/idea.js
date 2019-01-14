const express = require('express')
const router = express.Router()
const Idea = require('../model/Idea')
const {isAunthorized,isTheIdeaPoster}= require('../helpers/login')

router.get('/',[isAunthorized],async(req,res)=>{
  const ideas = await Idea.find({user:req.user.id}).sort({date:-1})
  res.render('ideas/ideas',{ideas:ideas})
})

router.get('/add',[isAunthorized],async(req,res)=>{
  res.render('ideas/add')
})

//process form to add idea
router.post('/',[isAunthorized],async(req,res)=>{
  let errors=[]
  if(req.body.title ===''){errors.push({text:'Please add a title'})}
  if(req.body.details ===''){errors.push({text:'Please add some details'})}
  if(errors.length>0){
    res.render('ideas/add',{
      errors:errors,
      title:req.body.title,
      details:req.body.details
    })
    return
  }
  //create a new user
  const newIdea = new Idea({
    title:req.body.title,
    details:req.body.details,
    user:req.user.id
  })
  //save to database
  await newIdea.save()
  req.flash('success_msg','Video Idea created')
  res.redirect('/ideas')
})

//get edit form
router.get('/:id',[isAunthorized,isTheIdeaPoster],async(req,res)=>{
  const idea = await Idea.findOne({_id:req.params.id})
  res.render('ideas/edit',{
    title:idea.title,
    details:idea.details,
    id:idea._id
  })
})

//process the edit form
router.put('/:id',[isAunthorized,isTheIdeaPoster],async(req,res)=>{
  let errors=[]
  if(req.body.title ===''){errors.push({title:'title field was empty'})}
  if(req.body.details ===''){errors.push({details:'details field was empty'})}
  if(errors.length>0){
    res.redirect('/ideas')
    return
  }
  // update the idea in the database
  const idea = await Idea.findOne({_id:req.params.id})
  idea.title=req.body.title
  idea.details = req.body.details
  await idea.save()
  req.flash('success_msg','Video Idea Updated')
  res.redirect('/ideas')
})

//delete idea
router.delete('/:id',[isAunthorized,isTheIdeaPoster],async(req,res)=>{
  await Idea.findOneAndDelete({_id:req.params.id})
  req.flash('success_msg','Video Idea Delete')
  res.redirect('/ideas')
})


module.exports = router