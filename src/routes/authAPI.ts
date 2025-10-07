import express,{Router} from 'express';
import  {login , register} from '../controllers/authController';


const  app : Router = express.Router();

app.post('/login' , login);
app.post('/register' , register);


export default app;