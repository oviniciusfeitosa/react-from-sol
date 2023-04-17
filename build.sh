#!/bin/sh

if [ ! $# -eq 1 ]; then
  echo "[ERROR] Enter the name of the contract"
  return;
fi

truffle migrate build
solcjs ./contracts/$1.sol --abi --output-dir ./build/contracts/abi/ -p 
mv ./build/contracts/abi/contracts_$1\_sol_$1.abi ./contractABI.json