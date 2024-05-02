import { parsePostTokenBalances } from "./parsePostTokenBalances.js";
import { findTokenAccounts } from "../clients/fetchProgramAccounts.js";

/**
 * Retrieves the Associated Token Account (ATA) for each unique owner address.
 * This function first extracts owner addresses from the provided transactions using `parsePostTokenBalances`.
 * It ensures that each owner address is unique by filtering out duplicates. Then, for each unique owner address,
 * it finds the associated token accounts (ATAs) by invoking `findTokenAccounts`.
 * owner has at least one ATA and returns the first ATA found for each owner. If no ATAs are found for an owner,
 * `null` is returned for that owner's ATA.
 *
 * @param {Array} transactions - The transactions to parse for owner addresses. These transactions are expected
 * to have a structure from which owner addresses can be extracted.
 *
 * @returns {Promise<Array>} A promise that resolves to an array of objects. Each object contains an `ownerAddress`
 * and the first `ATA` associated with that owner. If no ATAs are found for an owner, the `ATA` field will be `null`.
 */
export async function getOwnerAddressesWithATAs(transactions) {
  const ownerAddresses = parsePostTokenBalances(transactions);
  const uniqueOwnerAddresses = [...new Set(ownerAddresses)];

  const ownerATAPairs = await Promise.all(
    uniqueOwnerAddresses.map(async (ownerAddress) => {
      const ATAs = await findTokenAccounts(ownerAddress);

      const firstATA = ATAs.length > 0 ? ATAs[0] : null;
      return { ownerAddress, ATA: firstATA };
    }),
  );

  return ownerATAPairs;
}
