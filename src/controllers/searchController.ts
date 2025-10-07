import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import AppError from './../utils/errors';

const prisma = new PrismaClient();

export const searchContact = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { id } = req.params; 
  const { name, phoneNumber } = req.body;

  try {
    if (!name && !phoneNumber) {
      return next(new AppError("Please provide a name or phone number to search.", 400));
    }

    if (phoneNumber) {
      // Check if the phone number matches a registered user
      const userMatch = await prisma.user.findFirst({
        where: { phoneNumber },
        select: { name: true, phoneNumber: true, email: true },
      });

      if (userMatch) {
        const isInContactList = id
          ? await prisma.contact.findFirst({
              where: { userId: String(id), contactNumber: phoneNumber },
            })
          : null;

        if (!isInContactList) delete (userMatch as any).email;

        return res.json([{ ...userMatch, spam: false }]); // Registered users are not spam
      }

      // Check if the phone number matches a contact
      const contactMatches = await prisma.contact.findMany({
        where: { contactNumber: phoneNumber },
        select: { name: true, contactNumber: true, spam: true },
      });

      if (!userMatch && contactMatches.length === 0) {
        return next(new AppError("No results found for the given phone number", 404));
      }

      return res.json(contactMatches.map((contact) => ({ ...contact, spam: contact.spam || false })));
    }

    if (name) {
      // Find users whose names start with the search term
      const startsWithMatches = await prisma.user.findMany({
        where: { name: { startsWith: name as string } },
        select: { name: true, phoneNumber: true, email: true },
      });

      // Find users whose names contain the search term but do not start with it
      const containsMatches = await prisma.user.findMany({
        where: {
          name: { contains: name as string },
          AND: { name: { not: { startsWith: name as string } } },
        },
        select: { name: true, phoneNumber: true, email: true },
      });

      const results = [...startsWithMatches, ...containsMatches];

      // Add spam status to results
      const finalResults = [];
      for (const result of results) {
        const isInContactList = id
          ? await prisma.contact.findFirst({
              where: { userId: String(id), contactNumber: result.phoneNumber },
            })
          : null;

        if (!isInContactList) delete (result as any).email;

        // Check spam status from the contact table
        const spamStatus = await prisma.contact.findFirst({
          where: { contactNumber: result.phoneNumber },
          select: { spam: true },
        });

        finalResults.push({ ...result, spam: spamStatus?.spam || false });
      }

      return res.json(finalResults);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
