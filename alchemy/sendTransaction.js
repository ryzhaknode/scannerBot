import {Network, Alchemy, Wallet, Utils} from "alchemy-sdk";

import {config} from "dotenv";

config()

const {ETHSEPOLINA_ALCHEMY_API, PRIVATE_KEY} = process.env;

const settings = {
    apiKey: ETHSEPOLINA_ALCHEMY_API,
    network: Network.ETH_SEPOLIA,
};

console.log(ETHSEPOLINA_ALCHEMY_API)

const alchemy = new Alchemy(settings)
const wallet = new Wallet(PRIVATE_KEY)

async function sendTransaction (transaction) {
    try {
        const rawTransaction = await wallet.signTransaction(transaction);
        alchemy.transact.sendTransaction(rawTransaction).then(console.log);
    }
    catch (e){
        console.log(e)
    }
}

// for transfer erc20
// const erc20Abi = [...] // Вставте ABI сюди
// const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, wallet);
// const amountToSend = ethers.utils.parseUnits("кількість_токенів", "decimals");
// const transferData = tokenContract.interface.encodeFunctionData("transfer", [receiverAddress, amountToSend]);

const hexString = '0x071afd498d0000';
const bigNumber = new BigNumber(hexString, 16); // Вказуємо 16 для шістнадцяткового представлення

console.log(bigNumber.toString());

const transaction = {
    to: "0x0ce87fd957d295e77355a3A77CfE677dbe3c896d",
    value: Utils.parseEther("0.002"),

    // data: transferData, // for transfer erc20
    gasLimit: "21000",
    maxPriorityFeePerGas: Utils.parseUnits("5", "gwei"),
    maxFeePerGas: Utils.parseUnits("20", "gwei"),
    nonce: await alchemy.core.getTransactionCount(wallet.getAddress()),
    type: 2,
    chainId: 11155111, // Corresponds to ETH_SEPOLINA
};

const rawTransaction = await wallet.signTransaction(transaction);


sendTransaction(transaction)



