import chalk from "chalk";
import { EventEmitter } from "events";
import { PublicKey } from "@solana/web3.js";
import { RPC_URL, TOKEN_ACCOUNT_ADDRESS } from "../constants/constatnt.js";
import { connection } from "./connection.js";

/**
 * An EventEmitter instance used to emit account update events.
 * @type {EventEmitter}
 */
export const accountUpdateEmitter = new EventEmitter();

/**
 * The public key of the token account to subscribe to.
 * @type {PublicKey}
 */
let accountPublicKey = new PublicKey(TOKEN_ACCOUNT_ADDRESS);

/**
 * Subscribes to account changes for the specified token account.
 * Emits an "update" event on the accountUpdateEmitter when an account update is detected.
 * @async
 * @function
 * @throws {Error} If there's an error subscribing to the account.
 */
export async function SubscribeToAccount() {
  try {
    const subscriptionId = connection.onAccountChange(
      accountPublicKey,
      (accountInfo, context) => {
        accountUpdateEmitter.emit("update");
        console.log(
          chalk.green(
            `Account Update Detected. Context: ${JSON.stringify(context)}`,
          ),
        );
      },
      "confirmed",
    );
    console.log(chalk.green(`[Success] Connected to: `, RPC_URL));
    console.log(
      chalk.green(`[Success] Subscribed to: `, TOKEN_ACCOUNT_ADDRESS),
    );
  } catch (error) {
    console.error(chalk.red("[ERROR] SubscribeToAccount"), error.message);
  }
}
