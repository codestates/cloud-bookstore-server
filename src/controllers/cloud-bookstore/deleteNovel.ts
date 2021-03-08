import { Request, Response } from 'express';

export default async (req: Request, res: Response): Promise<void> => {
  try {
    res.status(200).send(req.body);
  } catch (err) {
    res.status(500).send(err);
  }
};
