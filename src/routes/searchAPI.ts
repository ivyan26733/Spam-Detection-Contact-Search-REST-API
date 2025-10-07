import express, { Router } from 'express';
import {searchContact} from '../controllers/searchController';

const app : Router = express.Router();
app.get('/contact/:id', searchContact);
export default app;