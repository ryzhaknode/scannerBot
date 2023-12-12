import { Network, Alchemy } from 'alchemy-sdk';
import {config} from "dotenv";

config()

const settings = {
    apiKey: process.env.ETH_ALCHEMY,
    network: Network.ETH_MAINNET,
};


//conver in 16parse on number
const alchemy = new Alchemy(settings);
let decimalNumber = 18608120;
let hexadecimalNumber ='0x' +  decimalNumber.toString(16);


async function main() {
    try{
        const getTransfers = await alchemy.core.getAssetTransfers({
            fromBlock: '0x0',
            toBlock: 'latest',
            fromAddress: '0xFB75781F96B2B589a1d40C659c3b3C522b5D4876',
            // contractAddresses: ["0x6123B0049F904d730dB3C36a31167D9d4121fA6B"],
            excludeZeroValue: true,
            category: ["erc20", "erc721", "erc1155", "specialnft", "external"],

        });

        console.log(getTransfers);
        console.log('done')
    }
    catch(err){
        console.log(err)
    }
}

main();