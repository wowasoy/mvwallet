import { describe, it, expect } from "vitest";
import { normalizeAddress, parseAmount, formatAddress } from "../validation";

describe("normalizeAddress", () => {
  it("returns checksummed address for valid lowercase input", () => {
    const result = normalizeAddress(
      "0xd8da6bf26964af9d7eed9e03e53415d37aa96045"
    );
    expect(result).toBe("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045");
  });

  it("returns same address for already-checksummed input", () => {
    const result = normalizeAddress(
      "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
    );
    expect(result).toBe("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045");
  });

  it("trims whitespace before validation", () => {
    const result = normalizeAddress(
      "  0xd8da6bf26964af9d7eed9e03e53415d37aa96045  "
    );
    expect(result).toBe("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045");
  });

  it("returns null for invalid input", () => {
    expect(normalizeAddress("0xinvalid")).toBe(null);
    expect(normalizeAddress("")).toBe(null);
    expect(normalizeAddress("vitalik.eth")).toBe(null);
    expect(normalizeAddress("0xd8da6bf26964af9d7eed9e03e53415d37aa960")).toBe(
      null
    );
  });
});

describe("parseAmount", () => {
  it("parses valid decimal amount", () => {
    expect(parseAmount("1")).toBe(1000000000000000000n);
    expect(parseAmount("1.5")).toBe(1500000000000000000n);
    expect(parseAmount("0.01")).toBe(10000000000000000n);
    expect(parseAmount("0.000000000000000001")).toBe(1n);
  });

  it("trims whitespace", () => {
    expect(parseAmount("  1.5  ")).toBe(1500000000000000000n);
  });

  it("rejects zero", () => {
    expect(parseAmount("0")).toBe(null);
    expect(parseAmount("0.0")).toBe(null);
  });

  it("rejects negative values", () => {
    expect(parseAmount("-1")).toBe(null);
    expect(parseAmount("-0.5")).toBe(null);
  });

  it("rejects malformed input", () => {
    expect(parseAmount("abc")).toBe(null);
    expect(parseAmount("1.2.3")).toBe(null);
    expect(parseAmount("")).toBe(null);
    expect(parseAmount(" ")).toBe(null);
    expect(parseAmount("1,5")).toBe(null);
  });
});

describe("formatAddress", () => {
  it("shortens address with ellipsis", () => {
    const result = formatAddress(
      "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
    );
    expect(result).toBe("0xd8dA...6045");
  });

  it("preserves first 6 and last 4 characters", () => {
    const addr = "0x1234567890abcdef1234567890abcdef12345678";
    const result = formatAddress(addr);
    expect(result.startsWith("0x1234")).toBe(true);
    expect(result.endsWith("5678")).toBe(true);
    expect(result).toContain("...");
  });
});