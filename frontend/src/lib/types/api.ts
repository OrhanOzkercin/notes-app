export interface Meta {
  total?: number;
  page?: number;
  perPage?: number;
}

export interface APIError {
  code: string;
  message: string;
  target?: string;
  details?: APIError[];
  docUrl?: string;
}

export interface ErrorResponse {
  errors: APIError[];
  requestId: string;
  timestamp: string;
}

export interface SuccessResponse<T> {
  data: T;
  meta?: Meta;
  requestId: string;
  timestamp: string;
}

export class APIException extends Error {
  public readonly errors: APIError[];
  public readonly requestId: string;
  public readonly timestamp: string;
  public readonly statusCode: number;

  constructor(response: ErrorResponse, statusCode: number) {
    super(response.errors[0]?.message || 'Unknown error');
    this.name = 'APIException';
    this.errors = response.errors;
    this.requestId = response.requestId;
    this.timestamp = response.timestamp;
    this.statusCode = statusCode;
  }

  get primaryError(): APIError | undefined {
    return this.errors[0];
  }

  hasErrorCode(code: string): boolean {
    return this.errors.some(error => error.code === code);
  }
} 