"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const spamController_1 = require("../controllers/spamController");
const app = express_1.default.Router();
app.post('/mark', spamController_1.markSpam);
app.get('/check', spamController_1.checkSpam);
exports.default = app;
