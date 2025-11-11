const express=require('express');
const router=express.Router();
const{allposts,myposts}=require('../controller/AllPost');
const{postdata,addlike,removelike,getalliked,addcomment,getcomments}=require('../controller/Post');
const{verifylogin,checkauth}=require('../controller/Verify');
const{login,signup}=require('../controller/Login');
router.post('/login',login);
router.post('/signup',signup);
router.post('/newpost',verifylogin,postdata);
router.get('/allposts',verifylogin,allposts);
router.get('/myposts',verifylogin,myposts);
router.put('/addlike',verifylogin,addlike);
router.put('/removelike',verifylogin,removelike);
router.get('/getlikedposts',verifylogin,getalliked);
router.put('/addcomment',verifylogin,addcomment);
router.post('/getcomments',verifylogin,getcomments);
router.post('/checkauth',checkauth)
module.exports=router;