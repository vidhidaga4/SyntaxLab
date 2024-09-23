import React, {useState,useRef,useEffect} from 'react'
import toast from 'react-hot-toast';
import ACTIONS from '../Actions';
import Client from '../components/Client'
import Editor from '../components/Editor'
import { initSocket } from '../socket';
import {useLocation, useNavigate, Navigate, useParams} from 'react-router-dom'
import Navbar from '../components/Navbar.js'

const EditorPage = () => {
  const socketRef = useRef(null); 
  const codeRef = useRef(null);
  const location = useLocation();
  const {roomId} = useParams();
  const reactNavigator = useNavigate();
  const [clients, setClients] = useState([]);

  //add
  const [language,setLanguage] = useState("python");
  const [fontSize,setFontSize] = useState(16);
  const [theme,setTheme] = useState("dark");

  useEffect(() => {
     const init = async () => {
        socketRef.current = await initSocket();
        socketRef.current.on('connect_error',(err)=>handleErrors(err));
        socketRef.current.on('connect_failed',(err)=>handleErrors(err));
        function handleErrors(e){
          console.log('socket error', e);
          toast.error('Socket connection failed, try again later.')
          reactNavigator('/');
        }

        socketRef.current.emit(ACTIONS.JOIN,{
          roomId,
          username: location.state?.username,
        });

        //Listening for JOINED event
        socketRef.current.on(ACTIONS.JOINED,({clients,username,socketId,language})=>{
          if(username !== location.state?.username){
            toast.success(`${username} joined the room`);
          }
          setClients(clients);
          setLanguage(language)
          socketRef.current.emit(ACTIONS.SYNC_CODE,{
            code:codeRef.current,
            socketId,
          })
        });
 

        //Listening for disconnected
        socketRef.current.on(ACTIONS.DISCONNECTED, ({socketId,username}) => {
           toast.success(`${username} left the room`);
           setClients((prev) => {
            return prev.filter(client => client.socketId!== socketId);
           })
        })

         // Listening for language changes
        socketRef.current.on(ACTIONS.LANGUAGE_CHANGE, ({ language }) => {
            setLanguage(language);
        });

       }
     init();
     return () => {
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
      socketRef.current.off(ACTIONS.LANGUAGE_CHANGE);
      socketRef.current.disconnect();
     }
  },[]);

  async function copyRoomId() {
    try{
      await navigator.clipboard.writeText(roomId);
      toast.success('Room Id has been copied to your clipboard');
    }catch(err) {
      toast.error("Could not copy the Room Id");
      console.error(err);
    }
  }

  function leaveRoom() {
    reactNavigator('/');
  }


  if(!location.state){
    return <Navigate to='/'/>
  }


  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    setLanguage(newLanguage);

    // Emit the language change to other clients
    socketRef.current.emit(ACTIONS.LANGUAGE_CHANGE, {
        roomId,
        language: newLanguage,
    });
};

  const handleFontSizeChange = (event)=>{
    setFontSize(event.target.value);
  }

  const handleThemeChange = (event)=>{
    setTheme(event.target.value);
  }

  if(theme==="dark"){
    document.documentElement.style.setProperty('--background-color','#1c1e29');
    document.documentElement.style.setProperty('--text-color','#fff');
    document.documentElement.style.setProperty('--input-output-color','#282a36');
  } else {
    document.documentElement.style.setProperty('--background-color','#fff');
    document.documentElement.style.setProperty('--text-color','#000');
    document.documentElement.style.setProperty('--input-output-color','#f0f0f0');
  }

  return (
    <div className="mainWrap">
      <div className="aside">
        <div className="asideInner">
          <div className="logo">
            <img className="logoImage" src="/EditorLogo.png" alt="Logo"/>
          </div>
          <h3>Connected</h3>
          <div className="clientsList">  
            {clients.map((client) => (
                <Client key={client.socketId} username={client.username}/>
              ))}
          </div>
        </div>
        <button className="btn copyBtn" onClick={copyRoomId}>Copy ROOM ID</button>
        <button className="btn leaveBtn" onClick={leaveRoom}>Leave</button>
      </div>

      
  
       <div className='editorBarWrap'>
        <Navbar 
            language={language} 
            handleLanguageChange={handleLanguageChange}
            fontSize={fontSize}
            handleFontSizeChange={handleFontSizeChange}
            theme={theme}
            handleThemeChange={handleThemeChange}
            
        />
        <div className='editorWrap'>
        <Editor 
            socketRef={socketRef} 
            roomId={roomId} 
            onCodeChange={(code)=>{codeRef.current=code}}
            fontSize={fontSize}
            theme={theme}
            language={language}
        />
        </div>
      </div>
    </div>
  )
}

export default EditorPage
