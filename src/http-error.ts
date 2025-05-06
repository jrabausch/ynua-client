export class HttpError extends Error {
  constructor(
    public readonly request: Request,
    public readonly response: Response,
  ) {
    super(`Error ${response.status}: ${response.statusText}`);
    this.name = 'HttpError';
  }
}
