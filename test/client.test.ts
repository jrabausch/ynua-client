import { json } from '../src';
import { Client } from '../src/client';

type ResponseData = {
  method: string;
  url: string;
  headers: Record<string, string>;
  body: string;
};

const mockedFetch = async (request: Request): Promise<Response> => {
  const body = await request.text();
  return new Response(JSON.stringify({
    method: request.method,
    url: request.url,
    headers: Object.fromEntries(Array.from(request.headers.entries())),
    body,
  } satisfies ResponseData), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

describe('client', () => {
  it('should construct a base url', () => {
    const client2 = new Client({
      host: 'localhost',
      basePath: '/api/',
    });
    expect(client2.baseUrl).toBe('https://localhost/api/');
    const client = new Client({
      host: 'localhost',
      protocol: 'http',
      port: 8080,
      basePath: '/api',
    });
    expect(client.baseUrl).toBe('http://localhost:8080/api/');
  });

  it('should do requests', async () => {
    const client = new Client({
      host: 'localhost',
      protocol: 'http',
      auth: {
        type: 'bearer',
        token: 'abc123',
      },
      basePath: '/api',
      fetch: mockedFetch,
    });
    const response = await client.post('test', {
      body: 'body-text',
      headers: {
        'Content-Type': 'text/plain',
      },
    });
    const data = await json<ResponseData>(response);
    expect(data.method).toBe('POST');
    expect(data.url).toBe('http://localhost/api/test');
    expect(data.headers).toEqual({
      'authorization': 'Bearer abc123',
      'content-type': 'text/plain',
    });
    expect(data.body).toBe('body-text');
  });
});
