import express from 'express';
import routes from './routes/indexRoute'; 
import authMiddleware from './middlwares/authMiddleware'; 
import errorMiddleware from './middlwares/errorMiddleware'; 
import AppError from './utils/errors';


const app = express();

// Middleware to parse JSON requests
app.use(express.json());


// Public Routes (e.g., Authentication)
app.use('/api', routes); 


// Protected Routes
app.use('/api/protected', authMiddleware, routes); 



app.all('*', (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

app.use(errorMiddleware); // Error handling middleware



// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
