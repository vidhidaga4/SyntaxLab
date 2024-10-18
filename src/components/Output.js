import React, { useState ,useEffect} from 'react';
import Axios from 'axios';
import ACTIONS from '../Actions';
import { useRef } from 'react';


const Output = ({socketRef,roomId,inputRef,codeRef,language}) => {
  const [outputText, setOutputText] = useState('');
  const [loading, setLoading] = useState('');
  const outputRef = useRef(outputText);
  
   // Function to call the compile endpoint
  function compile() {
      setLoading(true);
      socketRef.current.emit(ACTIONS.LOADING_CHANGE,{roomId,loading:true});
      if (codeRef.current === ``) {
          return
      }
      // Post request to compile endpoint
      Axios.post(`${process.env.REACT_APP_BACKEND_URL}/compile`, {
          code: codeRef.current,
          language,
          input: inputRef.current
      }).then((res) => {
          outputRef.current = res.data.stdout || res.data.stderr;
          setOutputText(res.data.stdout || res.data.stderr);
          socketRef.current.emit(ACTIONS.LOADING_CHANGE,{roomId,loading:false});
          setLoading(false);
      }).catch((err) => {
          outputRef.current = "Error: " + err.response ? err.response.data.error : err.message;
          setOutputText("Error: " + (err.response ? err.response.data.error : err.message));
          socketRef.current.emit(ACTIONS.LOADING_CHANGE,{roomId,loading:false});
          setLoading(false);
      });
  }
  //emit changes to the server on ouput change
  useEffect(()=>{
    if(socketRef.current){
      socketRef.current.emit(ACTIONS.OUTPUT_CHANGE,{
        roomId,
        outputText,
      })
    }
  },[outputRef.current]);

  //listen changes for clients on output change and loading change from server
  useEffect(() => {
      if(socketRef.current){
        socketRef.current.on(ACTIONS.LOADING_CHANGE,({loading})=>{
          setLoading(loading);
        });
        socketRef.current.on(ACTIONS.OUTPUT_CHANGE,({outputText})=>{
          setOutputText(outputText);
          setLoading(false);
          outputRef.current = outputText;
        });
      }
      return () =>{
        socketRef.current.off(ACTIONS.OUTPUT_CHANGE);
      }
  },[socketRef.current]);

  const clearOutput = () => {
    outputRef.current="";
    setOutputText("");
  }

  return (
    <div className="outputWrapper">
      <div className="output-heading">
        <h3>Output</h3>
      </div>
      <div className="output-console">
        {loading?(
            <img className="loader" src="/loading.svg" alt="Loading.."/>
        ):(<>
        <textarea
          className="outputArea"
          value={outputRef.current}
          readOnly
          placeholder="Output will be displayed here..."
        />
        <button
         onClick={clearOutput}
         className="btn clearBtn">
          Clear
        </button>
        <button
         className="btn runBtn"
         onClick={compile}
         >
          Run
        </button>
        </>)}
      </div>
    </div>
  );
};

export default Output;

