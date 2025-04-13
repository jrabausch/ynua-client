/**
 * Headers with the same key get overwritten
 */
export const combineHeaders = (...headers: Headers[]): Headers => {
  const enumerated: [string, string][] = headers.flatMap((obj) => {
    // @ts-expect-error no types
    return Array.from(obj.entries()) as [string, string][];
  });
  const combined = Object.fromEntries(enumerated);
  return new Headers(combined);
};

const paramValue = (value: unknown): string => {
  return value === true ? '1' : value === false ? '0' : String(value ?? '');
};

export const createSearchParams = (
  entries: Record<string, unknown | unknown[]>,
): URLSearchParams => {
  const params: string[][] = Object.entries(entries)
    .filter(entry => entry[1] !== undefined)
    .flatMap(([key, val]) => {
      return Array.isArray(val) ? val.map(v => ([key, paramValue(v)])) : [[key, paramValue(val)]];
    });
  return new URLSearchParams(params);
};

export const getResponseData = async <T>(response: Response): Promise<T> => {
  return await response.json() as T;
};

export const assetValidResponse = (response: Response): void => {
  if (response.status < 300) {
    throw new Error('not valid');
  }
};
