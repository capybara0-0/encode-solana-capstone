import chalk from "chalk";
import { parseGetSingaturesForAddress } from "../utils/parseGetSignaturesForAddress.js";
import { connection } from "./connection.js";

/**
 * Fetches transaction signatures for a given account address.
 *
 * @param {string} account_address - The public key of the account for which to fetch signatures.
 * @param {number} limit - The maximum number of signatures to fetch.
 * @returns {Promise<Array>} A promise that resolves to an array of parsed signatures.
 * @throws {Error} If an error occurs while fetching the signatures.
 */

export async function fetchSignaturesForAddress(account_address, limit) {
  try {
    const options = {
      limit: limit,
    };

    const signatures = await connection.getSignaturesForAddress(
      account_address,
      options,
      "confirmed",
    );

    if (!signatures || signatures.length === 0) {
      console.log(
        chalk.yellow(`No signatures found for address: ${account_address}`),
      );
      return [];
    }

    const signature = parseGetSingaturesForAddress(signatures);

    return signature;
  } catch (error) {
    console.error(
      chalk.red(
        `Error occurred while fetching transaction signatures for address ${account_address}.`,
      ),
      chalk.yellow(`\n Limit set to: ${limit}.`),
      chalk.magenta(`\n Error message: ${error.message}`),
    );

    throw new Error(
      `Failed to fetch signatures for address ${account_address}: ${error.message}`,
    );
  }
}
