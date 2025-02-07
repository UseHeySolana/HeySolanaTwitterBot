import { PublicKey } from "@solana/web3.js";

export interface JupiterTokenData {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  tags: string[];
  logoURI: string;
  daily_volume: number;
  freeze_authority: string | null;
  mint_authority: string | null;
  permanent_delegate: string | null;
  extensions: {
    coingeckoId?: string;
  };
}

export async function getTokenDataByAddress(
  mint: PublicKey,
): Promise<JupiterTokenData | undefined> {
  try {
    if (!mint) {
      throw new Error("Mint address is required");
    }

    const response = await fetch(`https://tokens.jup.ag/token/${mint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const token = (await response.json()) as JupiterTokenData;
    return token;
  } catch (error: any) {
    throw new Error(`Error fetching token data: ${error.message}`);
  }
}

export async function getTokenAddressFromTicker(
  ticker: string,
): Promise<string | null> {
  try {
    const response = await fetch(
      `https://api.dexscreener.com/latest/dex/search?q=${ticker}`,
    );
    const data = await response.json();

    if (!data.pairs || data.pairs.length === 0) {
      return null;
    }
    const solanaTickers = data.pairs
      .filter((pairs: any) => pairs.chainId === 'solana' && pairs.baseToken.symbol.toLowerCase() === ticker.toLowerCase())
    // .sort((a: any, b: any) => b.fdv - a.fdv); // Sorting by token symbol

    // const solanaTickers = data.pairs.filter((pairs: any) => {
    //   if (pairs.chainId === 'solana' && pairs.baseToken.symbol.toLowerCase() === ticker.toLowerCase()) return pairs
    // }).sort((a: any, b: any) => (b.fdv || 0) - (a.fdv || 0));

    // let checkToken = solanaTickers.filter(
    //   (pair: any) =>
    //     pair.baseToken.symbol.toLowerCase() === ticker.toLowerCase(),
    // );

    // Return the address of the highest FDV Solana pair
    return solanaTickers[0].baseToken.address;
  } catch (error) {
    console.error("Error fetching token address from DexScreener:", error);
    return null;
  }
}

export async function getTokenDataByTicker(
  ticker: string,
): Promise<JupiterTokenData | undefined> {
  const address = await getTokenAddressFromTicker(ticker);
  if (!address) {
    throw new Error(`Token address not found for ticker: ${ticker}`);
  }
  return getTokenDataByAddress(new PublicKey(address));
}
