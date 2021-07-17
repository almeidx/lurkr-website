import type { Snowflake } from 'discord-api-types';

import { DEFAULT_ROLE_COLOUR, MAX_SNOWFLAKE, MIN_SNOWFLAKE } from './constants';

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
export const roundNumberToNDecimalPlaces = (n: number, decimals = 2): number => parseFloatStrict(n.toFixed(decimals));

export const parseMultiplier = (phrase: string): number | null => {
  const numberCandidate = phrase.replace(/x/gi, '');
  if (!numberCandidate) return null;

  const number = roundNumberToNDecimalPlaces(Number(numberCandidate));
  if (!number || number <= 0 || number > 5) return null;

  return number;
};

/**
 * Returns a hexadecimal colour or its default value if it doesn't exist
 * @param colour The colour number
 */
export const resolveColour = (colour: number) => (colour ? `#${colour.toString(16)}` : DEFAULT_ROLE_COLOUR);

/**
 * Formats a float number and doesn't keep .00 on round numbers.
 * @param n The float number to round.
 * @param decimals The amount of decimal places to keep.
 */
export const formatNumberToNDecimalPlaces = (n: number, decimals = 2): string => Number(n.toFixed(decimals)).toString();

export const parseIntStrict = (n: string): number => parseInt(Number(n).toString(), 10);

export const parseFloatStrict = (n: string): number => Number(n);

export const isNumeric = (str: string) => {
  if (typeof str != 'string') return false;
  return !isNaN(str as unknown as number) && !isNaN(parseFloat(str));
};
