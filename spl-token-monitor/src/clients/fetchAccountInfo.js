import { AccountLayout, AccountState } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import chalk from "chalk";
import { connection } from "./connection.js";

const WARNING_MESSAGE = "[Warning] Token account not found or doesn't exist.";
const ERROR_MESSAGE_PREFIX = "[Error: fetchAccountState]";

/**
 * Fetches and decodes the state of a Solana token account.
 * @param {string} tokenAccountPubKey - Public key of the token account as a string.
 * @returns {Promise<boolean|null>} Returns whether the account is frozen, or null if not found.
 */
export async function fetchAccountState(tokenAccountPubKey) {
  const tokenAccountPubKeyObj = new PublicKey(tokenAccountPubKey);

  try {
    const tokenAccountInfo = await connection.getAccountInfo(
      tokenAccountPubKeyObj,
    );
    if (!tokenAccountInfo) {
      console.log(chalk.yellow(WARNING_MESSAGE));
      return null;
    }

    const accountData = AccountLayout.decode(tokenAccountInfo.data);
    const isFrozen = accountData.state === AccountState.Frozen;
    console.log(`Account ${tokenAccountPubKey} isFrozen state: ${isFrozen}`);
    return isFrozen;
  } catch (error) {
    console.error(
      chalk.red(
        `${ERROR_MESSAGE_PREFIX} fetching or decoding account information: ${error}`,
      ),
    );
    throw error;
  }
}
