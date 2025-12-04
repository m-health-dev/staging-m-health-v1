/**
 * Generate a secure password containing at least one lowercase, uppercase,
 * digit and special character.
 *
 * Works in browser (crypto.getRandomValues) and Node.js (crypto.randomBytes).
 *
 * @param length desired password length (must be >= 4)
 * @returns generated password string
 */
export function generatePassword(length: number = 12): string {
  if (!Number.isInteger(length) || length < 4) {
    throw new Error("length must be an integer >= 4");
  }

  const LOWER = "abcdefghijklmnopqrstuvwxyz";
  const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const DIGITS = "0123456789";
  const SPECIAL = `!@#$%^&*()_+-=[]{};':"|<>?,./\`~`;

  const ALL = LOWER + UPPER + DIGITS + SPECIAL;

  // Secure random byte generator: works in browser & node
  const secureRandomBytes = (n: number): Uint8Array => {
    if (
      typeof crypto !== "undefined" &&
      typeof crypto.getRandomValues === "function"
    ) {
      const arr = new Uint8Array(n);
      crypto.getRandomValues(arr);
      return arr;
    } else {
      // Node fallback
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const nodeCrypto = require("crypto");
      return new Uint8Array(nodeCrypto.randomBytes(n));
    }
  };

  // helper: pick one char from string using secure random
  const pickOne = (chars: string) => {
    const idx = secureRandomBytes(1)[0] % chars.length;
    return chars.charAt(idx);
  };

  // Start by ensuring at least one from each class
  const required: string[] = [
    pickOne(LOWER),
    pickOne(UPPER),
    pickOne(DIGITS),
    pickOne(SPECIAL),
  ];

  // Fill the rest with random chars from ALL
  const remainingCount = length - required.length;
  for (let i = 0; i < remainingCount; i++) {
    required.push(pickOne(ALL));
  }

  // Shuffle array securely (Fisher-Yates using secure random)
  const shuffle = (arr: string[]) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const rand = secureRandomBytes(1)[0];
      const j = rand % (i + 1);
      const tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
  };

  shuffle(required);

  return required.join("");
}
