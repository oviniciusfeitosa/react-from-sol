const Web3 = require("web3");
const fs = require("fs");

let outputName = "contractUI.tsx";

if (process.argv.includes("--help")) {
  console.log("[ Help ]");
  console.log("Usage: CONTRACT_ADDRESS [ (optional) OUTPUT_NAME ] ");
  console.log("Example: 0xAA715F076edc40e772706dcBc60D0847Db82321b");
  console.log("Example2: 0xAA715F076edc40e772706dcBc60D0847Db82321b MyContractUi");
  return
}

if (!process.argv[2]) {
  console.log("Enter the contract address");
  return;
}
const contractAddress = process.argv[2];

if (process.argv[3]) {
  outputName = `${process.argv[3]}.tsx`;
}

const contractABI = JSON.parse(fs.readFileSync("contractABI.json", "utf8"));
const web3 = new Web3("http://localhost:8545");
const contractInstance = new web3.eth.Contract(contractABI, contractAddress);

const inputs = contractABI
  .map((item) => {
    if (item.type === "function") {
      const inputs = item.inputs.map(
        (input) =>
          `<input type="text" name="${input.name}" placeholder="${input.type}"/>`
      );
      return `<div><h3>${item.name}</h3>${inputs.join("")}</div>`;
    }
    return "";
  })
  .join("");

const output = `import React, { useState } from 'react';

export default function ContractUI() {
  const [result, setResult] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Recupere os valores dos inputs do formulário
    const formData = new FormData(event.target);
    const functionArgs = [];
    for (let input of formData) {
      functionArgs.push(input[1]);
    }

    try {
      // Execute a função do contrato
      const functionResult = await contractInstance.methods.${contractABI[0].name}(functionArgs).call();
      setResult(functionResult);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <h2>${contractABI[0].name}</h2>
      <form onSubmit={handleSubmit}>
        ${inputs}
        <button type="submit">Executar</button>
      </form>
      <div>Resultado: {result}</div>
    </div>
  );
}`;

fs.writeFileSync(outputName, output);
