import jwt from 'jsonwebtoken';
import { Response } from 'express';

const generateToken = (userId: string, res: Response, isLogout: boolean) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: '15d',
  });

  res.cookie('jwt', token, {
    domain: '192.168.0.100',  // Use the IP address or omit for local network
    path: '/',
    httpOnly: true,
    sameSite: 'lax',  // 'lax' is more permissive than 'strict', which may help with cross-site requests
    secure: false,  // Set to true if using HTTPS
    expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // Token expiration time (15 days)
  });

  return token;
};

export default generateToken;
