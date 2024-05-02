import XLSX from "xlsx";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";
import { MINT_ADDRESS } from "../constants/constatnt.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function storeFrozenAccount(
  transactionDate,
  amountOfSOL,
  ownerAddress,
  transactionSignature,
) {
  const sheetName = MINT_ADDRESS.slice(0, 4) + "...." + MINT_ADDRESS.slice(-4);
  const filePath = path.join(__dirname, `${sheetName}.xlsx`);
  let workbook;
  try {
    workbook = XLSX.readFile(filePath);
  } catch (error) {
    console.log(chalk.blue("Info:"), `New sheet ${MINT_ADDRESS} created.`);
    workbook = XLSX.utils.book_new();
  }

  let worksheet;
  if (!workbook.Sheets[sheetName]) {
    worksheet = XLSX.utils.aoa_to_sheet([
      ["TransactionDate", "SOL_Amount", "OwnerAddress", "TransactionSignature"],
    ]);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    console.info(`New sheet "Frozen Accounts" created.`);
  } else {
    worksheet = workbook.Sheets[sheetName];
  }

  const range = XLSX.utils.decode_range(worksheet["!ref"]);
  const nextRow = range.e.r + 2;

  XLSX.utils.sheet_add_json(
    worksheet,
    [
      {
        TransactionDate: transactionDate,
        SOL_Amount: amountOfSOL,
        OwnerAddress: ownerAddress,
        TransactionSignature: transactionSignature,
      },
    ],
    { origin: -1, skipHeader: true },
  );

  XLSX.writeFile(workbook, filePath);
  console.info(
    ` TXdate | amount-of-SOL |  OwnerAddress | TXsignature | has been successfully stored.`,
  );
}
