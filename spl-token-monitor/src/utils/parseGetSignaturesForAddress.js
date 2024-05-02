import chalk from "chalk";

export function parseGetSingaturesForAddress(transactions) {
  if (!transactions) {
    console.log(chalk.yellow(`Warning: No signatures found to parse.`));
    return [];
  }
  return transactions.map((transaction) => transaction.signature);
}
