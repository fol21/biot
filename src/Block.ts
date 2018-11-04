export interface IBlock{
    blockIndex : string;
    nonce: number;
    timestamp: number;
    previous: string;
    hash: string;
}

export class DataBlock<T> implements IBlock
{
    blockIndex : string;
    nonce: number;
    timestamp: number;
    previous: string;
    hash: string;

    data: {
        timestamp: number;
        value : T | T[];
    }

    constructor(block? : IBlock){
        if(block){
            this.blockIndex = block.blockIndex;
            this.nonce = block.nonce;
            this.timestamp = block.timestamp;
            this.previous = block.previous;
            this.hash = block.hash;
        }
    }
}