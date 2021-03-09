import { Request, Response } from 'express';
import Episode from '../../entity/Episode';

export default async (req: Request, res: Response): Promise<void> => {
  try {
    const userId: number = req.cookies.userId;
    const episodeId: number = req.body.id;
    const title: string = req.body.title;
    const category: string = req.body.category;
    const description: string = req.body.description;
    const thumbnail: string = req.body.thumbnail;

    const novelId: number = await Episode.findByOnlyEpisodeId(userId);
  } catch (err) {
    res.status(500).send(err);
  }
};
