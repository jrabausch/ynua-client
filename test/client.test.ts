import { Client } from '../src/client';

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
});
