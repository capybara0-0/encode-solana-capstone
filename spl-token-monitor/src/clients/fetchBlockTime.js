import { connection } from "./connection.js";

async function fetchBlockTime(slot) {
  const blockTime = await connection.getBlockTime(slot);
  const parsedBlockTime = new Date(blockTime * 1000).toISOString();

  if (parsedBlockTime) {
    console.log(`[blockTime] `, parsedBlockTime);
  } else {
    console.log(`Unable to fetch block time`);
  }
  return parsedBlockTime;
}
