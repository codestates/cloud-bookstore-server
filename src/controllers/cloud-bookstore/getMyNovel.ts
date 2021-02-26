import { Request, Response } from 'express';
import Episode from '../../entity/Episode';

export default async (req: Request, res: Response): Promise<void> => {
  try {
    const novelId: number = +req.params.novelId;

    const episodes = await Episode.findByNovelId(novelId);

    res.status(200).send({ episodes });
  } catch (err) {
    res.status(500).send(err);
  }
};
