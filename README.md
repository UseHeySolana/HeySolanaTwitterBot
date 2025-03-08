# AgentX - Technical Documentation

## Overview
AgentX by HeySolana is a voice-powered agent that enables hands-free interaction with the Solana blockchain. It facilitates transactions, swaps, token analysis, and more using the Solana Agent Toolkit and Cookie Data Swarm API. Users can interact with AgentX on X (formerly Twitter) by tagging @agentheysolana with their commands.

## Features
- **Crypto Transactions**: Perform transfers and swaps directly from X.
- **Token Analysis**: Retrieve data about tokens and agents tracked by Cookie Data Swarm.
- **Rug Check**: Analyze potential scams or rug pulls.
- **Hands-Free Operation**: Use voice commands for blockchain interactions.

## Architecture
AgentX integrates with the following components:
1. **Solana Agent Toolkit**: For blockchain interactions such as transfers and swaps.
2. **Cookie Data Swarm API**: Provides insights into tracked agents and tokens.
3. **Twitter API (X Integration)**: Enables users to interact with AgentX via tagged posts.
4. **Wallet Signing**: Transactions require user authentication via wallet signatures.

## Setup and Registration
### Sign Up
1. Visit [AgentX Sign-Up Page](https://agent-x-by-hey-solana.vercel.app/).
2. Enter:
   - X username
   - Email address
   - Wallet address
3. Complete the sign-up process.

## Usage
### Interacting with AgentX
Tag **@agentheysolana** on X with your command. Examples:

#### Retrieve Supported Functions
```
@agentheysolana what can you do?
```
**Response:** List of available functions.

#### Transfer Funds
```
@agentheysolana can you help me transfer 1 SOL to @recipient?
```
**Response:** A transaction request is generated for user signing.

#### Analyze Token Data
```
@agentheysolana check this agent "SolyAi" or "Cookiedotfun"
```
**Response:** Details about the token fetched from Cookie Data Swarm API.

## API Integration
### Solana Agent Toolkit
Used for:
- Token transfers
- Swaps
- Balance checks

### Cookie Data Swarm API
- Fetches data about tracked agents and tokens.

### Twitter API Integration
- Monitors tweets tagging @agentheysolana
- Processes commands and responds with relevant data

## Security Measures
- **Wallet Signature Verification**: Ensures secure transactions.
- **Rate Limiting**: Prevents spam and excessive API calls.
- **Data Privacy**: User wallet and transaction details are protected.

## Future Enhancements
- Expanded token analysis capabilities.
- Multi-wallet support.
- Advanced voice command processing.

## Conclusion
AgentX simplifies DeFi interactions by allowing users to execute transactions and analyze tokens directly from X. With seamless integration of Solana tools and Cookie Data Swarm API, it enhances accessibility and usability for crypto enthusiasts.

