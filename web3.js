import { Web3, HttpProvider } from 'web3';
import {config} from "dotenv";

config()

// const web3 = new Web3(`https://mainnet.infura.io/v3/${process.env.INFURA_ID}`)
// web3.eth.getBlock('latest').then(console.log);

const web3 = new Web3( new Web3.providers.WebsocketProvider('wss://eth-mainnet.g.alchemy.com/v2/onoHh5jlscK4tHc0eKqRfiv1jm-Ja2PZ'));

// web3.setProvider(new Web3.providers.WebsocketProvider('ws://mainnet.infura.io/v3/334a260c8bae4aa58f4d351fb39da106'));


// Параметри транзакції
const from = '0x2b73A1aD822b7F0f88137015De7C541f75363970';
const to = '0x0ce87fd957d295e77355a3A77CfE677dbe3c896d';
// const value = web3.utils.toWei('0.05', 'ether');
const privateKey = '849839352bcb5074720baffab5af42e297c0bb173b8aace35f1884fc8273732f';
// const gasPrice = await web3.eth.getGasPrice();
// const gasEstimate = await web3.eth.estimateGas({
//     from,
//     to,
//     value
// });


web3.eth.subscribe('newBlockHeaders', (error, blockHeader) => {
    if (error) console.log('Error:', error);
    else console.log('Block Header:', blockHeader);
});

web3.currentProvider.on('connect', () => console.log('WebSocket Connected'));
web3.currentProvider.on('end', e => console.log('WebSocket Disconnected', e));
web3.currentProvider.on('error', e => console.log('WebSocket Error', e));

// async function sendTransaction (){
//     try {
//         const gasPrice = await web3.eth.getGasPrice();
//         const gasEstimate = await web3.eth.estimateGas({
//             from,
//             to,
//             value
//         });
//
//
//         const signedTx = await web3.eth.accounts.signTransaction({
//             from,
//             to,
//             value,
//             gas: gasEstimate,
//             gasPrice
//         }, privateKey);
//
//         const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
//         console.log('Transaction receipt:', receipt);
//     } catch (error) {
//         console.error('Error sending transaction:', error);
//     }
// };