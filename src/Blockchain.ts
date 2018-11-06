import {
    IBlock,
    DataBlock
} from "./Block";
import {
    createHash
} from 'crypto';

export interface IBlockchain < T > {
    genesis: IBlock;
    chain: IBlock[];

    createBlock(data : any): IBlock;
    addBlock(block: IBlock): IBlock[];
    lastBlock(): IBlock;
    hash(blockData: string): T;
    proofOfWork(block: IBlock, difficulty: number): IBlock;
    validateChain(chain: DataBlock < string > []): boolean;
}

export class DataBlockchain implements IBlockchain < string > {
    
    genesis: DataBlock < string > ;
    chain: DataBlock < string > [];
    difficulty : number = 0;

    constructor(difficulty? : number, value?: any | any[], collectionTime?: number) {
        this.genesis = new DataBlock < string > ({
            blockIndex: "1",
            nonce: 1,
            timestamp: Date.now(),
            previous: "0",
            hash: "0"
        });
        this.genesis.hash = this.hash(
            this.genesis.blockIndex +
            this.genesis.nonce +
            this.genesis.previous
        );
        
        this.genesis.data = {value: value ||"", timestamp: collectionTime  || 0};
        this.chain = new Array<DataBlock<string>>();
        this.chain.push(this.genesis);
        
        this.difficulty = difficulty || 0;
    }

    createBlock(data : {value : any | any[] , collectionTime : number}): DataBlock < string > {
        let block = new DataBlock < string > ();
        block.blockIndex = this.chain.length.toString();
        block.previous = this.lastBlock().hash;

        block.data = {value: data.value ||"", timestamp: data.collectionTime  || 0};

        return block;
    }

    addBlock(block: DataBlock < string > ) {
        block = this.proofOfWork(block,this.difficulty);
        this.chain.push(block);
        return this.chain;
    }

    lastBlock(): DataBlock < string > {
        return this.chain[this.chain.length - 1]
    }

    hash(blockData: string): string {
        let hash = createHash('sha256');
        return hash.update(blockData).digest('hex');
    }

    _calculateBlockHash(index : string, previous : string, data: any, timestamp : number, nonce: number ){
        return this.hash(index + previous + JSON.stringify(data) + timestamp + nonce)
    }

    proofOfWork(block: DataBlock < string > , difficulty: number): DataBlock<string> {
        let check = false;
        let nonce = 0;
        let hash;
        let time;
        while (!check) {
            time = Date.now();
            nonce++;
            hash = this._calculateBlockHash(block.blockIndex, block.previous, block.data, time, nonce);
            try {
                for (var i = 0, b = hash.length; i < b; i++) {
                    if (hash[i] !== '0') {
                        break;
                    }
                }
                check = i >= difficulty;
            } catch (error) {
                throw error;
            }
        }

        block.nonce = nonce;
        block.timestamp = time;
        block.hash = hash;
        return block;
    }
    validateChain(chain: DataBlock < string > []): boolean
    {
        let previousBlock = this.genesis;
        let currentBlock = null;
        for (let index = 1; index < this.chain.length; index++) {
            currentBlock = this.chain[index];
            // Check if every block link match
            if(previousBlock.hash != currentBlock.previous)
                return false;
            // Check if every block hash match
            let checkerHash = this._calculateBlockHash(currentBlock.blockIndex, currentBlock.previous, currentBlock.data,
                currentBlock.timestamp, currentBlock.nonce)
            if(currentBlock.hash != checkerHash)
                return false;
            previousBlock = currentBlock;
        }
        return true;
    }
}