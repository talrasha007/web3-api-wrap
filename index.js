const Web3 = require('web3');

function promisify(fn) {
  return function () {
    const me = this;
    const args = Array.prototype.slice.call(arguments, 0);

    if (typeof args[args.length - 1] === 'function') {
      return fn.apply(me, args);
    } else {
      return new Promise(function (resolve, reject) {
        args.push(function (err, res) {
          if (err) reject(err);
          else resolve(res);
        });

        fn.apply(me, args);
      });
    }
  }
}

let web3;

if (window.web3) {
  web3 = new Web3(window.web3.currentProvider);

  window.web3.eth.getAccounts((err, accounts) => {
    if (!err) web3.eth.defaultAccount = accounts[0];
  });

  web3.eth.getAccounts = promisify(web3.eth.getAccounts);
  web3.eth.getBalance = promisify(web3.eth.getBalance);
  web3.eth.getBlockNumber = promisify(web3.eth.getBlockNumber);
  web3.eth.getBlock = promisify(web3.eth.getBlock);
  web3.eth.sendTransaction = promisify(web3.eth.sendTransaction);
  web3.eth.getTransactionReceipt = promisify(web3.eth.getTransactionReceipt);

  web3.loadContract = web3.eth.loadContract = function (abi, address) {
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