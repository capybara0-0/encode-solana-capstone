import chalk from "chalk";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export function logTransactionStatus(message, type = "info") {
  const color =
    {
      info: chalk.blue,
      warning: chalk.yellow,
      passed: chalk.bgGreen,
      debug: chalk.bgMagenta,
    }[type] || chalk.white;

  console.log(color(message));
}

function processLamports(instruction) {
  if (!instruction.parsed) {
    return { SOL: 0 };
  }

  const {
    program,
    parsed: { type, info },
  } = instruction;

  if (type === "transfer" && program === "system") {
    return { SOL: info.lamports / LAMPORTS_PER_SOL };
  }

  return { SOL: 0 };
}

function processInstruction(blockTime) {
  const transactionDate = new Date(blockTime * 1000).toISOString();

  return { transactionDate };
}

function extractTransactions(transaction) {
  const combinedResults = {};

  const addResult = (instructionKey, result) => {
    if (result && result.SOL > 0) {
      combinedResults[instructionKey] = {
        ...combinedResults[instructionKey],
        ...result,
      };
    }
  };

  const processInstructionAndLamports = (instruction, blockTime) => {
    const instructionKey = instruction;
    const lamportsResult = processLamports(instruction);
    const instructionResult = processInstruction(blockTime);

    addResult(instructionKey, lamportsResult);
    addResult(instructionKey, instructionResult);
  };

  const processInstructions = (instructions, blockTime) => {
    instructions.forEach((instruction) =>
      processInstructionAndLamports(instruction, blockTime),
    );
  };

  if (transaction?.meta?.innerInstructions?.length) {
    transaction.meta.innerInstructions.forEach((innerInstruction) =>
      processInstructions(innerInstruction.instructions, transaction.blockTime),
    );
  } else {
    logTransactionStatus(
      `[Warning] Transaction ${transaction?.transaction?.signatures} has no innerInstructions.`,
      "warning",
    );
  }

  if (transaction?.transaction?.message?.instructions?.length) {
    processInstructions(
      transaction.transaction.message.instructions,
      transaction.blockTime,
    );
  } else {
    logTransactionStatus(
      `[Warning] Transaction ${transaction?.transaction?.signatures} has no message.instructions.`,
      "warning",
    );
  }

  const finalResults =
    Object.keys(combinedResults).length > 0
      ? Object.values(combinedResults).map((result) => ({
          ...result,
          SOL: result.SOL || 0,
          transactionDate:
            result.transactionDate ||
            processInstruction(transaction.blockTime).transactionDate,
        }))
      : [
          {
            SOL: 0,
            transactionDate: processInstruction(transaction.blockTime)
              .transactionDate,
          },
        ];

  return finalResults;
}

export function parseGetParsedTransactions(transactions) {
  const results = [];

  transactions.forEach((transaction) => {
    if (!transaction || !transaction.meta) {
      logTransactionStatus(
        "[Warning] Transaction or transaction.meta is undefined.",
        "warning",
      );
      return;
    }

    if (transaction.blockTime) {
      const transactionDate = new Date(
        transaction.blockTime * 1000,
      ).toISOString();
      console.log(
        chalk.whiteBright(`[${transactionDate}] Processing TXsignature:`),
        chalk.yellow(transaction.transaction.signatures),
      );
    } else {
      console.log(
        chalk.blue("[Info] Processing TXsignature:"),
        chalk.yellow(transaction.transaction.signatures),
      );
    }

    results.push(...extractTransactions(transaction));
  });
  return results;
}
