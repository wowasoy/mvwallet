import { describe, it, expect } from "vitest";
import { sanitizeError } from "../errors";

describe("sanitizeError", () => {
  it("redacts 32-byte hex strings (private keys)", () => {
    const error = new Error(
      "Failed with key 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
    );
    const result = sanitizeError(error);
    expect(result).not.toContain("0x1234567890abcdef");
    expect(result).toContain("[REDACTED]");
  });

  it("redacts the word 'private key'", () => {
    const error = new Error("Invalid private key format");
    const result = sanitizeError(error);
    expect(result.toLowerCase()).not.toContain("private key");
  });

  it("redacts the word 'mnemonic'", () => {
    const error = new Error("Mnemonic checksum failed");
    const result = sanitizeError(error);
    expect(result.toLowerCase()).not.toContain("mnemonic");
  });

  it("maps user rejection to friendly message", () => {
    expect(sanitizeError(new Error("User rejected the request"))).toBe(
      "Transaction was rejected."
    );
    expect(sanitizeError(new Error("User denied transaction"))).toBe(
      "Transaction was rejected."
    );
  });

  it("maps insufficient funds to friendly message", () => {
    expect(sanitizeError(new Error("insufficient funds for gas"))).toBe(
      "Insufficient balance to cover amount and gas."
    );
  });

  it("maps wrong password to friendly message", () => {
    expect(sanitizeError(new Error("incorrect password"))).toBe(
      "Wrong password. Please try again."
    );
    expect(sanitizeError(new Error("invalid password"))).toBe(
      "Wrong password. Please try again."
    );
  });

  it("maps network errors to friendly message", () => {
    expect(sanitizeError(new Error("network error"))).toBe(
      "Network error. Please check your connection."
    );
    expect(sanitizeError(new Error("request timeout"))).toBe(
      "Network error. Please check your connection."
    );
  });

  it("maps invalid mnemonic to friendly message", () => {
    expect(sanitizeError(new Error("invalid mnemonic"))).toBe(
      "Invalid seed phrase. Please check the words and try again."
    );
  });

  it("handles non-Error input", () => {
    expect(sanitizeError("string error")).toBe(
      "An unexpected error occurred."
    );
    expect(sanitizeError(null)).toBe("An unexpected error occurred.");
    expect(sanitizeError(undefined)).toBe("An unexpected error occurred.");
    expect(sanitizeError(42)).toBe("An unexpected error occurred.");
  });

  it("truncates long messages to 200 characters", () => {
    const error = new Error("x".repeat(500));
    const result = sanitizeError(error);
    expect(result.length).toBeLessThanOrEqual(200);
  });
});