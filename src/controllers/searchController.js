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
exports.searchContact = void 0;
const client_1 = require("@prisma/client");
const errors_1 = __importDefault(require("./../utils/errors"));
const prisma = new client_1.PrismaClient();
const searchContact = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, phoneNumber } = req.body;
    try {
        if (!name && !phoneNumber) {
            return next(new errors_1.default("Please provide a name or phone number to search.", 400));
        }
        if (phoneNumber) {
            // Check if the phone number matches a registered user
            const userMatch = yield prisma.user.findFirst({
                where: { phoneNumber },
                select: { name: true, phoneNumber: true, email: true },
            });
            if (userMatch) {
                const isInContactList = id
                    ? yield prisma.contact.findFirst({
                        where: { userId: String(id), contactNumber: phoneNumber },
                    })
                    : null;
                if (!isInContactList)
                    delete userMatch.email;
                return res.json([Object.assign(Object.assign({}, userMatch), { spam: false })]); // Registered users are not spam
            }
            // Check if the phone number matches a contact
            const contactMatches = yield prisma.contact.findMany({
                where: { contactNumber: phoneNumber },
                select: { name: true, contactNumber: true, spam: true },
            });
            if (!userMatch && contactMatches.length === 0) {
                return next(new errors_1.default("No results found for the given phone number", 404));
            }
            return res.json(contactMatches.map((contact) => (Object.assign(Object.assign({}, contact), { spam: contact.spam || false }))));
        }
        if (name) {
            // Find users whose names start with the search term
            const startsWithMatches = yield prisma.user.findMany({
                where: { name: { startsWith: name } },
                select: { name: true, phoneNumber: true, email: true },
            });
            // Find users whose names contain the search term but do not start with it
            const containsMatches = yield prisma.user.findMany({
                where: {
                    name: { contains: name },
                    AND: { name: { not: { startsWith: name } } },
                },
                select: { name: true, phoneNumber: true, email: true },
            });
            const results = [...startsWithMatches, ...containsMatches];
            // Add spam status to results
            const finalResults = [];
            for (const result of results) {
                const isInContactList = id
                    ? yield prisma.contact.findFirst({
                        where: { userId: String(id), contactNumber: result.phoneNumber },
                    })
                    : null;
                if (!isInContactList)
                    delete result.email;
                // Check spam status from the contact table
                const spamStatus = yield prisma.contact.findFirst({
                    where: { contactNumber: result.phoneNumber },
                    select: { spam: true },
                });
                finalResults.push(Object.assign(Object.assign({}, result), { spam: (spamStatus === null || spamStatus === void 0 ? void 0 : spamStatus.spam) || false }));
            }
            return res.json(finalResults);
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.searchContact = searchContact;
