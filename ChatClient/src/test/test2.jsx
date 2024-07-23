// src/pages/Page2.js
import React, { useContext } from 'react';
import { ValueContext } from '../context/AppContext';

const Page2 = () => {
  const { value } = useContext(ValueContext);

  return (
    <div>
      <h1>Display Value</h1>
      <p>The value is: {value}</p>
    </div>
  );
};

export default Page2;
