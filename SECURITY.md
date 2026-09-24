# Security Policy

## Scope

This is an educational, self-custodial EVM wallet for Sepolia Testnet. It is
not audited and not intended for mainnet use with real funds.

## Threat Model

The trust boundary:

- Trusted: the user's browser, the code in this repository, the configured
  public RPC endpoint.
- Untrusted: all external input, RPC responses, any data returned from the
  network.

No backend exists. No data leaves the browser except signed transactions
broadcast to the configured RPC endpoint.

## Security Design

1. Seed phrase never leaves the device. Generated locally with
   ethers.Wallet.createRandom(). Stored only as an encrypted keystore.

2. Encryption uses ethers.Wallet.encrypt() - the same keystore format as
   MetaMask and geth.

3. Storage: encrypted keystore is stored in IndexedDB, not localStorage.

4. No plaintext persistence. The decrypted wallet exists only in React memory
   and is discarded on lock or refresh.

5. Input validation via ethers.isAddress, ethers.getAddress (EIP-55 checksum),
   and ethers.parseEther inside try/catch.

6. Error sanitization: private keys, mnemonics, and 32-byte hex strings are
   redacted before any message is shown to the user.

7. Content Security Policy: strict, no unsafe-inline or unsafe-eval in
   script-src. Defined in public/_headers.

8. Testnet only. Hardcoded to Sepolia (chain ID 11155111).

## Known Limitations

- The public RPC endpoint is a single point of failure.
- Password recovery is not possible.
- No transaction history.
- No multi-chain support.

## Reporting

Open a GitHub issue. Do not disclose vulnerabilities publicly without prior
coordination.