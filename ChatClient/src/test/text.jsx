// src/pages/Test1.js
import React, { useContext, useState } from 'react';
import { ValueContext } from '../context/AppContext';

const Test1 = () => {
  const { setValue } = useContext(ValueContext);
  const [inputValue, setInputValue] = useState('');

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(inputValue);
    setValue(inputValue);
  };

  return (
    <div>
      <h1>Set Value</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" value={inputValue} onChange={handleChange} />
        <button type="submit">Set Value</button>
      </form>
    </div>
  );
};

export default Test1;
