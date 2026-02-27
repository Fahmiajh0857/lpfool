import { Connection, PublicKey } from "@solana/web3.js";
import DLMM from "@meteora-ag/dlmm";

export async function getPoolInfo(
  rpc: string,
  poolAddress: string
) {
  const connection = new Connection(rpc, "confirmed");

  const poolPubkey = new PublicKey(poolAddress);

  const dlmm = await DLMM.create(connection, poolPubkey);

  const pair = await dlmm.getPair();

  const tokenX = pair.tokenXMint.toBase58();
  const tokenY = pair.tokenYMint.toBase58();

  const feeBps = pair.feeBps;
  const binStep = pair.binStep;

  const price = await dlmm.getActivePrice();

  return {
    tokenX,
    tokenY,
    feeBps,
    binStep,
    price,
  };
}