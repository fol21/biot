import { IBlock } from ".";
import { IBlockchain } from "./Blockchain";
import * as mqtt from 'mqtt';
import { MqttClient } from "mqtt";

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
    getNodes() : INetworkNode[];
    connect(url : string | undefined) : any;
}

export class MQTTNetworker implements INetworker{

    node : MQTTNode;
    networkNodes : MQTTNode[];
    client : MqttClient;
    blockchain: IBlockchain<string>; 

    constructor(nodeId : string, brokerUrl : string){
        
        this.node = new MQTTNode(nodeId,`/${nodeId}`);
        this.connect(brokerUrl);
    }
    
    mine(data : any, blockchain : IBlockchain<string>){
        return blockchain.addBlock(blockchain.createBlock(data));
    }
    
    consensus(nodes : MQTTNode[]){

    }
    
    getNodes() : MQTTNode[]
    {
        return null;
    }

    _evaluate(incomingBlock : IBlock){
        if(incomingBlock.previous == this.blockchain.lastBlock().hash)
            return true;
        return false;  
    }
    
    connect(brokerUrl: string){
        this.client = mqtt.connect(brokerUrl);
        this.client.on('connect',() =>{
            this.client.subscribe(this.node.topic);
            this.client.subscribe('/add');
            this.client.subscribe('/consensus');
            this.client.publish('/new-node',this.node.id);
        });
        this.client.on('message', (topic, message) =>{
            let incomingBlock : IBlock = JSON.parse(message.toString());
            if(topic == '/add'){
                if(this._evaluate(incomingBlock))
                    this.blockchain.addBlock(incomingBlock,false);
            }
            if(topic == '/consensus'){
                //Answer consensus request:
                    // 1. Parse requester Id
                    // 2. Send your Blockchain
                
            }
            if(topic = this.node.topic){
                //Compare incoming blockchain with your's blockchain
                    // if incoming is longest then replace
                    // else then remain with your's blockchain
            }
        });
    };
}