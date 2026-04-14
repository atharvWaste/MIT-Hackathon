class ApiError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors; // field-level validation errors
    Error.captureStackTrace(this, this.constructor);
  }
}
 
export default ApiError;