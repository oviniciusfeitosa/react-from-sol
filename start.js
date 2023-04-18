#!/usr/bin/env node
const path = require('path')
const fs = require("fs");
const { execSync } = require("child_process");

const helpMessage = (errorMessage) => {
  if (errorMessage) {
    console.log(`\n[ Error ] ${errorMessage}\n`);
  }
  console.log("[ Help ]\n");
  console.log("Usage: CONTRACT_NAME [OPTIONS]");
  console.log("Example: MyContract");
  console.log("\n [Options] \n");
  console.log("--from-contract              : Generate ABI from contract");
  console.log("--address CONTRACT_ADDRESS   : Set the contract address");
  return;
};

if (process.argv.includes("--help")) {
  helpMessage();
  return;
}

if (!process.argv[2]) {
  helpMessage("Enter the contract name");
  return;
}

// if (!process.argv[3]) {
//   helpMessage('Enter the contract address')
//   return
// }
let contractAddress = "0x...";
for (let i = 2; i < process.argv.length; i++) {
  if (process.argv[i] === "--address") {
    contractAddress = process.argv[i + 1];
    break;
  }
}
const contractName = process.argv[2];
const outputName = `${contractName}.tsx`;


// caminho absoluto do diretório ./contracts
const currentPath = __dirname;
const contractsPath = path.join(currentPath, './contracts')
const buildPath = path.join(currentPath, './build')

if (process.argv.includes("--from-contract") || !fs.existsSync(`./${contractName}ABI.json`)) {
  execSync("truffle compile")
  execSync(`solcjs ${contractsPath}/${contractName}.sol --abi --output-dir ${currentPath} -p`);
  execSync(
    `mv ${currentPath}/contracts_${contractName}_sol_${contractName}.abi ./${contractName}ABI.json`
  );
  console.info(`[INFO] \`${contractName}ABI.json\` file generated successfully`);
}

const contractABI = JSON.parse(fs.readFileSync(`${contractName}ABI.json`, "utf8"));

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

import contractABI from "./${contractName}ABI.json";
export default function ContractUI() {
  const [result, setResult] = useState('');
  const web3 = new Web3("http://localhost:8545");
  const contractAddress = '${contractAddress}';
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
        <button type="submit">Execute</button>
      </form>
      <div>Result: {result}</div>
    </div>
  );
}`;

fs.writeFileSync(outputName, output);
console.info(`[INFO] \`${outputName}\` file generated successfully`);