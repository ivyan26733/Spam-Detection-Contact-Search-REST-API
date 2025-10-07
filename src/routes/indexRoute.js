"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authAPI_1 = __importDefault(require("./authAPI"));
const contactAPI_1 = __importDefault(require("./contactAPI"));
const searchAPI_1 = __importDefault(require("./searchAPI"));
const spamAPI_1 = __importDefault(require("./spamAPI"));
const router = (0, express_1.default)();
router.use('/auth', authAPI_1.default);
router.use('/contacts', contactAPI_1.default);
router.use('/search', searchAPI_1.default);
router.use('/spam', spamAPI_1.default);
exports.default = router;
