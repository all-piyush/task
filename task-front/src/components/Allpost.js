import React, { useEffect, useState } from 'react'
import './Allpost.css';
import { Navigate, Outlet, useNavigate, useOutletContext } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { FaComments } from "react-icons/fa";
const Allpost = (props) => {
    const context=useOutletContext();
    const navigate=useNavigate();
    const {refreshtrigger,liked,setliked}=context;
    const api_url=process.env.REACT_APP_API_URL;
    const {posts,setposts}=props
    async function getlikedposts(){
      try{
        const response=await fetch(`${api_url}/api/v1/getlikedposts`,{
          method:"GET",
          headers:{'Content-Type':'application/json'},
          credentials:'include',
        })
        const result=await response.json();
        if (response.ok ) {
        setliked(result.likedposts)}
      }
      catch(error){
        console.log(error);
      }
    }
    async function getallposts() {
        try{
            const response=await fetch(`${api_url}/api/v1/allposts`,{
            method:"GET",
            credentials:'include'
          })
          const result=await response.json();
          if(response.ok){
            setposts(result.allposts);
          }
          }catch(error){
            console.log(error);
          }
      }
      
    const hearthandle=async(id,mainpost) =>{
      if(liked.some(p=>p._id===id)){
        const response=await fetch(`${api_url}/api/v1/removelike`,{
          method:'PUT',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({postid:id}),
          credentials:'include',
        })
        if(response.ok){
          setliked(prev=>prev.filter(p=>p._id!==id));
          setposts(prev => prev.map(p=>p._id===id? {...p,likes:{...p.likes,count:p.likes.count-1}}:p)
        );
        }
      }
      else{
        const response=await fetch(`${api_url}/api/v1/addlike`,{
          method:'PUT',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({postid:id}),
          credentials:'include',
        })
        if(response.ok){
          setposts(prev => prev.map(p=>p._id===id? {...p,likes:{...p.likes,count:p.likes.count+1}}:p))
          setliked(prev => [...prev, mainpost]);
        }
      }
      
    }
    function commenthandle(id){
      navigate(`/post/comments/${id}`);
    }
    useEffect(() => {
  async function fetchData() {
    await getlikedposts();   
    await getallposts();     
  }
  fetchData();
}, [refreshtrigger]); 
  
  return (
    <div id='post-cards'>
      <p>ALL POSTS</p>
      {posts.map((post)=>{
        return <div className='post-card'>
            <div className='profile'>
              <div><FaUserCircle className='user-icon'/></div>
              <div className='name'> {post.name}</div>
            </div>
            <div className='date'>{post.date}</div>
            <div className='text'>{post.text}</div>
            { post.imageurl&&
            <img src={post.imageurl} alt='' ></img>
            }
            <div className='interaction'>
              {liked.some(p=>p._id==post._id)?(<button onClick={()=>hearthandle(post._id,post)}><FaHeart className='redheart'/>{post.likes.count>0 && (<div className='count'>{post.likes.count}</div>)}</button>)
              :(<button onClick={()=>hearthandle(post._id,post)}><FaHeart className='heart'/>{post.likes.count>0 && (<div className='count'>{post.likes.count}</div>)}</button>)}
              <button onClick={()=>{commenthandle(post._id,post)}}><FaComments className='comments'/></button>
            </div>
        </div>
      })}
    </div>
  )
}


export default Allpost
