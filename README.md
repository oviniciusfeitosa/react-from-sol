# React From ABI

Create React UI components from contract ABI.

## Requirements

- Ganache
- Truffle
- solcjs
- Node v18.14.2

## How to use

```sh
# Start local blockchain network
npx ganache

# Create ABI file
#yarn build ContractName
yarn build Storage

# Generate React UI from ABI file
yarn start address ContractName
```