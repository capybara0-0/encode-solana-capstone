import { MINT_ADDRESS, OWNER_ADDRESS_OF_LP } from "../constants/constatnt.js";

/**
 * Extracts and returns an array of owner addresses from post-token balance objects
 * that meet specific criteria after transactions. It filters the post-token balances
 * based on a specific mint address, excludes a specific owner address, and includes
 * only those with a non-zero token amount.
 *
 * @param {Array} transactions - An array of transaction objects. Each transaction object should have
 *                               a `meta` field containing a `postTokenBalances` array. Each element
 *                               in the `postTokenBalances` array should be an object with `mint`,
 *                               `owner`, and `uiTokenAmount` properties.
 * @returns {Array}  An array of strings, where each string is an owner address
 */
export function parsePostTokenBalances(transactions) {
  return transactions.flatMap(({ meta: { postTokenBalances } }) =>
    postTokenBalances
      .filter((item) => item.mint === MINT_ADDRESS)
      .filter((item) => item.owner !== OWNER_ADDRESS_OF_LP)
      .filter((item) => item.uiTokenAmount.amount !== "0")
      .map((item) => item.owner),
  );
}
