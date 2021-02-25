import { Request, Response, NextFunction } from 'express';
import Novel from '../../entity/Novel';

export default async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const ranking = await Novel.findOne({ id: 1 });
    res.status(200).send({ ranking });
  } catch (err) {
    next(err);
  }
};
