import { ResponseError } from './response-error';

/**
 * Headers with the same key get overwritten
 */
export const combineHeaders = (...headers: Headers[]): Headers => {
  const enumerated: [string, string][] = headers.flatMap((obj) => {
    return Array.from(obj.entries()) as [string, string][];
  });
  const combined = Object.fromEntries(enumerated);
  return new Headers(combined);
};

/**
 * Create `URLSearchParams` from object
 */
export const createSearchParams = (
  entries: Record<string, string | number | boolean | undefined | null | (string | number | boolean)[]>,
  join: 'array' | 'multi' | string = 'multi',
): URLSearchParams => {
  const params = Object.entries(entries)
    .filter(entry => entry[1] !== undefined)
    .flatMap(([key, val]): [string, string][] => {
      if (Array.isArray(val)) {
        if (join === 'array' || join === 'multi') {
          return val.map(v => ([join === 'array' ? `${key}[]` : key, String(v)]));
        }
        return [[key, val.join(join)]];
      }
      return [[key, String(val ?? '')]];
    });

  return new URLSearchParams(params);
};

/**
 * Returns the parsed JSON response
 */
export const getResponseJson = async <T>(response: Response): Promise<T> => {
  return await response.json() as T;
};

/**
 * Throws an error if response is not OK
 */
export const assertValidResponse = (response: Response): void => {
  if (!response.ok) {
    throw new ResponseError(response);
  }
};
