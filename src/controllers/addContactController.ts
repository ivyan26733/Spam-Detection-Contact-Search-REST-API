import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import AppError from '../utils/errors';

const prisma = new PrismaClient();

export const addContact =  async (req: Request, res: Response,next:NextFunction): Promise<any> => {
    const loggedInUserId = req.params.id; // ID of the user adding the contact
    const { name, phoneNumber } = req.body;
  
    if (!name || !phoneNumber) {
      return next(new AppError('Name and phone number are required.', 400));
    
    }
  
    try {
      // Check if the phone number belongs to a registered user
      const registeredUser = await prisma.user.findUnique({
        where: { phoneNumber },
      });
  
      // Check if the contact already exists in the logged-in user's contact list
      const existingContact = await prisma.contact.findFirst({
        where: {
          contactNumber: phoneNumber,
          addedByUserId: loggedInUserId, // Ensure it's specific to this user
        },
      });
  
      if (existingContact) {
        return res.status(409).json({ message: 'This contact is already in your contact list.' });
      
      }
  
      // Create the contact and associate it with the logged-in user
      const newContact = await prisma.contact.create({
        data: {
          name,
          contactNumber: phoneNumber,
          userId: registeredUser ? registeredUser.id : null, // Set to registered user's ID if they exist
          addedByUserId: loggedInUserId, // Set the user who added this contact
        },
      });
  
      res.status(201).json({
        message: 'Contact added successfully',
        contact: {
          id: newContact.id,
          name: newContact.name,
          phoneNumber: newContact.contactNumber,
          linkedUserId: registeredUser ? registeredUser.id : null,
          addedByUserId: loggedInUserId,
        },
      });
    } catch (error) {
      console.error('Error adding contact:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };



export const fetchContact =  async (req: Request, res: Response): Promise<void> => {
    const loggedInUserId = req.params.id; // ID of the user requesting their contact list
  
    try {
      // Fetch the contact list for the logged-in user
      const contacts = await prisma.contact.findMany({
        where: {
          addedByUserId: loggedInUserId,
        },
        select: {
          id: true,
          name: true,
          contactNumber: true,
          userId: true, // Include the user ID associated with the contact
        },
      });
  
      res.status(200).json({
        message: 'Contact list fetched successfully',
        contacts,
      });
    } catch (error) {
      console.error('Error fetching contact list:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
