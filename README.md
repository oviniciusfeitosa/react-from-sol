# React from Solidity

Create React template from Solidity SmartContract

## Requirements

- Truffle
- solcjs
- Node v18.14.2
- (optional) Ganache

## How to use


- Make sure the smart contract is located inside the `contracts/` directory, for example: `contracts/YourSmartContract.sol`.

```sh
# Start local blockchain network
npx ganache

# Generate React UI from ABI file
yarn start Storage
```