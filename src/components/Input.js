import {React,useState} from 'react'

const Input = () => {
  const [inputText,setInputText]=useState("")

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };
  return (
     <div className="inputWrapper">
        <div className="input-heading">
           <h3>Input</h3>
        </div>
        <div className="input-console">
           <textarea
           className="inputArea"
           value={inputText}
           onChange={handleInputChange}
           placeholder="Enter input here..."
          />
        </div>
    </div>
  )
}

export default Input
