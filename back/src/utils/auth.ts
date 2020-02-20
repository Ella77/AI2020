import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const privateKey = "mypassword";

// jwt
export const jwtSign = (obj: any): string => {
  return jwt.sign(obj, privateKey);
};

export const jwtVerify = (token: string): string | any => {
  return jwt.verify(token, privateKey);
};

// crypt
export const hash = (plainText: string): string  => {
  return crypto.createHash('sha512').update(plainText).digest('base64');
};