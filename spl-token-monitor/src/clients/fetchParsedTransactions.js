import chalk from "chalk";
import { connection } from "./connection.js";
import { getOwnerAddressesWithATAs } from "../utils/getOwnerAddressWithATAs.js";
import { parseGetParsedTransactions } from "../utils/parseGetParsedTransactions.js";

/**
 * Asynchronously fetches and parses transaction details based on the given transaction signatures.
 *
 * The function begins by checking if the `transactionSignature` argument is either undefined or an empty array.
 * If so, it logs a warning and returns an empty array. Otherwise, it proceeds to fetch transaction details
 * with a specified commitment level and a maximum supported transaction version. If no transactions are found
 * or if an error occurs during the fetching process, appropriate messages are logged, and the function either
 * returns an empty array or throws an Error, respectively.
 *
 * For each fetched transaction, the function further processes it to obtain owner addresses with associated
 * token accounts (ATAs) and parses the transaction details. It then combines these details into a single object
 * per transaction, forming an array of these combined objects which it returns.
 *
 * @param {Array<string>} transactionSignature - An array of transaction signatures used to fetch transaction details.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of objects, each combining parsed transaction
 * details and associated owner addresses with ATAs. Returns an empty array if no transactions are found or if the
 * input is invalid.
 *
 * @throws {Error} Throws an error if there's a failure in fetching or processing the transaction details.
 */
export async function fetchParsedTransactions(transactionSignature) {
  try {
    if (!transactionSignature || transactionSignature.length === 0) {
      console.log(
        chalk.bgYellow(
          "Warning: transactionSignature array is empty or undefined.",
        ),
      );
      return [];
    }

    const config = {
      commitment: "confirmed",
      maxSupportedTransactionVersion: 0,
    };

    const parsedTransaction = await connection.getParsedTransactions(
      transactionSignature,
      config,
    );

    if (!parsedTransaction || parsedTransaction.length === 0) {
      console.log(
        chalk.blue("Info: No transactions found with the given signatures."),
      );
      return [];
    } else {
      let parsedAddress = await getOwnerAddressesWithATAs(parsedTransaction);
      let filtered = parseGetParsedTransactions(parsedTransaction);

      let combined = parsedAddress.map((item, index) => ({
        ...item,
        ...filtered[index],
      }));

      return combined;
    }
  } catch (error) {
    console.error(
      chalk.red(
        "[Error: fetchParsedTransactions] fetching parsed transaction details:",
      ),
      error.message,
    );
    throw new Error("Failed to fetch parsed transaction details.");
  }
}
