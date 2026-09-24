const SENSITIVE_PATTERNS: RegExp[] = [
  /private[_\s]?key/gi,
  /mnemonic/gi,
  /seed[_\s]?phrase/gi,
  /0x[a-fA-F0-9]{64}/g
];

export function sanitizeError(error: unknown): string {
  if (!(error instanceof Error)) {
    return "An unexpected error occurred.";
  }

  let message = error.message;

  for (const pattern of SENSITIVE_PATTERNS) {
    message = message.replace(pattern, "[REDACTED]");
  }

  const lower = message.toLowerCase();

  if (lower.includes("user rejected") || lower.includes("user denied")) {
    return "Transaction was rejected.";
  }

  if (lower.includes("insufficient funds")) {
    return "Insufficient balance to cover amount and gas.";
  }

  if (
    lower.includes("incorrect password") ||
    lower.includes("invalid password")
  ) {
    return "Wrong password. Please try again.";
  }

  if (lower.includes("network") || lower.includes("timeout")) {
    return "Network error. Please check your connection.";
  }

  if (lower.includes("invalid mnemonic") || lower.includes("invalid phrase")) {
    return "Invalid seed phrase. Please check the words and try again.";
  }

  return message.slice(0, 200);
}