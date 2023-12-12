import {config} from "dotenv";
import {Alchemy, Network} from "alchemy-sdk";

config()

const {ETH_ALCHEMY_API} = process.env;

const settings = {
    apiKey: ETH_ALCHEMY_API,
    network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);
let decimalNumber = 100000;
let hexadecimalNumber = '0x' + decimalNumber.toString(16);

try {
    const getTransfers = await  alchemy.core.getAssetTransfers({
        fromBlock: hexadecimalNumber,
        toBlock: 'latest',
        // fromAddress: '0xFB75781F96B2B589a1d40C659c3b3C522b5D4876',
        contractAddresses: ["0xcB84d72e61e383767C4DFEb2d8ff7f4FB89abc6e"],
        excludeZeroValue: true,
        category: ["erc20"],
        // maxCount: 1100
    })

    console.log(getTransfers)

    const transactionMoreThanOneEthereum =  getTransfers.transfers.filter(item => {
        return item.asset > 1 ? item : null
    });

    console.log(getTransfers.transfers.length)

    const mySet = new Set()


    getTransfers.transfers.forEach(item => {
        if (item.value > 1000) mySet.add(item.value)
    })

    console.log(mySet)



} catch (err) {
    console.log(err)
}

const transaction = {
    blockNum: '0x11dfbda',
    uniqueId: '0x035c41303ead1b9e7be750e1dcec4c3e04d046336df5735ae9d265902c31c9eb:external',
    hash: '0x035c41303ead1b9e7be750e1dcec4c3e04d046336df5735ae9d265902c31c9eb',
    from: '0x296a891d6f5e59407d006c9e403a0ab2f0842d96',
    to: '0x9c0a9886901e84af421b14d95fecf25d1836689a',
    value: 0.328368813385242,
    erc721TokenId: null,
    erc1155Metadata: null,
    tokenId: null,
    asset: 'ETH',
    category: 'external',
    rawContract: [Object]
};

