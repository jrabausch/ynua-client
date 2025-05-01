export class ResponseError extends Error {
  constructor(
    public readonly response: Response,
  ) {
    super(`Error ${response.status}: ${response.statusText}`);
    this.name = 'ResponseError';
  }
}
