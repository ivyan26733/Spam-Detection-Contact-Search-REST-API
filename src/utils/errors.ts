class error extends Error {
    public statusCode: number;
    public status: string;
    public isOperational: boolean;
  
    constructor(message: string, statusCode: number) {
      super(message);
  
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'; // 4xx for client errors, 5xx for server errors
      this.isOperational = true; // Operational errors (trusted errors)
  
      Error.captureStackTrace(this, this.constructor); // Captures where the error was thrown
    }
  }
  
  export default error;
  