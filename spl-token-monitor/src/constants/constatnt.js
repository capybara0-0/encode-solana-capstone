/**
 * Configuration Constants for SPL-Token Monitor Script
 */

/// ------------------------
// MAINNET CONFIGURATION
// ------------------------
export const RPC_URL = "";

/* # Addresses & PublicKey configuration */
export const MINT_ADDRESS = "";

export const TOKEN_ACCOUNT_ADDRESS = "";

export const OWNER_ADDRESS_OF_LP = "";

// Minimum SOL balance before freezing the account
export const MINIMUM_SOL_BALANCE = 0.05;

// Delay time in minutes before freezing the account when SOL balance is below minimum
export const DELAY_FREEZE_TIME_IN_MINUTES = 0.5;

// Timer interval in seconds for making requests to the server
export const REQUEST_INTERVAL_SECONDS = 2;

export const MAX_PRIO_FEE_LAMPORTS = 5000000;

// Retry limit for freezing token account address
export const RETRY_LIMIT = 3;

// Retry delay timer in seconds
export const RETRY_DELAY = 2;
