# Solana SPL-Token Monitoring Bot

## Overview

This Node.js automation bot is designed to monitor SPL-token transfers and transactions on the Solana blockchain. Utilizing the Solana client libraries, the bot analyzes transactions involving SPL-tokens and SOL to make decisions on when to freeze associated token accounts. Whitelisted addresses are exempt from being frozen and their transactions will not be recorded. Frozen account details are stored in an Excel sheet for easy access and analysis.

## Features

- **Custom CLI Tool Integration**: Utilizes a custom-written CLI tool for SPL-token commands, which is executed directly in the command line, offering a higher success rate and efficiency compared to standard library functions.
- **Transaction Monitoring**: Real-time monitoring of SPL-token and SOL transactions on the Solana blockchain.
- **Decision Making**: Automatically decides when to freeze token accounts based on transaction analysis.
- **Whitelist Management**: Supports a whitelist of addresses that are exempt from freezing.
- **Data Storage**: Records details of frozen accounts in an Excel sheet for straightforward data retrieval and management.

## Prerequisites

Before you set up the bot, ensure you have the following installed:

- Node.js (v18.x or later recommended)
- npm (Node Package Manager)
- Git (for cloning the repository)

## Installation

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Configuration**

   Navigate to `src/constants/constatnt.js` file in the root directory and update it with the necessary parameters.

## Usage

Start the bot using:

```bash
node src/index.js
```

### Adding to Whitelist

To add addresses to the whitelist, append them to the `whitelist.txt` file located at `src/models/whitelistAddress.txt`. Ensure each address is on a new line.

### Data Recording

Details of frozen accounts are stored in an Excel file named `src/models/<file_name>.xlsx` in the project's root directory. This file is updated in real-time as accounts are frozen by the bot.
