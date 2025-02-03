import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createTransferInstruction,
  getAccount,
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";
import {
  API_KEY,
  fetchConversionRate,
  fetchTokenAccounts,
  getBalance,
  network,
} from "./helius";

const transferSol = async (
  fromAddres: string,
  toAddress: string,
  amount: number
) => {
  try {
    let connection = new Connection(`${network}${API_KEY}`);

    // Create the transaction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: new PublicKey(fromAddres),
        toPubkey: new PublicKey(toAddress),
        lamports: amount * 10 ** 9, // Convert SOL to lamports
      })
    );

    // Set the fee payer
    transaction.feePayer = new PublicKey(fromAddres);

    // Get a recent blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    // Serialize the transaction message (for sending to frontend)
    const serializedTransaction = transaction.serializeMessage();
    const serializedBase64 = Buffer.from(serializedTransaction).toString(
      "base64"
    );

    return serializedBase64;
  } catch (error) {
    console.error("Error transferring SOL:", error);
    throw error;
  }
};

// const transferToken = async (
//   toAddress: string,
//   tokenMintAddress: string,
//   amount: number,
//   decimals: number,
//   connection: Connection
// ) => {

//   try {
//     // Derive the sender's associated token account

//     const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
//       connection,
//       fromWallet,
//       new PublicKey(tokenMintAddress), // Token mint address
//       fromWallet.publicKey // Owner of the sender's token account
//     );

//     // Derive the recipient's associated token account
//     const toTokenAccount = await getOrCreateAssociatedTokenAccount(
//       connection,
//       fromWallet,
//       new PublicKey(tokenMintAddress),
//       new PublicKey(toAddress)
//     );

//     const tokenAmount = amount * Math.pow(10, decimals);
//     // Create the transfer instruction
//     const transferInstruction = createTransferInstruction(
//       fromTokenAccount.address, // Source token account
//       toTokenAccount.address, // Destination token account
//       fromWallet.publicKey, // Owner of the source token account
//       tokenAmount, // Amount to transfer (in smallest unit of the token)
//       [],
//       TOKEN_PROGRAM_ID
//     );

//     // Create and sign the transaction
//     const transaction = new Transaction().add(transferInstruction);
//     transaction.feePayer = fromWallet.publicKey;

//     // Get a recent blockhash
//     const { blockhash } = await connection.getLatestBlockhash();
//     transaction.recentBlockhash = blockhash;
//     transaction.feePayer = fromWallet.publicKey;
//     // Sign the transaction
//     transaction.sign(fromWallet);

//     // Send and confirm the transaction
//     try {
//       const signature = await sendAndConfirmTransaction(
//         connection,
//         transaction,
//         [fromWallet]
//       );
//       console.log(`Token transfer successful with signature: ${signature}`);
//       return signature;
//     } catch (e) {
//       console.log(e);
//     }
//   } catch (error) {
//     console.error("Error transferring token:", error);
//     throw error;
//   }
// };

const toPublickKey = (address: string) => {
  return new PublicKey(address);
};

const getTokens = async (address: string) => {
  const Solbalance = await getBalance(toPublickKey(address));
  const rate = await fetchConversionRate(
    "So11111111111111111111111111111111111111112"
  );
  const balance = Number(Solbalance) * rate;
  let usdBalance = balance;

  const tokens = await fetchTokenAccounts(toPublickKey(address));
  const fungible = tokens.result.items
    .filter((item: any) => item.interface === "FungibleToken")
    .map((token: any) => {
      const tokenInfo = token?.token_info;
      const content = token?.content?.metadata;
      usdBalance +=
        tokenInfo?.price_info?.total_price == undefined
          ? 0
          : tokenInfo?.price_info?.total_price;
      return {
        name: content?.name,
        image: token?.content?.links?.image,
        symbol: content?.symbol,
        balance: tokenInfo?.balance * Math.pow(10, -tokenInfo?.decimals),
        decimals: tokenInfo?.decimals,
        usdc_price: tokenInfo?.price_info?.total_price,
        mint: token?.id,
      };
    });

  return {
    balance: Number(balance.toFixed(2)),
    solBalance: Number(Solbalance?.toFixed(4)),
    tokenAccounts: tokens ? fungible : [],
    totalUsdBalance: usdBalance,
  };
};


export { transferSol, getTokens };
