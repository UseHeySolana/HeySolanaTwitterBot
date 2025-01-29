import { fetchUser } from "../db";
import { convertSpeech } from "../requests/gemini";
import { getTokens, transferSol } from "./transfers";

const aiTransfer = async (object: any, user: any) => {
  const details = object.details;
  const reciever = await fetchUser(details.reciever);

  if (!user) {
    return "Sorry this Sender is not registered with the HeySolana app";
  }

  if (!reciever) {
    return "Sorry this Receiver is not registered with the HeySolana app";
  }
  const userTokens = await getTokens(user.wallet_address);

  if (details.token.toLowerCase() == "sol") {
    //check if the balance is sufficient
    if (Number(userTokens.solBalance?.toFixed(2)) < Number(details.amount)) {
      return "You do not have sufficient SOL to perform this transaction!";
    }

    const transfer = await transferSol(
      user.wallet_address,
      reciever.wallet_address,
      details.amount
    );

    return `https://www.twitbot.useheysolana.com/?tx=${transfer}`;
    // const transferRes = await convertSpeech(
    //   `You have transferred ${details.amount} SOL to ${details.reciever} Successfully`
    // );
    // return transferRes;
  } else {
    const tokens = userTokens.tokenAccounts.filter(
      (item: any) => item?.symbol?.toLowerCase() === details.token.toLowerCase()
    );
    if (tokens.length < 1) {
      const response = await convertSpeech(
        `You do not have ${details.token} in your account!`
      );
      return response;
    } else {
      const balance = tokens[0].balance;
      if (Number(balance?.toFixed(2)) < Number(details.amount)) {
        const response = await convertSpeech(
          `You do not have sufficient ${tokens[0].name} to perform this transaction!`
        );
        return response;
      }
      //   const transfer = await transferToken(
      //     filtered[0].wallet_address,
      //     tokens[0].mint,
      //     details.amount,
      //     tokens[0].decimals,
      //     connection
      //   );

      const transfer = false;
      if (transfer) {
        const transferRes = await convertSpeech(
          `You have transferred ${details.amount} ${tokens[0].name} to ${details.recipient} Successfully`
        );
        return transferRes;
      } else {
        const transferRes = await convertSpeech(
          `Sorry, I couldn't perform the transfer as ${details.token} is not supported yet . Please try again.`
        );
        return transferRes;
      }
    }
  }
};

export { aiTransfer };
