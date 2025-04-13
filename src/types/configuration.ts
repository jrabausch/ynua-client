type BasicAuth = {
  type: 'basic';
  username: string;
  password: string;
};

type BearerAuth = {
  type: 'bearer';
  token: string;
};

export type AuthConfig = BasicAuth | BearerAuth;

export type ClientConfig = {
  host: string;
  port?: number;
  protocol?: 'http' | 'https';
  basePath?: string;
  auth?: AuthConfig;
  headers?: HeadersInit;
  fetch?: (request: Request) => Promise<Response>;
};

export type InitConfig = {
  params?: URLSearchParams;
  body?: BodyInit;
  headers?: HeadersInit;
  signal?: AbortSignal;
};
