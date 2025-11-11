const User=require('../models/User');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
exports.login=async(req,res)=>{
    try{
        const {email,password}=req.body;
        const exists=await User.findOne({email:email});
        if(!exists){
            return res.status(400).json({
                message:"Unable To Find User",
                success:false,
            })
        }
        const ispasswordcorrect=await bcrypt.compare(password,exists.password);
        if(ispasswordcorrect){
            const payload={email:exists.email,password:exists.password,name:exists.name,_id:exists._id};
            const token=await jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'1d'});
            const options={expires:new Date(Date.now()+24*60*60*1000),httpOnly:true,sameSite:'None',secure:true,path:'/'};
            return res.cookie("token",token,options).status(200).json({
                message:"User Logged In Successfully",
                success:true
            })
        }
        else{
            return res.status(400).json({
                message:"Email Or Password Incorrect",
                success:false,
            })
        }
    }catch(error){
        res.status(500).json({
            message:"Internal Server Error",
            success:false,
        })
    }
}
exports.signup=async(req,res)=>{
    try{
        const{name,email,password}=req.body;
        const exists=await User.findOne({email:email});
        if(exists){
            return res.status(400).json({
                message:"User Already Present",
                success:false
            })
        }
        const hashedpass=await bcrypt.hash(password,10);
        const newuser=await User.create({name:name,email:email,password:hashedpass});

        const payload={email:email,password:password,name:name,_id:newuser._id};
            const token=await jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'1d'});
            const options={expires:new Date(Date.now()+24*60*60*1000),httpOnly:true,sameSite:'None',secure:true,path:'/'};
            return res.cookie("token",token,options).status(200).json({
                message:"User Logged In Successfully",
                success:true
            }) 
    }catch(error){
        res.status(500).json({
            message:"Internal Server Error",
            success:false,
        })
    }   
}
