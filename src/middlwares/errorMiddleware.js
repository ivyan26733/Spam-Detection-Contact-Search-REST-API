"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorMiddleware = (err, req, res, next) => {
    // Default values for unexpected errors
    const statusCode = err.statusCode || 500;
    const status = err.status || 'error';
    // Log the error details (consider using a logger like Winston or Bunyan in production)
    console.error('ERROR:', err);
    // Send error response
    if (process.env.NODE_ENV === 'production') {
        if (err.isOperational) {
            // Operational errors: send a friendly message
            res.status(statusCode).json({
                status,
                message: err.message,
            });
        }
        else {
            // Programming or unknown errors: don't leak details to the client
            res.status(500).json({
                status: 'error',
                message: 'Something went wrong!',
            });
        }
    }
    else {
        // Development: send full error details
        res.status(statusCode).json({
            status,
            error: err,
            message: err.message,
            stack: err.stack,
        });
    }
};
exports.default = errorMiddleware;
