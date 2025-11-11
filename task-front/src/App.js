import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Route,Routes} from 'react-router-dom';
import UserPost from './components/UserPost';
import UserLogin from './components/UserLogin';
import Allpost from './components/Allpost';
import MyPost from './components/MyPost';
import Usercomment from './components/Usercomment';
function App() {
  const[liked,setliked]=useState([]);
  const[posts,setposts]=useState([]);
  const[refreshtrigger,setrefreshtrigger]=useState(false);
  const[loggedin,setisloggedin]=useState(false);
  const api_url=process.env.REACT_APP_API_URL;
  useEffect(()=>{
    async function loggedin() {
      const response=await fetch(`${api_url}/api/v1/checkauth`,{
        method:"POST",
        headers:{'Content-Type':"application/json"},
        credentials:'include'
      })
      if(response.ok){
        setisloggedin(true);
      }
      else{
        setisloggedin(false);
      }
    }
    loggedin();
  },[]);
  return (
    <div id="app">
      <Routes>
        <Route path='/' element={ loggedin ? <Navigate to="/createpost" replace /> : <UserLogin /> } />
        <Route path='/createpost' element={<UserPost liked={liked} setliked={setliked} refreshtrigger={refreshtrigger} setrefreshtrigger={setrefreshtrigger}></UserPost>}>
          <Route  index element={<Navigate to='allposts' replace/>}></Route>
          <Route path="allposts" element={<Allpost posts={posts} setposts={setposts}/>}></Route>
          <Route path='myposts' element={<MyPost myposts={posts} setmyposts={setposts} ></MyPost>}></Route>
        </Route>
        <Route path='/post/comments/:id' element={<Usercomment liked={liked} setliked={setliked} setposts={setposts} setrefreshtrigger={setrefreshtrigger} posts={posts}/>}></Route>
      </Routes>
    </div>
  );
}

export default App;
