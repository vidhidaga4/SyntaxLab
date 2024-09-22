import React, {useState} from 'react'
import {v4 as uuidV4} from 'uuid';
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [roomId,setRoomId] = useState('');
  const [username,setUserName] = useState('');

  //Generating new room id
  const createNewRoom = (e) => {
     e.preventDefault();
     const id=uuidV4();
     setRoomId(id);
     toast.success("Created a new room");
  }

  //when user clicks on join
  const joinRoom = () => {
    if(!roomId && !username){
      toast.error('ROOM ID & Username is required');
      return;
    }
    if(!roomId){
      toast.error('ROOM ID is required');
      return;
    }
    if(!username){
      toast.error('Username is required');
      return;
    }

    //Redirect to Editor page
    navigate(`/editor/${roomId}`,{
      state: {
        username,
      },
    });
  };


  const handleInputEnter = (e) =>{
     if(e.code === 'Enter') {
      joinRoom();
     }
  }

  return (
    <div className="homePageWrapper">
      <div className="formWrapper">
        <img className="homePageLogo" src="/AppLogo.png" alt="syntax-lab" />
        <h4 className="mainLabel">Paste invitation ROOM ID</h4>
        <div className="inputGroup">
          <input
             type="text"
             className="inputBox"
             placeholder="ROOM ID"
             onChange={(e) => setRoomId(e.target.value)}
             value={roomId}
             onKeyUp={handleInputEnter}
          />
          <input
             type="text"
             className="inputBox"
             placeholder="USERNAME"
             onChange={(e) => setUserName(e.target.value)}
             value={username}
             onKeyUp={handleInputEnter}
          />
          <button className="btn joinBtn" onClick={joinRoom}>Join</button>
          <span className="createInfo">If you don't have an invite then create &nbsp;
            <a onClick={createNewRoom} href="" className="createNewBtn">new room</a>
          </span>
        </div>
       </div>
       <footer>
        <h4>Built with &#128155; by&nbsp; <a href="https://github.com/vidhidaga4">Vidhi</a></h4>
       </footer>
    </div>
  )
}

export default Home
