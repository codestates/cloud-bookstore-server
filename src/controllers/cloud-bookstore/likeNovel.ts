import { Request, Response } from 'express';
import Novel from '../../entity/Novel';

export default async (req: Request, res: Response): Promise<void> => {
  try {
    const id: number = Number(req.params.novelId);
    const userLike = await Novel.likeNovel(id);

    res.status(200).send(userLike);
  } catch (err) {
    res.status(500).send(500);
  }
};
