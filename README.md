#web3-helper
Make web3@0.20.x easier to use in browser with wallet plugin such as MetaMask.

## Usage
```js
const { web3 } = require('web3-api-wrap');

async function foo() {
  console.log(await web3.eth.getBalance('an address'));
  
  const abi = require('your abi json file');

  const yourContract = web3.loadContract(abi, 'your contract address');
  console.log(await yourContract.someFunction());
}

foo().catch(console.log);
```