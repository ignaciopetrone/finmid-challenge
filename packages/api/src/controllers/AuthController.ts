import { unauthorized } from '@hapi/boom';
import { compareSync } from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from 'src/constants';
import users from 'src/data/users.json';
import { ParsedToken } from 'src/middleware';

const INCORRECT_LOGIN = 'Incorrect login or password';
const TOKEN_LIFE = 20 * 1000;

const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies['authToken'];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as ParsedToken;
    res.status(200).json({ user: decoded.userData });
  } catch (error) {
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

export const AuthController = {
  checkAuth,
  login,
};
