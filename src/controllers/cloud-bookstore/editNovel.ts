import { Request, Response } from 'express';
import Novel from '../../entity/Novel';

export default async (req: Request, res: Response): Promise<void> => {
  try {
    const id: number = req.body.id;
    const title: string = req.body.title;
    const category: number = req.body.category;
    const description: string = req.body.description;
    const thumbnail: string = req.body.thumbnail;

    await Novel.editNovel(id, title, category, description, thumbnail)
      .then(() => Novel.findByNovelId(id))
      .then((data) => res.status(200).send({ data }));
  } catch (err) {
    res.status(500).send(err);
  }
};
