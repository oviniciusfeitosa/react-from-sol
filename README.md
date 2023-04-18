# React From ABI

Create React UI components from contract ABI.

## Requirements

- Truffle
- solcjs
- Node v18.14.2
- (optional) Ganache

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