export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string
  ) {
    super(message);
    Object.setPrototypeOf(this, new Target().constructor);
  }
}

const Target = AppError; // Avoid compile issues in ES5 envs
