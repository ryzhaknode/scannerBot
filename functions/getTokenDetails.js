async function getTokenDetails(transactionHash) {
    try {
        const tx = await alchemy.core.getTransaction(transactionHash);
        const contractAddress = tx.to;
        const transactionInput = tx.data
        console.log(tx)

        if (!tx || !contractAddress) return null; // No transaction or 'to' address

        // Fetch token details
        const tokenDetails = await alchemy.core.getTokenMetadata(contractAddress);

        console.log(tokenDetails)

        if (!tokenDetails) return null; // Not a token transaction

        const numDecimals = tokenDetails.decimals;

        // Decode input data for ERC-20 transfer (0xa9059cbb)
        if (transactionInput && transactionInput.startsWith('0xa9059cbb')) {
            const [recipient, amount] = alchemy.core.decodeParameters(['address', 'uint256'], transactionInput.slice(10));
            const value = amount / Math.pow(10, tokenDetails.decimals);

            return {
                token: tokenDetails.symbol,
                value: value
            };
        }
        return null;
    } catch (error) {
        console.error(error);
        return null;
    }
}