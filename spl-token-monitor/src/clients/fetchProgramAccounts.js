import { PublicKey } from "@solana/web3.js";
import { MINT_ADDRESS } from "../constants/constatnt.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { connection } from "./connection.js";

/**
 * Retrieves the public key addresses of all token accounts owned by a specified address and associated with a predefined mint.
 *
 * Utilizing Solana's Web3.js API, this function queries for all token accounts owned by the provided public key address (`ownerAddress`).
 * It filters these accounts to include only those associated with a specific mint address (`MINT_ADDRESS`).
 *If no matching token accounts are found, an empty array is returned.

 * @param {string} ownerAddress - The public key address of the owner whose token accounts are being searched.
 * @returns {Promise<string[]>} A promise that resolves to an array of strings, each representing the public key address of a token account owned by the input address and associated with the predefined mint.
 *         If no such accounts exist, the promise resolves to an empty array.
 * @throws {Error} If the function encounters an error during execution, it throws a new error with a message detailing the nature of the error.
 */

export async function findTokenAccounts(ownerAddress) {
  try {
    const ownerPublicKey = new PublicKey(ownerAddress);
    const accounts = await connection.getParsedTokenAccountsByOwner(
      ownerPublicKey,
      { programId: TOKEN_PROGRAM_ID },
    );

    return (
      accounts.value
        .filter(
          (account) => account.account.data.parsed.info.mint === MINT_ADDRESS,
        )
        .map((account) => account.pubkey.toString())
        .reduce((acc, address) => {
          acc.push(address);
          // console.log(acc);
          return acc;
        }, []) || []
    );
  } catch (error) {
    console.error("An error occurred:", error);
    throw new Error(
      "An error occurred while finding token accounts: " + error.message,
    );
  }
}
