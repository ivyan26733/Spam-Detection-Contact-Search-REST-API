import express, { Router } from 'express';
import {markSpam , checkSpam} from '../controllers/spamController';

const app : Router = express.Router();
app.post('/mark', markSpam);
app.get('/check', checkSpam);
export default app;