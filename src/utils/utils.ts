import { MAX_SNOWFLAKE, MIN_SNOWFLAKE } from './constants';

/**
 * Checks if a string could potentially be a valid Discord Snowflake
 * @param str The string to check
 */
export function isValidSnowflake(str: string) {
  if (!/^[1-9]\d{16,18}$/.test(str)) return false;
  if (parseInt(str, 10) < MIN_SNOWFLAKE) return false;
  if (BigInt(str) > MAX_SNOWFLAKE) return false;
  return true;
}

/**
 * Gets the XP required to achieve a level
 * @info un = 100 + 50 * (n - 1) ** 2
 * @param n The level
 * @returns The XP required
 */
export function XP(n: number) {
  return n === 0 ? 0 : 100 + 50 * (n - 1) ** 2;
}

/**
 * No operation.
 */
export function noop(): void {
  return void 0;
}
