import { SolanaAgentKit } from "../../index";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createTransferInstruction,
  getMint,
} from "@solana/spl-token";
import { addTx } from "../../../db";

/**
 * Transfer SOL or SPL tokens to a recipient
 * @param agent SolanaAgentKit instance
 * @param to Recipient's public key
 * @param amount Amount to transfer
 * @param mint Optional mint address for SPL tokens
 * @returns Transaction signature
 */
export async function transfer(
  agent: SolanaAgentKit,
  to: PublicKey,
  amount: number,
  mint?: PublicKey,
): Promise<string> {
  try {
    if (!mint) {
      // Transfer native SOL
      const tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: agent.wallet_address,
          toPubkey: to,
          lamports: amount * LAMPORTS_PER_SOL,
        }),
      );

      tx.feePayer = new PublicKey(agent.wallet_address);
      const { blockhash, lastValidBlockHeight } = await agent.connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;

      // Send this incomplete transaction to the frontend
      const serializedTx = tx.serialize({
        requireAllSignatures: false, // Important for incomplete transactions
      });
      let serializedString = Buffer.from(serializedTx).toString("base64")
      const unique_id = new Date().getTime();
      const txSave = await addTx(blockhash, serializedString, lastValidBlockHeight.toString(), unique_id.toString())
      return unique_id.toString();

    } else {
      // Transfer SPL token
      const fromAta = await getAssociatedTokenAddress(
        mint,
        agent.wallet_address,
      );
      const toAta = await getAssociatedTokenAddress(mint, to);

      // Get mint info to determine decimals
      const mintInfo = await getMint(agent.connection, mint);
      const adjustedAmount = amount * Math.pow(10, mintInfo.decimals);

      const tx = new Transaction().add(
        createTransferInstruction(
          fromAta,
          toAta,
          agent.wallet_address,
          adjustedAmount,
        ),
      );
      tx.feePayer = new PublicKey(agent.wallet_address);
      const { blockhash, lastValidBlockHeight } = await agent.connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;
      // Send this incomplete transaction to the frontend
      const serializedTx = tx.serialize({
        requireAllSignatures: false, // Important for incomplete transactions
      });
      let serializedString = Buffer.from(serializedTx).toString("base64")
      const unique_id = new Date().getTime();
      const txSave = await addTx(blockhash, serializedString, lastValidBlockHeight.toString(), unique_id.toString())
      return unique_id.toString();
    }
  } catch (error: any) {
    throw new Error(`Transfer failed: ${error.message}`);
  }
}
