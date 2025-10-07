"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const addContactController_1 = require("../controllers/addContactController");
const app = express_1.default.Router();
app.post('/add-contact/:id', addContactController_1.addContact);
app.get('/fetch-contacts/:id', addContactController_1.fetchContact);
exports.default = app;
