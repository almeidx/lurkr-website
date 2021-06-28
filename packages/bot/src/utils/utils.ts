import type { Snowflake } from 'discord-api-types';

import { MAX_SNOWFLAKE, MIN_SNOWFLAKE } from './constants';

/**
 * Checks if a string could potentially be a valid Discord Snowflake
 * @param str The string to check
 */
export const isValidSnowflake = (str: string): str is Snowflake => {
  if (!/^[1-9]\d{16,18}$/.test(str)) return false;
  if (parseInt(str, 10) < MIN_SNOWFLAKE) return false;
  if (BigInt(str) > MAX_SNOWFLAKE) return false;
  return true;
};

/**
 * Rounds a number to n decimal places.
 * @param n The number that will be rounded.
 * @param decimals The amount of decimal places to round the number to.
 */
export const roundNumberToNDecimalPlaces = (n: number, decimals = 2): number => parseFloat(n.toFixed(decimals));

/**
 * Parses a multiplier phrase.
 * @param phrase The phrase to parse.
 */
export const parseMultiplier = (phrase: string): number | null => {
  const numberCandidate = phrase.replace(/x/gi, '');
  if (!numberCandidate) return null;

  const number = roundNumberToNDecimalPlaces(parseFloat(numberCandidate));
  if (!number || number <= 0 || number > 5) return null;

  return number;
};
