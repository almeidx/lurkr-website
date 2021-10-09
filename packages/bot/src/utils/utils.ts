import type { Snowflake } from 'discord-api-types';

import {
  DATABASE_LIMITS,
  DATABASE_PREMIUM_LIMITS,
  DEFAULT_ROLE_COLOUR,
  MAX_SNOWFLAKE,
  MIN_SNOWFLAKE,
} from './constants';

export type CorrectSnowflakeTypes<T> = {
  [K in keyof T]: K extends 'id' ? Snowflake : CorrectSnowflakeTypes<T[K]>;
};

export type DeepMutable<T> = { -readonly [K in keyof T]: DeepMutable<T[K]> };

export const isValidSnowflake = (str: string): str is Snowflake => {
  if (!/^[1-9]\d{16,18}$/.test(str)) return false;
  if (parseInt(str, 10) < MIN_SNOWFLAKE) return false;
  if (BigInt(str) > MAX_SNOWFLAKE) return false;
  return true;
};

export const roundNumberToNDecimalPlaces = (n: number, decimals = 2): number => parseFloatStrict(n.toFixed(decimals));

export const parseMultiplier = (phrase: string): number | null => {
  const numberCandidate = phrase.replace(/x/gi, '');
  if (!numberCandidate) return null;

  const number = roundNumberToNDecimalPlaces(Number(numberCandidate));
  if (!number || number <= 0 || number > 5) return null;

  return number;
};

const hexToRgb = (hex: number) => {
  const r = (hex >> 16) & 255;
  const g = (hex >> 8) & 255;
  const b = hex & 255;

  return `rgb(${r}, ${g}, ${b})`;
};

/**
 * Returns a hexadecimal colour or its default value if it doesn't exist
 * @param colour The colour number
 */
export const resolveColour = (colour: number) => (colour ? hexToRgb(colour) : DEFAULT_ROLE_COLOUR);

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

export const generateRandomString = (length = 10): string => Math.random().toString(36).substr(2, length);

export const getDatabaseLimit = <
  K extends keyof typeof DATABASE_LIMITS | keyof typeof DATABASE_PREMIUM_LIMITS = keyof typeof DATABASE_LIMITS,
>(
  key: K,
  premium: boolean,
): typeof DATABASE_LIMITS[K] | typeof DATABASE_PREMIUM_LIMITS[K] =>
  premium ? DATABASE_PREMIUM_LIMITS[key] : DATABASE_LIMITS[key];
