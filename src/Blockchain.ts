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

    constructor(value?: any | any[], collectionTime?: number, difficulty? : number) {
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

        this.genesis.data.value = value || null;
        this.genesis.data.timestamp = collectionTime || 0;
        this.chain.push(this.genesis);
        
        this.difficulty = difficulty || 0;
    }

    createBlock(data : {value : any | any[] , collectionTime : number}): DataBlock < string > {
        let block = new DataBlock < string > ();
        block.blockIndex = this.chain.length.toString();
        block.previous = this.lastBlock().hash;

        block.data.value = data.value;
        block.data.timestamp = data.collectionTime;
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


    proofOfWork(block: DataBlock < string > , difficulty: number): DataBlock<string> {
        let check = false;
        let nonce = 0;
        let hash;
        let time;
        while (!check) {
            time = Date.now();
            nonce++;
            hash = this.hash(
                block.blockIndex +
                block.previous +
                JSON.stringify(block.data) +
                time +
                nonce
            );
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
    validateChain(chain: DataBlock < string > []): boolean{
        return false;
    }
}