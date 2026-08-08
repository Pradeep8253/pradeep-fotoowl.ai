export class MediaError extends Error {
  constructor({ message, code, status, details }) {
    super(message);
    this.name = 'MediaError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export const ERROR_CODES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  NOT_FOUND: 'NOT_FOUND',
  RATE_LIMITED: 'RATE_LIMITED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  ABORTED: 'ABORTED',
  SERVER_ERROR: 'SERVER_ERROR',
  UNKNOWN: 'UNKNOWN',
};
