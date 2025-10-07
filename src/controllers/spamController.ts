import { NextFunction, Request, Response} from 'express';
import { PrismaClient } from '@prisma/client';
import AppError from '../utils/errors';

const prisma = new PrismaClient();

export const markSpam = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { contactNumber } = req.body;
  
    if (!contactNumber || contactNumber.length !== 10) {
      return next(new AppError('Number is required', 400));
    }
  
    try {
      // Check if the number exists globally (in the `Contact` or `User` table)
      const numberInContact = await prisma.contact.findUnique({
        where: {
          contactNumber,
        },
      });
  
      const numberInUser = await prisma.user.findFirst({
        where: {
          phoneNumber: contactNumber,
        },
        select: { id: true }, // Select only the user ID
      });
  
      // If the number is in the `Contact` table
      if (numberInContact) {
        if (numberInContact.spam === true) {
          return next(new AppError('This number is already marked as spam', 400));
        }
  
        // Update spam status
        await prisma.contact.update({
          where: {
            contactNumber,
          },
          data: {
            spam: true,
          },
        });
  
        return res.status(200).json({
          message: 'Number marked as spam successfully',
        });
      }
  
      // If the number is not in `Contact`, check if it's registered in `User`
      if (numberInUser) {
        // Update spam status
        await prisma.contact.create({
          data: {
            name: 'Unknown', 
            contactNumber,
            userId: numberInUser.id,
            spam: true,
          },
        });
  
        return res.status(200).json({
          message: 'Number marked as spam successfully',
        });
      }
  
      // If the number is neither in `Contact` nor `User`, create a new contact entry and mark as spam
      await prisma.contact.create({
        data: {
          name: 'Unknown', 
          contactNumber,
          spam: true,
        },
      });
  
      return res.status(200).json({
        message: 'Number marked as spam successfully',
      });
    } catch (error) {
      console.error('Error marking number as spam:', error);
      return res.status(500).json({
        message: 'Internal server error',
      });
    }
  };  
  
// check spam
export const checkSpam =  async (req: Request, res: Response,next:NextFunction): Promise<any> => {
    const { contactNumber } = req.body;
    if (!contactNumber) {
        return next(new AppError('Number is required', 400));
     
    }
    const number = await prisma.contact.findUnique({
        where: {
            contactNumber
        }
    });

    if (!number) {
        return next(new AppError('Number not found', 400));
      
    }

    if (number?.spam == true) {
        return next(new AppError('This number is marked as spam', 200));
       
    } else {
        return next(new AppError('This number is not marked as spam', 200));
      
    }
};