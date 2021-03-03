import { Request, Response } from 'express';

export default (req: Request, res: Response): void => {
  res.clearCookie('userId');
  res.status(200).send('Successfully Logout');
};
