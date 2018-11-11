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

    connect(brokerUrl: string){
        this.client = mqtt.connect(brokerUrl);
        this.client.on('connect',() =>{
            this.client.subscribe('consensus');
            this.client.publish('new_node',this.node.id);
        });
    };
}