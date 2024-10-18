import {React,useState,useEffect} from 'react'
import ACTIONS from '../Actions';

const Input = ({inputRef,socketRef,roomId}) => {
  const [inputText,setInputText]=useState("")
  

  //emit input changes to the server
  useEffect(() => {
    if(socketRef.current){
       inputRef.current=inputText;
       socketRef.current.emit(ACTIONS.INPUT_CHANGE, { roomId, inputText });
    }
  },[inputText]);

  // Listen for input change events from the server
  useEffect(() => {
    const handleInputChange = ({ inputText: serverInputText }) => {
      // Avoid setting state if the input hasn't changed to prevent unnecessary re-renders
      if (serverInputText !== inputRef.current) {
        inputRef.current = serverInputText;
        setInputText(serverInputText);
      }
    };

    if (socketRef.current) {
      socketRef.current.on(ACTIONS.INPUT_CHANGE, handleInputChange);
    }
    return () => {
      socketRef.current.off(ACTIONS.INPUT_CHANGE);
    }
  },[socketRef.current]);


  return (
     <div className="inputWrapper">
        <div className="input-heading">
           <h3>Input</h3>
        </div>
        <div className="input-console">
           <textarea
           className="inputArea"
           value={inputText}
           onChange={(event)=>{setInputText(event.target.value)}}
           placeholder="Enter input here..."
          />
        </div>
    </div>
  )
}

export default Input
