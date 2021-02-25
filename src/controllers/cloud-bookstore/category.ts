import { Request, Response } from 'express';
import Novel from '../../entity/Novel';

export default async (req: Request, res: Response): Promise<void> => {
  try {
    const id: number = Number(req.params.id);

    const data = await Novel.findByCategory(id);

    res.status(200).send({ data });
  } catch (err) {
    res.status(500).send(err);
  }
};
