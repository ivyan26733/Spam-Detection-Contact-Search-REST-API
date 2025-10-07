import express, { Router } from 'express';
import {addContact , fetchContact} from '../controllers/addContactController';

const app : Router = express.Router();
app.post('/add-contact/:id', addContact);
app.get('/fetch-contacts/:id', fetchContact);
export default app;