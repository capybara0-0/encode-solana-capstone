# SPL-Token-CLI Modified Tool

## Overview

This version of the SPL-Token-CLI tool is a modified edition of the original tool from the `solana-program-lab` repository by Solana Labs. It has been modified to address the issue of transactions failing during periods of high network traffic. This tool retains all the functionalities of the original SPL-token-cli tool while improving its performance and reliability in demanding conditions.

## Features

- **Enhanced Transaction Handling:** The tool includes an optional parameter for setting lamport fees, allowing users to prioritize their transactions. This feature significantly increases the likelihood of successful transactions even during periods of heavy network traffic.
- **Compatibility:** Fully compatible with existing Solana infrastructure and token standards.
- **User-Friendly:** Maintains the same command line interface for ease of use.

## Prerequisites

- Rust
- solana-cli

## Installation
1. After installing the repository navigate to `spl-token-x` root directory.
2. Run this command `cargo install --bin spl-token-x --path "solana-token-x/token/cli"`

## Usage

Use this tool as you would the original SPL-token-cli tool. Common commands include:

- **Freezing a token account:**

  ```bash
  spl-token-x --max-prio-fee-lamports <lamports> freeze <TOKEN_ADDRESS>
  ```

- **Thawing a token account:**

  ```bash
  spl-token-x --max-prio-fee-lamports <lamports> thaw <TOKEN_ADDRESS>
  ```

- For a full list of commands and their descriptions, run:

  ```bash
  spl-token-x --help
  ```
  
## Acknowledgments

- Original tool by Solana Labs. [ https://github.com/solana-labs/solana-program-library ]
