# mvwallet

A self-custodial EVM wallet for Ethereum Sepolia Testnet.

Built with Vite, React, TypeScript, and Ethers.js. No backend. No tracking.
Everything runs in your browser.

## Features

- Create a new wallet (BIP-39 seed phrase, 12 words)
- Import an existing wallet from a seed phrase
- Encrypt the seed phrase with a password (ethers keystore format)
- Store only the encrypted keystore in IndexedDB
- Lock and unlock with password
- View Sepolia ETH balance
- Send ETH on Sepolia
- Export seed phrase for backup
- Delete wallet from device

## Security

See [SECURITY.md](./SECURITY.md).

This is an educational project. It is not audited. Do not use it with real funds.

## Stack

| Layer    | Technology  |
|----------|-------------|
| Build    | Vite 5      |
| UI       | React 18    |
| Language | TypeScript  |
| Web3     | Ethers.js 6 |
| Storage  | IndexedDB   |
| Styling  | Tailwind 3  |

## Local Development

npm install
npm run dev

## Build

npm run build

Output is in dist/.

## Deploy to Cloudflare Pages

1. Push this repository to GitHub.
2. Open the Cloudflare dashboard and go to Workers & Pages.
3. Click Create application, select the Pages tab.
4. Click Connect to Git and select this repository.
5. Use the following build settings:

| Setting                 | Value             |
|-------------------------|-------------------|
| Framework preset        | Vite              |
| Build command           | npm run build     |
| Build output directory  | dist              |

6. Click Save and Deploy.

The files public/_headers and public/_redirects are picked up automatically
by Cloudflare Pages to apply security headers and SPA fallback routing.

## License

MIT