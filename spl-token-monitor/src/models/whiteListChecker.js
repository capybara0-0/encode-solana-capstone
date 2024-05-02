import chalk from "chalk";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { freezeNonWhiteListedAccount } from "../utils/freezeAccount.js";
import { fetchAccountState } from "../clients/fetchAccountInfo.js";

import {
  DELAY_FREEZE_TIME_IN_MINUTES,
  MINIMUM_SOL_BALANCE,
} from "../constants/constatnt.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let cachedWhiteListedAddresses = null;

const log = (message, level = "info", data = "") => {
  const colors = { info: "blue", warning: "yellow", error: "red" };
  console.log(
    chalk[colors[level]](`[${level.toUpperCase()}] ${message}`) +
      (data ? ` ${chalk.yellow(data)}` : ""),
  );
};

async function getWhiteListedAddresses() {
  if (cachedWhiteListedAddresses !== null) {
    return cachedWhiteListedAddresses;
  }
  try {
    const data = fs.readFileSync(path.join(__dirname, "whitelistAddress.txt"), {
      encoding: "utf-8",
    });
    cachedWhiteListedAddresses = data
      .split("\n")
      .filter((line) => line.trim() !== "");
    return cachedWhiteListedAddresses;
  } catch (err) {
    throw new Error(
      `Failed to read white-listed addresses. Ensure the file exists and has the correct permissions. Error details: ${err.message}`,
    );
  }
}

export async function checkAddresAgainstWhiteListedAddress(
  transactionDate,
  SOL,
  ownerAddress,
  ATA,
) {
  const isFrozen = await fetchAccountState(ATA);
  try {
    const whiteListedAddresses = await getWhiteListedAddresses();
    if (whiteListedAddresses.includes(ownerAddress)) {
      log(
        `Owner Address: ${ownerAddress} is present in the whitelist.`,
        "info",
      );
    } else if (isFrozen === true) {
      log(`Token Address: ${ATA} is already frozen`, "warning");
    } else {
      handleNonWhiteListedAccount(transactionDate, SOL, ownerAddress, ATA);
    }
  } catch (error) {
    log(error.message, "error");
  }
}

async function handleNonWhiteListedAccount(
  transactionDate,
  SOL,
  ownerAddress,
  ATA,
) {
  if (SOL < MINIMUM_SOL_BALANCE) {
    log(
      `Balance is below ${MINIMUM_SOL_BALANCE} SOL, delaying the freeze action by ${DELAY_FREEZE_TIME_IN_MINUTES} minutes for account`,
      "warning",
      ownerAddress,
    );
    setTimeout(() => {
      freezeNonWhiteListedAccount(transactionDate, SOL, ownerAddress, ATA);
    }, DELAY_FREEZE_TIME_IN_MINUTES * 60000);
  } else {
    await freezeNonWhiteListedAccount(transactionDate, SOL, ownerAddress, ATA);
    log("Direct freeze initiated", "info");
  }
}
