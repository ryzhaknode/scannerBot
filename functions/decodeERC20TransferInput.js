import {config} from "dotenv";
import {Alchemy,Network} from "alchemy-sdk";
import {ethers} from "ethers";
config()
const {ETH_ALCHEMY_API} = process.env;


const settings = {
    apiKey: ETH_ALCHEMY_API,
    network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);
async function decodeERC20TransferInput(transactionHash) {
    function decodeValue(bigNumber, decimals){
        const res = Number(bigNumber.toString()) / Math.pow(10, decimals)
        return res
    }

    const iface = new ethers.utils.Interface([
        "function transfer(address to, uint amount)"
    ]);

    try {
        const tx = await alchemy.core.getTransaction(transactionHash);
        const {
            to: contractAddress,
            data: transactionInput,
            gasPrice,
            from: fromAddress,
            blockNumber
        } = tx

        const tokenDetails = await alchemy.core.getTokenMetadata(contractAddress);
        const {decimals, logo, name, symbol} = tokenDetails


        const decoded = iface.parseTransaction({data: transactionInput});
        const {args, name: transactionName} = decoded
        const [toAddress, amountOfTransfer] = args;



        return {
            transactionName,
            fromAddress,
            toAddress,
            blockNumber,
            gasPrice: decodeValue(gasPrice, 9),
            tokenDetails,
            amount: decodeValue(amountOfTransfer, decimals)

        }

        return null;

    } catch (error) {
        console.error('Error decoding input:', error);
        return null;
    }
}