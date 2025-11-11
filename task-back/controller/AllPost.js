const Post=require('../models/PostSchema');
exports.allposts=async(req,res)=>{
    try{
        const posts=await Post.find({});
        return res.status(200).json({
            message:"All Posts Fetched Successfully",
            allposts:posts,
            success:true,
        })
    }catch(error){
        return res.status(500).json({
            message:"Internal Server Error",
            success:false,

        })
    }
}
exports.myposts=async(req,res)=>{
    try{
        const email=req.user.email;
        const posts=await Post.find({email:email});
        return res.status(200).json({
            message:"All Posts Fetched Successfully",
            myposts:posts,
            success:true,
        })
    }catch(error){
        res.status(500).json({
            message:"Internal Server Error",
            success:false,

        })
    }
}