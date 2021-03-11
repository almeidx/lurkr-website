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
