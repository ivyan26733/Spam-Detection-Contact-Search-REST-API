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
exports.fetchContact = exports.addContact = void 0;
const client_1 = require("@prisma/client");
const errors_1 = __importDefault(require("../utils/errors"));
const prisma = new client_1.PrismaClient();
const addContact = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const loggedInUserId = req.params.id; // ID of the user adding the contact
    const { name, phoneNumber } = req.body;
    if (!name || !phoneNumber) {
        return next(new errors_1.default('Name and phone number are required.', 400));
    }
    try {
        // Check if the phone number belongs to a registered user
        const registeredUser = yield prisma.user.findUnique({
            where: { phoneNumber },
        });
        // Check if the contact already exists in the logged-in user's contact list
        const existingContact = yield prisma.contact.findFirst({
            where: {
                contactNumber: phoneNumber,
                addedByUserId: loggedInUserId, // Ensure it's specific to this user
            },
        });
        if (existingContact) {
            return res.status(409).json({ message: 'This contact is already in your contact list.' });
        }
        // Create the contact and associate it with the logged-in user
        const newContact = yield prisma.contact.create({
            data: {
                name,
                contactNumber: phoneNumber,
                userId: registeredUser ? registeredUser.id : null, // Set to registered user's ID if they exist
                addedByUserId: loggedInUserId, // Set the user who added this contact
            },
        });
        res.status(201).json({
            message: 'Contact added successfully',
            contact: {
                id: newContact.id,
                name: newContact.name,
                phoneNumber: newContact.contactNumber,
                linkedUserId: registeredUser ? registeredUser.id : null,
                addedByUserId: loggedInUserId,
            },
        });
    }
    catch (error) {
        console.error('Error adding contact:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.addContact = addContact;
const fetchContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loggedInUserId = req.params.id; // ID of the user requesting their contact list
    try {
        // Fetch the contact list for the logged-in user
        const contacts = yield prisma.contact.findMany({
            where: {
                addedByUserId: loggedInUserId,
            },
            select: {
                id: true,
                name: true,
                contactNumber: true,
                userId: true, // Include the user ID associated with the contact
            },
        });
        res.status(200).json({
            message: 'Contact list fetched successfully',
            contacts,
        });
    }
    catch (error) {
        console.error('Error fetching contact list:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.fetchContact = fetchContact;
