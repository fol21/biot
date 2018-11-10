import * as chai from 'chai'
import {IBlockchain,DataBlockchain} from './Blockchain';
import {IBlock,DataBlock} from './Block';

let blockchain = new DataBlockchain();


describe('Blockchain ',() =>{
    describe('DataBlochain',() =>{
        it('should check if Genesis block instance is DataBlock',() =>{
            chai.expect(blockchain.genesis).to.be.an.instanceof(DataBlock);
        });
        it('should check if chain lengh starts at 1',() =>{
            chai.expect(blockchain.chain.length).to.be.equal(1);
        });
        it('should check if addBlock returns a chain  with length n+1',() =>{
            let len = blockchain.chain.length;
            chai.expect(blockchain.addBlock(blockchain.createBlock({value:0, collectionTime: Date.now()})).length)
                .to.be.equal(len + 1);
        });
        it('should check if validateChain returns true',() =>{
            chai.expect(blockchain.validateChain(blockchain.chain)).to.be.equal(true);
        });
})
})

