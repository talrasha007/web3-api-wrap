const Web3 = require('web3');

function promisify(fn) {
  return function () {
    const args = Array.prototype.slice.call(arguments, 0);
    return new Promise(function (resolve, reject) {
      args.push(function (err, res) {
        if (err) reject(err);
        else resolve(res);
      });

      fn.apply(null, args);
    });
  }
}

let web3;

if (window.web3) {
  web3 = new Web3(window.web3.currentProvider);

  web3.eth.getBalance = promisify(web3.eth.getBalance);
  web3.eth.getBlockNumber = promisify(web3.eth.getBlockNumber);
  web3.eth.getBlock = promisify(web3.eth.getBlock);
  web3.eth.getTransactionReceipt = promisify(web3.eth.getTransactionReceipt);

  web3.loadContract = function (abi, address) {
    const instance = web3.eth.contract(abi).at(address);

    abi.forEach(api => {
      if (api.type === 'function') {
        instance[api.name] = promisify(instance[api.name]);
      }
    });

    return instance;
  }
}

module.exports = { web3 };