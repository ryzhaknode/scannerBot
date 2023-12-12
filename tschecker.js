import {Web3} from 'web3';
import {config} from "dotenv";


config()

class TransactionChecker {
    web3;
    web3ws;
    account;

    // subscription;

    constructor(account) {
        this.web3ws = new Web3(new Web3.providers.WebsocketProvider('wss://eth-sepolia.g.alchemy.com/v2/S968LlX-9y9cl_eW8NBRjhVukN-AxqkR'));
        this.web3 = new Web3(new Web3.providers.HttpProvider('https://eth-sepolia.g.alchemy.com/v2/S968LlX-9y9cl_eW8NBRjhVukN-AxqkR'));
        this.account = account.toLowerCase();
    }

    subscribe(topic) {
        // this.subscription =
        this.web3ws.eth.subscribe(topic, (err, res) => {
            if (err) console.error(err);
        });
    }

    watchTransactions() {
        console.log('Watching all pending transactions...')
        this.web3ws.currentProvider.on('connect', () => console.log('WebSocket Connected'));
        this.web3ws.currentProvider.on('data', (txHash) => {
            console.log(txHash)
            setTimeout(async () => {
                try {
                    let tx = await this.web3.eth.getTransaction(txHash);

                    if (this.account == tx.to.toLowerCase()) {
                        console.log({
                            address: tx.from,
                            value: this.web3.utils.fromWei(tx.value, 'ether'),
                            gasPrice: tx.gasPrice,
                            gas: tx.gas,
                            input: tx.input,
                            timestamp: new Date()
                        });
                    }

                } catch (err) {
                    //console.error(err);
                    //console.log('Watching all pending transactions...');
                }
            }, 2)
        });
        this.web3ws.currentProvider.on('error', e => console.log('WebSocket Error', e));
    }
}

let txChecker = new TransactionChecker('0x2b73A1aD822b7F0f88137015De7C541f75363970');
txChecker.subscribe('pendingTransactions');
txChecker.watchTransactions();