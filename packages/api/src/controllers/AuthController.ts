import { unauthorized } from '@hapi/boom';
import { compareSync } from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from 'src/constants';
import users from 'src/data/users.json';
import { ParsedToken } from 'src/middleware';

const INCORRECT_LOGIN = 'Incorrect login or password';
const TOKEN_LIFE = 10 * 60 * 1000;

const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies['authToken'];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as ParsedToken;
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      throw unauthorized('Token expired');
    }
    res.status(200).json({ user: decoded.userData });
  } catch (error: any) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = users.find((user) => user.email === email);

  try {
    if (!user) {
      throw unauthorized(INCORRECT_LOGIN);
    } else if (!compareSync(password, user.password)) {
      throw unauthorized(INCORRECT_LOGIN);
    } else {
      const { password, ...userData } = user;
      const token = jwt.sign({ userData }, SECRET_KEY, {
        expiresIn: TOKEN_LIFE.toString(),
      });

      res.cookie('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: TOKEN_LIFE,
      });

      res.status(200).json({ user: userData });
    }
  } catch (error) {
    next(error);
  }
};

const logout = (req: Request, res: Response) => {
  // Clear the cookie by setting its expiration date to the past
  res.cookie('authToken', '', {
    maxAge: -1,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });

  // Send a success response
  res.status(200).json({ message: 'Successfully logged out' });
};

export const AuthController = {
  checkAuth,
  login,
  logout,
};
