import {NextFunction, Request,Response} from 'express';
import { PrismaClient } from '@prisma/client';
import {getPasswordValidationErrors } from '../utils/validators';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import AppError from './../utils/errors';

const prisma = new PrismaClient();

// JWT Secret Key
const jwtsecret = process.env.JWT_SECRET;




// Login Route
export const login = async (req: Request, res: Response , next: NextFunction):Promise<any> => {
  const { phoneNumber, password } = req.body;

  try {
    // Validate input
    if (!phoneNumber || !password) {
      return next(new AppError ("Phone number and password are required", 400));
    }

    // Find the user by phoneNumber
    const user = await prisma.user.findUnique({
      where: { phoneNumber },
    });

    if (!user) {
      return next(new AppError("User not found", 404))

    }

    // Check if the provided password matches the stored password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(new AppError("Invalid phone number or password", 401));
     
    }

    //Generate a JWT token
    if (!jwtsecret) {
      throw new Error('JWT_SECRET is not defined');
    }
    const token = jwt.sign({ userId: user.id }, jwtsecret, { expiresIn: '1h' });

    // Send the response
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred during login' });
  }
};


// Signup Route
export const register = async (req:Request, res:Response, next: NextFunction   ): Promise<any> => {
  const { name, phoneNumber, email, password } = req.body;

  try {
    // Validate input
    if (!phoneNumber || !password || !name) {
      return next(new AppError ("All fields are required", 400));
    }

    const errors = getPasswordValidationErrors(password);
    if (errors.length > 0) {
      return res.status(400).json({
        error: {
          message: 'Password validation failed',
          details: errors,
        },
      });
    }    

    // Check if the phone number or email is already registered
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ phoneNumber }],
      },
    });

    if (existingUser) {
      return res.status(409).json({ error: 'Phone number already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user in the database
    const newUser = await prisma.user.create({
      data: {
        phoneNumber,
        password: hashedPassword,
        name,
        email: email || null,
      },
    });

    // Update all contacts with the newly registered phone number
    await prisma.contact.updateMany({
      where: { contactNumber: phoneNumber }, // Update contacts with the same phone number
      data: { userId: newUser.id }, // Set the user ID for the contacts
    });

    // Send success response
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
      },
    });
  } catch (error) {
    next(error);
  }
};
