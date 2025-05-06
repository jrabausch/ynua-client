import type { AuthConfig, ClientConfig, RequestConfig } from './types/configuration';
import type { HttpVerb } from './types/http';
import { mergeHeaders, validate } from './helpers';

export class Client {
  protected readonly urlBase: URL;
  protected readonly headers: Headers;
  protected readonly fetch: (request: Request) => Promise<Response>;

  constructor(config: ClientConfig) {
    const basePath = config.basePath ? config.basePath.replace(/\/+$/, '') : '';
    const protocol = config.protocol ?? 'https';
    const port = config.port ? `:${config.port}` : '';
    const url = `${protocol}://${config.host}${port}`;
    this.urlBase = new URL(`${basePath}/`, url);
    this.headers = new Headers(config.headers);
    this.fetch = config.fetch ?? globalThis.fetch.bind(globalThis);
    // auth
    if (config.auth) {
      this.headers.set('Authorization', this.getAuthHeader(config.auth));
    }
  }

  public get baseUrl(): string {
    return this.urlBase.toString();
  }

  protected getAuthHeader(authConfig: AuthConfig): string {
    const type = authConfig.type;
    if (type === 'basic') {
      const credentials = btoa(`${authConfig.username}:${authConfig.password}`);
      return `Basic ${credentials}`;
    }
    if (type === 'bearer') {
      return `Bearer ${authConfig.token}`;
    }
    throw new Error(`unsupported auth type ${type}`);
  }

  public init(
    method: HttpVerb,
    path: string,
    config?: RequestConfig,
  ): Request {
    const url = new URL(path.replace(/^\/+/, ''), this.urlBase);
    url.search = config?.params?.toString() ?? '';
    const headers = mergeHeaders(this.headers, new Headers(config?.headers));
    return new Request(url, {
      method,
      headers,
      body: config?.body,
      signal: config?.signal,
    });
  };

  public async request(
    method: HttpVerb,
    path: string,
    config?: RequestConfig,
  ): Promise<readonly [Request, Response]> {
    const request = this.init(method, path, config);
    const response = await this.fetch(request);
    return [request, response];
  }

  public async get(
    path: string,
    config?: Omit<RequestConfig, 'body'>,
  ): Promise<Response> {
    const [request, response] = await this.request('get', path, config);
    return validate(request, response);
  }

  public async post(
    path: string,
    config?: RequestConfig,
  ): Promise<Response> {
    const [request, response] = await this.request('post', path, config);
    return validate(request, response);
  }

  public async put(
    path: string,
    config?: RequestConfig,
  ): Promise<Response> {
    const [request, response] = await this.request('put', path, config);
    return validate(request, response);
  }

  public async patch(
    path: string,
    config?: RequestConfig,
  ): Promise<Response> {
    const [request, response] = await this.request('patch', path, config);
    return validate(request, response);
  }

  public async delete(
    path: string,
    config?: Omit<RequestConfig, 'body'>,
  ): Promise<Response> {
    const [request, response] = await this.request('delete', path, config);
    return validate(request, response);
  }

  public async head(
    path: string,
    config?: Omit<RequestConfig, 'body'>,
  ): Promise<Response> {
    const [request, response] = await this.request('head', path, config);
    return validate(request, response);
  }
};
