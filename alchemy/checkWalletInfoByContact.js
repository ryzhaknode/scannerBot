import {config} from "dotenv";
import {Alchemy, Network, Utils} from "alchemy-sdk";
config()
const {ETH_ALCHEMY_API} = process.env;

const settings = {
    apiKey: ETH_ALCHEMY_API,
    network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);
const main = async () => {
    // Wallet address whose balance you want to query
    const walletAddress = "0xDD6494fBe3d1773A4A746d7fcCd0a197261a8eFF";

    // USDT contract address
    const contractAddress = "0xcb84d72e61e383767c4dfeb2d8ff7f4fb89abc6e";
    const numDecimals = 18;
    // You can find out how many decimal places any currency has by reading the decimals value from the contract's page on Etherscan.

    // ABI -- defining the functions in the ABI that we want to call using the eth_call method.
    let abi = ["function balanceOf(address account)", "function symbol()"];

    // Create function call data for getting the symbol and balance -- eth_call
    let iface = new Utils.Interface(abi);
    let symbolData = iface.encodeFunctionData("symbol");
    let balanceData = iface.encodeFunctionData("balanceOf", [walletAddress]);

    // Get symbol of the token in hex format -- usage of eth_call
    let symbolInHex = await alchemy.core.call({
        to: contractAddress,
        data: symbolData,
    });

    // Get balance for the wallet address in hex format -- usage of eth_call
    let balanceInHex = await alchemy.core.call({
        to: contractAddress,
        data: balanceData,

    });

    const balance = (parseInt(balanceInHex) / 10 ** numDecimals).toFixed(2);
    console.log("Decoded Balance:", balance, "VEGA");
    console.log("Symbol:", symbolInHex);
};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();