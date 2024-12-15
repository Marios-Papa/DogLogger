import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../config/logger';

interface DecodedToken {
  id: number;
  isAdmin: boolean;
}

export const authMiddleware: RequestHandler = (req, res, next) => {
  let token: string | undefined;
  logger.info('Cookies in request:', req.cookies);

  // Check Authorization header for Bearer token
  const header = req.headers['authorization'];
  if (header && header.startsWith('Bearer ')) {
    token = header.split(' ')[1];
  }

  // Fallback to cookies if no Authorization header is found
  if (!token) {
    token = req.cookies?.authToken;
  }

  // If no token is found, respond with 401
  if (!token) {
    res.status(401).json({ error: 'Authentication required. No token provided.' });
    logger.error('No token provided.');
    return;
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as DecodedToken;

    // Attach decoded token to request object for further use
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token.' });
    logger.error('Error verifying token:', error);
  }
};
