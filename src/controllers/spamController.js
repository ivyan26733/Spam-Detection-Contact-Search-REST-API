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
exports.checkSpam = exports.markSpam = void 0;
const client_1 = require("@prisma/client");
const errors_1 = __importDefault(require("../utils/errors"));
const prisma = new client_1.PrismaClient();
const markSpam = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { contactNumber } = req.body;
    if (!contactNumber || contactNumber.length !== 10) {
        return next(new errors_1.default('Number is required', 400));
    }
    try {
        // Check if the number exists globally (in the `Contact` or `User` table)
        const numberInContact = yield prisma.contact.findUnique({
            where: {
                contactNumber,
            },
        });
        const numberInUser = yield prisma.user.findFirst({
            where: {
                phoneNumber: contactNumber,
            },
            select: { id: true }, // Select only the user ID
        });
        // If the number is in the `Contact` table
        if (numberInContact) {
            if (numberInContact.spam === true) {
                return next(new errors_1.default('This number is already marked as spam', 400));
            }
            // Update spam status
            yield prisma.contact.update({
                where: {
                    contactNumber,
                },
                data: {
                    spam: true,
                },
            });
            return res.status(200).json({
                message: 'Number marked as spam successfully',
            });
        }
        // If the number is not in `Contact`, check if it's registered in `User`
        if (numberInUser) {
            // Update spam status
            yield prisma.contact.create({
                data: {
                    name: 'Unknown',
                    contactNumber,
                    userId: numberInUser.id,
                    spam: true,
                },
            });
            return res.status(200).json({
                message: 'Number marked as spam successfully',
            });
        }
        // If the number is neither in `Contact` nor `User`, create a new contact entry and mark as spam
        yield prisma.contact.create({
            data: {
                name: 'Unknown',
                contactNumber,
                spam: true,
            },
        });
        return res.status(200).json({
            message: 'Number marked as spam successfully',
        });
    }
    catch (error) {
        console.error('Error marking number as spam:', error);
        return res.status(500).json({
            message: 'Internal server error',
        });
    }
});
exports.markSpam = markSpam;
// check spam
const checkSpam = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { contactNumber } = req.body;
    if (!contactNumber) {
        return next(new errors_1.default('Number is required', 400));
    }
    const number = yield prisma.contact.findUnique({
        where: {
            contactNumber
        }
    });
    if (!number) {
        return next(new errors_1.default('Number not found', 400));
    }
    if ((number === null || number === void 0 ? void 0 : number.spam) == true) {
        return next(new errors_1.default('This number is marked as spam', 200));
    }
    else {
        return next(new errors_1.default('This number is not marked as spam', 200));
    }
});
exports.checkSpam = checkSpam;
