import {BigNumber, Utils} from "alchemy-sdk";

function convertDataToCount(data){
    const amountTransferred = BigNumber.from(data);

    console.log(amountTransferred)

    const daiTransferred = Utils.formatUnits(amountTransferred, 18);

    return daiTransferred
}