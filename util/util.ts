// https://discord.com/developers/docs/reference#snowflakes
export const MIN_SNOWFLAKE = 0b000000000000000000000000000000000000000000_00001_00001_000000000001;
// 0b111111111111111111111111111111111111111111_11111_11111_111111111111 without _ which BigInt doesn't support
export const MAX_SNOWFLAKE = BigInt('0b1111111111111111111111111111111111111111111111111111111111111111');

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
