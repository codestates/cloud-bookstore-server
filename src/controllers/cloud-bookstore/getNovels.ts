import { Request, Response } from 'express';
import Novel from '../../entity/Novel';

export default async (req: Request, res: Response): Promise<void> => {
  try {
    const ranking = await Novel.findRanking8();
    const fantasy = await Novel.findFantasy8();
    const martialArts = await Novel.findMartialarts8();
    const romance = await Novel.findRomance8();

    res.status(200).send({ ranking, fantasy, martialArts, romance });
  } catch (err) {
    res.status(500).send(err);
  }
};
