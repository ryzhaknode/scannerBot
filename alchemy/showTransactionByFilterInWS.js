import {config} from "dotenv";
import {Alchemy, AlchemySubscription, BigNumber, Network, Utils} from "alchemy-sdk";
import {ethers, utils} from "ethers";
import TelegramBot from 'node-telegram-bot-api'

config()
const {ETH_ALCHEMY_API, YOUR_TELEGRAM_BOT_TOKEN, ETHSEPOLINA_ALCHEMY_API} = process.env;

const token = YOUR_TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, {polling: true});
const channelId = '@ryzhaknode';

function converIn16(number) {
    let decimalNumber = number;
    let hexadecimalNumber = '0x' + decimalNumber.toString(16);
    return hexadecimalNumber
}


function postToChannel(message) {
    bot.sendMessage(channelId, message).catch(console.error);
}


// postToChannel('Це повідомлення буде відправлене у канал при запуску скрипта');
const settings = {
    apiKey: ETH_ALCHEMY_API,
    network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

// показує транзакції з DAI
const filter = {
    // method: AlchemySubscription.MINED_TRANSACTIONS,
    address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    topics: [
        Utils.id("Transfer(address,address,uint256)")
    ]
}

function start() {
    alchemy.ws.on(filter, (log, event) => {
        const {data, address, transactionHash} = log
        alchemy.ws.on(
            transactionHash,
            (tx) => console.log(tx)
        );
        // console.log(log)
        // convertDataToCount(data)
    })
}


start()

function convertDataToCount(data){
    const amountTransferred = BigNumber.from(data);

    const daiTransferred = Utils.formatUnits(amountTransferred, 18);

    console.log(daiTransferred)
    // return daiTransferred
}
