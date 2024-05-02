# Project Overview

This repository contains two off-chain programs designed for the Solana blockchain's SPL tokens: `spl-token-monitor` and `spl-token-x`.

## Projects

### spl-token-monitor

`spl-token-monitor` is an automated script/bot that monitors SPL tokens and performs actions based on conditions.

- **Features**:

  - Automated monitoring of SPL token state
  - Freezing token account for non-whitelisted address
  - Customizable to fit specific monitoring needs

[Click here for more details on spl-token-monitor](./spl-token-monitor/README.md)

### spl-token-x

`spl-token-x` is a CLI tool based on the `spl-token-cli` provided by Solana Labs. It includes modified features allowing users to specify optional parameters, such as the number of lamports to prioritize transactions. This feature increases the likelihood of transaction success during periods of high network traffic.

- **Features**:
  - Optional lamport specification for transaction prioritization
  - Improved transaction success rates during network congestion

[Click here for more details on spl-token-x](./spl-token-x/README.md)

## License

This project is licensed under the WTFPL (Do What The Fuck You Want To Public License). See the [LICENSE](LICENSE) file for more details.
