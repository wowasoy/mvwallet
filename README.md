# mvwallet

![CI](https://github.com/wowasoy/mvwallet/actions/workflows/ci.yml/badge.svg)

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

## Installation

mvwallet is a Progressive Web App (PWA). It can be installed on mobile and
desktop without an app store.

### Android (Chrome, Brave, or Edge)

1. Open https://mvwallet.pages.dev in the browser.
2. Wait 15 to 30 seconds for the browser to detect the PWA manifest.
3. Tap the three-dot menu and select **Install app** or
   **Add to Home screen**.
4. Confirm. The wallet icon appears on the home screen.
5. Open the app. It runs in standalone mode without the browser address bar.

### iOS (Safari)

1. Open https://mvwallet.pages.dev in Safari. Other browsers on iOS do not
   support PWA installation.
2. Tap the **Share** button.
3. Scroll down and select **Add to Home Screen**.
4. Name the shortcut `mvwallet` and confirm.
5. The app opens from the home screen in standalone mode.

### Desktop (Chrome, Edge, or Brave)

1. Open https://mvwallet.pages.dev in the browser.
2. Look for the install icon in the address bar.
3. Click it and confirm installation.
4. The app launches as a standalone window.

## First-Time Use

1. Open the app.
2. Choose **Create New Wallet** to generate a new BIP-39 seed phrase, or
   **Import Existing Wallet** to restore from an existing seed phrase.
3. If creating a new wallet, write down the 12-word seed phrase on paper and
   store it offline. Do not take a screenshot and do not save it in a
   password manager, note-taking app, or cloud storage.
4. Set a password. This password encrypts the wallet keystore on the device.
   It cannot be recovered.
5. Confirm that you have written down the seed phrase.
6. The dashboard opens with your address and Sepolia ETH balance.

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
| Testing  | Vitest      |
| CI       | GitHub Actions |

## Local Development

npm install
npm run dev

## Build

npm run build

Output is in dist/.

## Test

npm test

## Deploy to Cloudflare Pages

1. Push this repository to GitHub.
2. Open the Cloudflare dashboard and go to Workers & Pages.
3. Click Create application, select the Pages tab.
4. Click Connect to Git and select this repository.
5. Use the following build settings:

| Setting                 | Value             |
|-------------------------|-------------------|
| Framework preset        | React (Vite)      |
| Build command           | npm run build     |
| Build output directory  | dist              |

6. Click Save and Deploy.

The files public/_headers and public/_redirects are picked up automatically
by Cloudflare Pages to apply security headers and SPA fallback routing.

## License

MIT