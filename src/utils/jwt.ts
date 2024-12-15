import jwt from 'jsonwebtoken';

export const generateToken = (userId: number, isAdmin: boolean) => {
  return jwt.sign({ userId, isAdmin }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '1d'
  });
};
