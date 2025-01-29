import { Connection, PublicKey } from "@solana/web3.js";
import { API_KEY } from "..";

// const network = "https://mainnet.helius-rpc.com/?api-key=";

const network = "https://devnet.helius-rpc.com/?api-key=";

const fetchConversionRate = async (fromCurrency: string) => {
  try {
    let data = await fetch(`https://api.jup.ag/price/v2?ids=${fromCurrency}`);
    let jsonData = await data.json();
    return jsonData.data[fromCurrency].price;
  } catch (error) {
    console.error("Error fetching conversion rate:", error);
    return null;
  }
};

const fetchTokenDetails = async (mintAddress: string) => {
  try {
    const data = await fetch(`${network}${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "test",
        method: "getAsset",
        params: {
          id: mintAddress,
        },
      }),
    });

    let jsonData = await data.json();
    return jsonData.data;
  } catch (error) {
    console.error("Error fetching token details:", error);
    return null;
  }
};
const fetchTokenAccounts = async (publickey: PublicKey) => {
  const response = await fetch(`${network}${API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "text",
      method: "getAssetsByOwner",
      params: {
        ownerAddress: publickey.toBase58(),
        displayOptions: {
          showFungible: true, //return both fungible and non-fungible tokens
        },
      },
    }),
  });
  const data = await response.json();
  return data;
};

const getBalance = async (publickey: PublicKey) => {
  let connection = new Connection(`${network}${API_KEY}`);

  const balance = (await connection.getBalance(publickey)) / 1e9;
  return balance;
};

export {
  network,
  API_KEY,
  fetchConversionRate,
  fetchTokenDetails,
  fetchTokenAccounts,
  getBalance,
};
