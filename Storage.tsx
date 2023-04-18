import React, { useState } from 'react';

import contractABI from "./StorageABI.json";
export default function ContractUI() {
  const [result, setResult] = useState('');
  const web3 = new Web3("http://localhost:8545");
  const contractAddress = '0x...';
  const contractInstance = new web3.eth.Contract(contractABI, contractAddress);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Recover input values from form
    const formData = new FormData(event.target);
    const functionArgs = [];
    for (let input of formData) {
      functionArgs.push(input[1]);
    }

    try {
      const functionResult = await contractInstance.methods.retrieve(functionArgs).call();
      setResult(functionResult);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <h2>retrieve</h2>
      <form onSubmit={handleSubmit}>
        <div><h3>retrieve</h3></div><div><h3>store</h3><input type="text" name="num" placeholder="uint256"/></div>
        <button type="submit">Execute</button>
      </form>
      <div>Result: {result}</div>
    </div>
  );
}