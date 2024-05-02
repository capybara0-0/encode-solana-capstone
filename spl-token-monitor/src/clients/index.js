import chalk from "chalk";
import { PublicKey } from "@solana/web3.js";
import { fetchParsedTransactions } from "./fetchParsedTransactions.js";
import { fetchSignaturesForAddress } from "./fetchSignaturesForAddress.js";
import { SubscribeToAccount, accountUpdateEmitter } from "./webSocketClient.js";
import { checkAddresAgainstWhiteListedAddress } from "../models/whiteListChecker.js";
import {
  TOKEN_ACCOUNT_ADDRESS,
  REQUEST_INTERVAL_SECONDS,
} from "../constants/constatnt.js";

const accountPublicKey = new PublicKey(TOKEN_ACCOUNT_ADDRESS);
let updateCounter = 0;
let processingTimer = null;

export async function monitorAccountUpdates() {
  try {
    await SubscribeToAccount();
  } catch (error) {
    console.error(
      chalk.red(
        "[Error] Failed to subscribe to account updates. Monitoring will not proceed.",
      ),
    );
    return;
  }

  accountUpdateEmitter.on("update", () => handleAccountUpdate());
}

function handleAccountUpdate() {
  updateCounter++;
  console.log(
    chalk.blue(
      `[INFO] Account update detected. Current count: ${updateCounter}`,
    ),
  );
  if (updateCounter === 1) {
    scheduleProcessing();
  }
}

function scheduleProcessing() {
  clearTimeout(processingTimer);
  processingTimer = setTimeout(
    () => processUpdates(),
    REQUEST_INTERVAL_SECONDS * 1000,
  );
}

async function processUpdates() {
  try {
    const signatures = await fetchSignaturesForAddress(
      accountPublicKey,
      updateCounter,
    );
    if (signatures.length === 0) {
      console.log(
        chalk.yellow("[Warning] No signatures found for the account."),
      );
      return;
    }

    const transactions = await fetchParsedTransactions(signatures);
    await processTransactions(transactions);
  } catch (error) {
    console.error(
      chalk.red(`Error during account update processing: ${error.message}`),
    );
  } finally {
    resetProcessingState();
  }
}

async function processTransactions(transactions) {
  for (const transaction of transactions) {
    if (transaction && transaction.ownerAddress) {
      await checkAddresAgainstWhiteListedAddress(
        transaction.transactionDate,
        transaction.SOL,
        transaction.ownerAddress,
        transaction.ATA,
      );
    } else {
      console.log(
        chalk.yellow("[Warning] Invalid transaction object encountered."),
      );
    }
  }
  console.log(chalk.green("[Success] Transactions processed successfully."));
  console.log(chalk.magentaBright("=".repeat(100)));
}

function resetProcessingState() {
  updateCounter = 0;
  clearTimeout(processingTimer);
  processingTimer = null;
}
