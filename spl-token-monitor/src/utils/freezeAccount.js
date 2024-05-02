import chalk from "chalk";
import { exec } from "child_process";
import {
  MAX_PRIO_FEE_LAMPORTS,
  RETRY_DELAY,
  RETRY_LIMIT,
} from "../constants/constatnt.js";
import { storeFrozenAccount } from "../models/excelManager.js";

export async function freezeNonWhiteListedAccount(
  transactionDate,
  amountOfSOL,
  ownerAddress,
  ATAkey,
) {
  try {
    console.log(
      chalk.blue(`Attempting to freeze account:`),
      `${chalk.yellow(ATAkey.toString())}`,
    );

    const signature = await executeFreezeCommandWithRetry(
      MAX_PRIO_FEE_LAMPORTS,
      ATAkey.toString(),
      0,
    );

    if (signature !== "[ERROR] Invalid account state") {
      console.log(
        chalk.green(`[Success]`) +
          chalk.white(
            ` Wallet ${chalk.yellow(
              ATAkey.toString(),
            )} has been frozen successfully.\n ${chalk.cyan(
              `URL: https://solscan.io/tx/` + signature,
            )}`,
          ),
      );

      await storeFrozenAccount(
        transactionDate,
        amountOfSOL,
        ownerAddress,
        signature,
      );
    } else {
      console.log(
        chalk.yellow(
          `[WARNING]: Account ${ATAkey.toString()} is in an invalid state for freezing.`,
        ),
      );
    }
  } catch (error) {
    console.error(
      chalk.red(
        `[ERROR] Failed to freeze account ${chalk.cyan(
          ATAkey.toString(),
        )}. Error: ${error.message}`,
      ),
    );
  }
}

async function executeFreezeCommandWithRetry(
  maxPrioFeeLamports,
  account,
  attempt,
) {
  return new Promise((resolve, reject) => {
    executeFreezeCommand(maxPrioFeeLamports, account)
      .then(resolve)
      .catch((error) => {
        if (attempt < RETRY_LIMIT) {
          console.log(
            chalk.yellow(
              `Attempt ${attempt + 1} failed. Retrying in ${RETRY_DELAY}sec...`,
            ),
          );
          setTimeout(() => {
            executeFreezeCommandWithRetry(
              maxPrioFeeLamports,
              account,
              attempt + 1,
            )
              .then(resolve)
              .catch(reject);
          }, RETRY_DELAY * 1000);
        } else {
          reject(error);
        }
      });
  });
}

function executeFreezeCommand(maxPrioFeeLamports, account) {
  return new Promise((resolve, reject) => {
    const command = `spl-token-x --max-prio-fee-lamports ${maxPrioFeeLamports} freeze ${account}`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        if (
          error.message.includes("Error: Invalid account state for operation")
        ) {
          console.error(
            "Invalid account state error occurred, but continuing execution...",
          );
          resolve("[ERROR] Invalid account state");
        } else {
          reject(error);
        }
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        reject(new Error(stderr));
        return;
      }

      const signatureRegex = /Signature: (\S+)/;
      const matches = stdout.match(signatureRegex);
      if (matches && matches[1]) {
        const signature = matches[1];
        resolve(signature);
      } else {
        console.error("Signature not found in the output");
        reject(new Error("Signature not found in the output"));
      }
    });
  });
}
