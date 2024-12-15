// src/controllers/user.controller.ts

import { Request, Response } from 'express';
import User from '../models/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import logger from '../config/logger';

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Check for missing fields
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required.' });
      logger.error('Email and password are required.');
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(409).json({ error: 'User with this email already exists.' });
      logger.error('User with this email already exists.');
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const user = await User.create({ email, password: hashedPassword, isAdmin: false });

    // Exclude password from the response
    const { password: _, ...safeUser } = user.toJSON();

    // Respond with the created user
    res.status(201).json(safeUser);
    logger.info('User created:', safeUser);
  } catch (error: unknown) {
    // Handle unexpected errors
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
      logger.error('Error creating user:', error);
    } else {
      res.status(500).json({ error: 'An unknown error occurred.' });
      logger.error('Error creating user:', error);
    }
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Validate user credentials
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ error: 'Invalid credentials' });
      logger.error('Invalid credentials');
      return;
    }

    // Generate a JWT
    const token = jwt.sign(
      { id: user.id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || 'secret', // Ensure JWT_SECRET is set in environment variables
      { expiresIn: '1h' }
    );

    // Set the token as an HTTP-only cookie
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'lax', // Adjust sameSite policy as needed
      path: '/',
      maxAge: 3600000, // 1 hour in milliseconds
    });

    // Respond with a success message
    res.status(200).json({ message: 'Login successful' });
    logger.info('User logged in:', { id: user.id, email: user.email, isAdmin: user.isAdmin });
  } catch (error: unknown) {
    // Handle unexpected errors
    res.status(500).json({ error: 'Internal server error' });
    logger.error('Error logging in:', error);
  }
};
