import { Request, Response } from 'express';
import { z } from 'zod';
import users from 'src/data/users.json';
import { validateRequest } from 'src/lib/validation';

const getUsers = async (req: Request, res: Response) => {
  const smeId = req.body.userData.smeId;
  const smeUsers = users
    .filter((user) => user.smeId === smeId)
    .map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
    }));

  res.status(200).json(smeUsers);
};

const getUserName = async (req: Request, res: Response) => {
  const getUserValidation = z.object({
    query: z.object({ userId: z.string() }),
  });

  const {
    query: { userId },
  } = validateRequest(getUserValidation, req);

  const userName = users
    .filter((user) => user.id === userId)
    .map((user) => user.name);

  res.status(200).json(userName);
};

export const UsersController = {
  getUsers,
  getUserName,
};
