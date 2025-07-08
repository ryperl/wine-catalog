import jwt from 'jsonwebtoken';
import { IJWTPayload } from '../types';

export const generateToken = (payload: IJWTPayload): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  // Use any to bypass TypeScript strict typing
  return (jwt as any).sign(payload, secret, { expiresIn: '7d' });
};

export const verifyToken = (token: string): IJWTPayload => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  try {
    const decoded = jwt.verify(token, secret) as IJWTPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};
