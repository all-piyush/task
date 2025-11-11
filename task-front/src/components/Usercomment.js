import React, { useEffect, useState } from 'react'
import { FaComments, FaHeart, FaUserCircle } from 'react-icons/fa';
import './Usercomment.css';
import { IoIosSend } from "react-icons/io";
import { useLocation, useNavigate, useOutletContext, useParams } from 'react-router-dom'

const Usercomment = (props) => {
  const navigate=useNavigate();
  const {id}=useParams();
  const[text,settext]=useState('');
  const[postcomments,setpostcomments]=useState([]);
  const{liked,setliked,posts,setposts,setrefreshtrigger}=props;
  const api_url=process.env.REACT_APP_API_URL;
  const selectedpost=posts.find(p=>p._id===id);
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
          setposts(prev => prev.map(p=>p._id===id? {...p,likes:{...p.likes,count:p.likes.count-1}}:p));
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
          setposts(prev => prev.map(p=>p._id===id? {...p,likes:{...p.likes,count:p.likes.count+1}}:p));
          setliked(prev => [...prev, mainpost]);
        }
      }
      
    }
    function commenthandle(id,selectedpost){
      navigate(`/post/comments/${id}`,{state:{selectedpost}});
    }
    const addcomment=async()=>{
      const response=await fetch(`${api_url}/api/v1/addcomment`,{
        method:"PUT",
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({postid:id,text:text}),
        credentials:'include',
      })
      if(response.ok){
        settext('');
        fetchcomments();
      }
    }
    async function fetchcomments(){
      const response=await fetch(`${api_url}/api/v1/getcomments`,{
        method:"POST",
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({postid:id}),
        credentials:'include'
      })
      const result=await response.json();
      setpostcomments(result.comments);
    }
    useEffect(()=>{
      fetchcomments()
    },[]);
  return (
    <div id='selectedpost-cards'>
      <div className='post-card'>
          <div className='profile'>
            <div><FaUserCircle className='user-icon'/></div>
            <div className='name'> {selectedpost.name}</div>
          </div>
          <div className='date'>{selectedpost.date}</div>
          <div className='text'>{selectedpost.text}</div>
          { selectedpost.imageurl&&
            <img src={selectedpost.imageurl} alt='' ></img>
          }
          <div className='interaction'>
              {liked.some(p=>p._id==selectedpost._id)?(<button onClick={()=>hearthandle(selectedpost._id,selectedpost)}><FaHeart className='redheart'/>{selectedpost.likes.count>0 && (<div className='count'>{selectedpost.likes.count}</div>)}</button>)
              :(<button onClick={()=>hearthandle(selectedpost._id,selectedpost)}><FaHeart className='heart'/>{selectedpost.likes.count>0 && (<div className='count'>{selectedpost.likes.count}</div>)}</button>)}
              <button onClick={()=>{commenthandle(selectedpost._id,selectedpost)}}><FaComments className='comments'/></button>
          </div>


          <div id="comment-text"><input type='text' placeholder="what's your comment" value={text}  onChange={(e)=>settext(e.target.value)}></input><button onClick={addcomment}><IoIosSend id="icon"/></button></div>
          <div>ALL COMMENTS</div>
          {postcomments.map((comment)=>{
              return <div className='comment-card'>
                <div className='comment-user'>
                  <div><FaUserCircle className='usericon'/></div>
                  <div className='user-name'> {comment.username}</div>
                </div>
                <div className='date'>{comment.date}</div>
                <div className='comment-text'>{comment.text}</div>

              </div>
            })}
      </div>
    </div>
  )
}

export default Usercomment
