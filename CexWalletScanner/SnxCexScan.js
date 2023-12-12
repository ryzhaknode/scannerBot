import {config} from "dotenv";
import {Alchemy, AlchemySubscription, BigNumber, Network, Utils} from "alchemy-sdk";
import {ethers, utils} from "ethers";
import TelegramBot from 'node-telegram-bot-api'

config()
const {ETH_ALCHEMY_API, YOUR_TELEGRAM_BOT_TOKEN} = process.env;

const token = YOUR_TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, {polling: true});
const channelId = '@ryzhaknode';


const settings = {
    apiKey: ETH_ALCHEMY_API,
    network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);


const krakenWallet = '0x0D0452f487D1EDc869d1488ae984590ca2900D2F'
const okexWallet = '0x6cC5F688a315f3dC28A7781717a9A798a59fDA7b'
const binanceWallet = '0x28C6c06298d514Db089934071355E5743bf21d60'

function snxScan(adress, name) {
    alchemy.ws.on({
        method: AlchemySubscription.MINED_TRANSACTIONS,
        addresses: [
            {
                from: adress,
            },
            {
                to: adress,
            },
        ],
        includeRemoved: true,
        hashesOnly: true,
    }, async (tx) => {
        const {hash} = tx.transaction
        console.log(hash)
        if (await isSnxToken(hash)) {
            const transactionInformation = await decodeERC20TransferInput(hash)


            if (transactionInformation) {
                const message = `
                ${transactionInformation.toAddress === adress ? `🔴Deposit in ${name}` : `🟢Withdraw from ${name}`} ${transactionInformation.amount} ${transactionInformation.tokenDetails.symbol}`;
                bot.sendMessage(channelId, message)
                    .then(response => {
                        console.log('Message sent');
                    })
                    .catch(err => {
                        console.error(err);
                    });
            }


        }
    });
}


snxScan("0x6cC5F688a315f3dC28A7781717a9A798a59fDA7b", 'Okex')
snxScan("0x28C6c06298d514Db089934071355E5743bf21d60", 'Binance')
snxScan("0x0D0452f487D1EDc869d1488ae984590ca2900D2F", 'Kraken')


async function decodeERC20TransferInput(transactionHash) {
    function decodeValue(bigNumber, decimals) {
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


async function isSnxToken(hash) {
    const tx = await alchemy.core.getTransaction(hash);
    const {to: contractAddress} = tx
    return contractAddress === '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f'
}




