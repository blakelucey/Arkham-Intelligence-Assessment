import axios from "axios";
import type { NextApiRequest, NextApiResponse } from 'next'

const ETHEREUM_NODE_URL =
  "https://eth-mainnet.alchemyapi.io/v2/GNauZOAEhjOc34zQQqQuXorOlmC6wJ6W";
const ETHEREUM_BLOCK_INTERVAL = 1;

/**
 * fetchEthereumTransactions fetches the latest block data from the Ethereum blockchain using AlchemyAPI's node endpoint.
 * It then extracts the transaction data from the block and computes the transaction values in both Ether and USD.
 *
 * @returns An array of objects containing the transaction details: hash, from address, to address, value in Ether, and value in USD.
 */

const fetchEthereumTransactions = async () => {
  try {
    const response = await axios.post(ETHEREUM_NODE_URL, {
      jsonrpc: "2.0",
      id: 1,
      method: "eth_getBlockByNumber",
      params: ["latest", true],
    });

    const transactions = response.data.result.transactions;

    const prices = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
    );

    return transactions.map((transaction: any) => ({
      hash: transaction.hash,
      from: transaction.from,
      to: transaction.to,
      valueEth: (parseInt(transaction.value, 16) / 1e18).toFixed(4),
      valueUsd: (
        (parseInt(transaction.value, 16) / 1e18) *
        prices.data.ethereum.usd
      ).toFixed(2),
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
};

/**
 * handler function is the entry point for the backend application. 
 * It calls fetchEthereumTransactions to fetch the latest Ethereum transaction data and sends it in the response.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns The Ethereum transaction data in the response.
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const transactions = await fetchEthereumTransactions();
  res.json(transactions);
}
