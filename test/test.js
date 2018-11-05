const {DataBlock,DataBlockchain} = require('../dist/index.js');

let blockchain = new DataBlockchain();

console.log(blockchain.genesis);

blockchain.addBlock(blockchain.createBlock({value:0, timestamp: Date.now()}));

console.log(blockchain.validateChain(blockchain.chain));



