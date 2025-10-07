import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client'; 

const { verify } = jwt;
const prisma = new PrismaClient();
const secretKey = process.env.JWT_SECRET as any; 

// Middleware to verify JWT 
const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token synchronously or wrap in a promise
    const decoded = verify(token, secretKey) as any;

    // Fetch user from database
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

     (req as any).user = user; // Attach the user to the request
    next(); // Proceed to the next middleware

  } catch (err) {
    console.error(err);
    return res.status(403).json({ message: 'Token is not valid' });
  }
};

export default authenticateToken;
