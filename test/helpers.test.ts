import { mergeHeaders, searchParams } from '../src/helpers';

describe('mergeHeaders', () => {
  it('should combine headers', () => {
    const h1 = new Headers({
      'Content-Type': 'application/json',
    });
    const h2 = new Headers({
      'Content-Type': 'application/xml',
    });
    const h3 = new Headers({
      'X-Custom': 'custom',
    });
    const headers = mergeHeaders(h1, h2, h3);
    expect(Array.from(headers.entries())).toEqual([
      ['content-type', 'application/xml'],
      ['x-custom', 'custom'],
    ]);
  });
});

describe('appendParams', () => {
  it('should append params', () => {
    const params = searchParams({
      array: ['1', 2, true],
      string: 'string',
      number: 100,
      true: true,
      false: false,
      null: null,
      undefined,
    });

    expect(params.getAll('array')).toEqual(['1', '2', 'true']);
    expect(params.get('string')).toBe('string');
    expect(params.get('number')).toBe('100');
    expect(params.get('true')).toBe('true');
    expect(params.get('false')).toBe('false');
    expect(params.get('null')).toBe('');
    expect(params.get('undefined')).toBe(null);
  });
});
