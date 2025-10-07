"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class error extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'; // 4xx for client errors, 5xx for server errors
        this.isOperational = true; // Operational errors (trusted errors)
        Error.captureStackTrace(this, this.constructor); // Captures where the error was thrown
    }
}
exports.default = error;
