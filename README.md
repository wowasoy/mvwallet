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
2. Look for the install icon in the address bar (a small monitor with a
   downward arrow).
3. Click it and confirm installation.
4. The app launches as a standalone window.

### Manual Installation Fallback

If the browser does not offer an install prompt, use the manual method:

- **Android**: browser menu, then **Add to Home screen**.
- **iOS**: Safari Share menu, then **Add to Home Screen**.
- **Desktop**: browser menu, then **Install mvwallet**.

The manual method may open the app inside a browser tab with the address bar
visible. The installed method runs in standalone mode.

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

## Security Notes for Users

Read this before using the app.

- **Testnet only.** This wallet is hardcoded to Sepolia Testnet (chain ID
  11155111). It does not connect to Ethereum mainnet. Do not send real funds.
- **Self-custody means self-responsibility.** The seed phrase is the only way
  to recover the wallet. If the seed phrase is lost, no one can help.
- **Not audited.** The code has not been reviewed by a security firm. Use it
  for learning and experimentation only.
- **No backend.** The application runs entirely in the browser. There is no
  server that can reset a password or restore a wallet.
- **Data location.** The encrypted keystore is stored in IndexedDB on the
  device where the wallet was created. Clearing browser data or deleting the
  app will remove the keystore. The seed phrase is required to restore access.
- **No seed phrase transmission.** The seed phrase never leaves the device.
  If any prompt asks for the seed phrase outside the app, it is a phishing
  attempt.

## Uninstalling

To remove the wallet:

1. Open the app, tap **Lock**, then tap **Delete wallet** and confirm.
2. Uninstall the PWA from the home screen or browser settings.
3. Clear site data in browser settings if additional cleanup is desired.

Deleting the wallet removes the encrypted keystore from the device. The
on-chain address and any balance remain on Sepolia Testnet and can be
restored at any time using the original seed phrase.

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

## Install as App (PWA)

mvwallet is a Progressive Web App. You can install it on your phone's home screen.

**Android (Chrome):**
1. Open https://mvwallet.pages.dev in Chrome.
2. Tap the three-dot menu and select **Install app** or **Add to Home screen**.
3. Confirm. The wallet appears as an icon on your home screen.

**iOS (Safari):**
1. Open https://mvwallet.pages.dev in Safari.
2. Tap the **Share** button.
3. Select **Add to Home Screen**.
4. Confirm.

Once installed, the app runs in standalone mode without the browser address bar.

## License

MIT