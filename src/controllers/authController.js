"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.login = void 0;
const client_1 = require("@prisma/client");
const validators_1 = require("../utils/validators");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const errors_1 = __importDefault(require("./../utils/errors"));
const prisma = new client_1.PrismaClient();
// JWT Secret Key
const jwtsecret = process.env.JWT_SECRET;
// Login Route
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber, password } = req.body;
    try {
        // Validate input
        if (!phoneNumber || !password) {
            return next(new errors_1.default("Phone number and password are required", 400));
        }
        // Find the user by phoneNumber
        const user = yield prisma.user.findUnique({
            where: { phoneNumber },
        });
        if (!user) {
            return next(new errors_1.default("User not found", 404));
        }
        // Check if the provided password matches the stored password
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return next(new errors_1.default("Invalid phone number or password", 401));
        }
        //Generate a JWT token
        if (!jwtsecret) {
            throw new Error('JWT_SECRET is not defined');
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, jwtsecret, { expiresIn: '1h' });
        // Send the response
        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
            },
            token,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred during login' });
    }
});
exports.login = login;
// Signup Route
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, phoneNumber, email, password } = req.body;
    try {
        // Validate input
        if (!phoneNumber || !password || !name) {
            return next(new errors_1.default("All fields are required", 400));
        }
        const errors = (0, validators_1.getPasswordValidationErrors)(password);
        if (errors.length > 0) {
            return res.status(400).json({
                error: {
                    message: 'Password validation failed',
                    details: errors,
                },
            });
        }
        // Check if the phone number or email is already registered
        const existingUser = yield prisma.user.findFirst({
            where: {
                OR: [{ phoneNumber }],
            },
        });
        if (existingUser) {
            return res.status(409).json({ error: 'Phone number already registered' });
        }
        // Hash the password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Create the user in the database
        const newUser = yield prisma.user.create({
            data: {
                phoneNumber,
                password: hashedPassword,
                name,
                email: email || null,
            },
        });
        // Update all contacts with the newly registered phone number
        yield prisma.contact.updateMany({
            where: { contactNumber: phoneNumber }, // Update contacts with the same phone number
            data: { userId: newUser.id }, // Set the user ID for the contacts
        });
        // Send success response
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                phoneNumber: newUser.phoneNumber,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.register = register;
