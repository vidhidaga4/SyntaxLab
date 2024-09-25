import React, { useState } from 'react';

const Output = () => {
  const [outputText, setOutputText] = useState('');

  return (
    <div className="outputWrapper">
      <div className="output-heading">
        <h3>Output</h3>
      </div>
      <div className="output-console">
        <textarea
          className="outputArea"
          value={outputText}
          readOnly
          placeholder="Output will be displayed here..."
        />
      </div>
    </div>
  );
};

export default Output;

