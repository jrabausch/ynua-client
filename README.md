# @ynua/client

## Installation

```sh
npm install @ynua/client
# pnpm add @ynua/client
```

## Usage

```ts
  import { Client, searchParams, validate, json } from '@ynua/client';

  const client = new Client({
    host: 'localhost',
    port: 8080,
    protocol: 'http',
    basePath: '/api/v1',
    auth: {
      type: 'bearer',
      token: '--token--',
    },
    headers: {
      'X-Custom-Header': 'abc',
    },
    // fetch implementation, defaults to globalThis.fetch
    fetch: globalThis.fetch,
  });
```

Create a `Request` with the `init` method:

```ts
const request = client.init('post', '/user', {
  params: searchParams({ id: 1 });
  // body?: BodyInit;
  // headers?: HeadersInit;
  // signal?: AbortSignal;
} satisfies RequestConfig);

const response = await fetch(request);

// -> POST http://localhost:8080/api/v1/user?id=1
```

Make a request - same as above, but uses the configured Fetch implementation and returns a `[Request, Response]` tuple:

```ts
const [request, response] = await client.request('post', '/user');
```

Validate a `Request`, `Response` pair - throws a `HttpError` if `response.ok` is `false`:

```ts
validate(request, response);
```

Shorthand methods use the `validate` helper under the hood:

```ts
const response = await client.get('/user');
client.post('/user');
client.put('/user');
client.patch('/user');
client.delete('/user');
client.head('/user');
```

Read JSON body from response:

```ts
const data = await json<DataType>(response);
```
