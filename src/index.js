"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const indexRoute_1 = __importDefault(require("./routes/indexRoute"));
const authMiddleware_1 = __importDefault(require("./middlwares/authMiddleware"));
const errorMiddleware_1 = __importDefault(require("./middlwares/errorMiddleware"));
const errors_1 = __importDefault(require("./utils/errors"));
const app = (0, express_1.default)();
// Middleware to parse JSON requests
app.use(express_1.default.json());
// Public Routes (e.g., Authentication)
app.use('/api', indexRoute_1.default);
// Protected Routes
app.use('/api/protected', authMiddleware_1.default, indexRoute_1.default);
app.all('*', (req, res, next) => {
    next(new errors_1.default(`Cannot find ${req.originalUrl} on this server!`, 404));
});
app.use(errorMiddleware_1.default); // Error handling middleware
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
exports.default = app;
