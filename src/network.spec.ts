import * as chai from 'chai'
import {IBlockchain,DataBlockchain} from './Blockchain';
import {IBlock,DataBlock} from './Block';
import {MQTTNetworker,MQTTNode} from './network'
import { doesNotReject } from 'assert';

let blockchain = new DataBlockchain(1);
let networker = new MQTTNetworker('001',blockchain);


describe('Network ',() =>{
    describe('MQTTNetworker',() =>{
        it('Check if connects',(done) =>{
            networker.connect({host:'localhost'},() =>{
                chai.expect(networker.client.connected).to.be.equal(true);
                done();
            });
        });
  
    });
})
