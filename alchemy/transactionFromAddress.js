import {config} from "dotenv";
import {Alchemy, AlchemySubscription, BigNumber, Network, Utils} from "alchemy-sdk";
import {ethers, utils} from "ethers";
import TelegramBot from 'node-telegram-bot-api'

config()

const {ETH_ALCHEMY_API, YOUR_TELEGRAM_BOT_TOKEN, ETHSEPOLINA_ALCHEMY_API} = process.env;

const settings = {
    apiKey: ETH_ALCHEMY_API,
    network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);


alchemy.ws.on(  {
    method: AlchemySubscription.MINED_TRANSACTIONS,
    addresses: [
        {
            from: "0x6cC5F688a315f3dC28A7781717a9A798a59fDA7b",
        },
        {
            to: "0x6cC5F688a315f3dC28A7781717a9A798a59fDA7b",
        },
    ],
    includeRemoved: true,
    hashesOnly: false,
}, (tx) => console.log(tx));


function convertDataToCount(data){
    const amountTransferred = BigNumber.from(data);

    const daiTransferred = Utils.formatUnits(amountTransferred, 18);

    console.log(daiTransferred)
    // return daiTransferred
}

convertDataToCount('0x000000000000000000000000000000000000000000000005949291da6852c000')
