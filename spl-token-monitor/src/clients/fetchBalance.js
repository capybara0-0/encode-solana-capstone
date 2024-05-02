import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { connection } from "./connection.js";

export async function fetchBalance(publickey) {
  const lamports = await connection.getBalance(new PublicKey(publickey));
  const sol = lamports / LAMPORTS_PER_SOL;

  return sol;
}
