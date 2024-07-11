import jwt from 'jsonwebtoken';
import { Response } from 'express';

const generateToken = (userId: string, res: Response , isLogout:boolean) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: '15d',
  });
  res.cookie('jwt', token, {
    domain: 'localhost',   
    path: '/',            
    httpOnly: true,        
    sameSite: 'strict',       
    secure: false,         
    expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // Token expiration time (15 days)
  });

  return token;
};

export default generateToken;
