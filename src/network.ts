import { IBlock } from ".";
import { IBlockchain } from "./Blockchain";
import * as mqtt from 'mqtt';
import { MqttClient } from "mqtt";

export enum MQTTNetworkTopicsEnum{
    ADD = '/add',
    CONSENSUS = '/consensus',
    NEW_NODE = '/new-node'
}

export interface INetworkNode{
    id : any;
}

export class MQTTNode implements INetworkNode{
    id: string;
    topic: string;

    constructor(id : string, topic: string){
        this.id = id;
        this.topic = topic;
    }
}

export interface INetworker {
    
    node: INetworkNode;
    networkNodes : INetworkNode[];

    mine(data : any, blockchain: IBlockchain<string>) : any;
    consensus(nodes : INetworkNode[]) : any;
    connect(url? : any, callback? : Function ) : any;
}

export class MQTTNetworker implements INetworker{

    node : MQTTNode;
    networkNodes : MQTTNode[];
    client : MqttClient;
    blockchain: IBlockchain<string>; 

    constructor(nodeId : string, blockchain: IBlockchain<string>){
        
        this.node = new MQTTNode(nodeId,`/${nodeId}`);
        this.blockchain = blockchain;
    }
    
    async mine(data : any, blockchain : IBlockchain<string>){
        
        let block = blockchain.addBlock(blockchain.createBlock(data));
        this.client.publish(MQTTNetworkTopicsEnum.ADD, JSON.stringify({block}));
    }
    
    consensus(nodes : MQTTNode[]){
        this.client.publish(MQTTNetworkTopicsEnum.CONSENSUS,JSON.stringify({id : this.node.id}));
    }
    
    _evaluate(incomingBlock : IBlock){
        if(incomingBlock.previous == this.blockchain.lastBlock().hash)
            return true;
        return false;  
    }
    
    
    connect(brokerUrl?: any, callback?: Function){
        this.client = mqtt.connect(brokerUrl);
        
        this.client.on('connect',() =>{
            this.client.subscribe(this.node.topic);
            this.client.subscribe(MQTTNetworkTopicsEnum.ADD);
            this.client.subscribe(MQTTNetworkTopicsEnum.CONSENSUS);
            this.client.subscribe(MQTTNetworkTopicsEnum.NEW_NODE);
            this.client.publish(MQTTNetworkTopicsEnum.NEW_NODE,this.node.id);

            if(callback)
                callback();
        });

        this.client.on('message', (topic, message) =>{
            if(topic == MQTTNetworkTopicsEnum.ADD){
                let incomingBlock : {block : IBlock} = JSON.parse(message.toString());
                if(this._evaluate(incomingBlock.block))
                    this.blockchain.addBlock(incomingBlock.block,true);
            }
            if(topic == MQTTNetworkTopicsEnum.CONSENSUS){
                //Answer consensus request:
                    // 1. Parse requester Id
                let concent : {id : string} = JSON.parse(message.toString());
                if(concent.id != this.node.id)
                    // 2. Send your Blockchain
                    this.client.publish(`/${concent.id}`,JSON.stringify({blockchain : this.blockchain}));
            }
            if(topic == this.node.topic){
                //Compare incoming blockchain with your's blockchain
                let response : {blockchain : IBlockchain<string>} = JSON.parse(message.toString());
                    // if incoming is longest then replace
                    if(response.blockchain.chain.length > this.blockchain.chain.length 
                        && this.blockchain.validateChain(response.blockchain.chain))
                        this.blockchain = response.blockchain;
                    // else then remain with your's blockchain
            }
        });
    };
}