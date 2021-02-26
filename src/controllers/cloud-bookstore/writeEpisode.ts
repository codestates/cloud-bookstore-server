import { Request, Response } from 'express';
import Episode from '../../entity/Episode';
import Novel from '../../entity/Novel';

export default async (req: Request, res: Response): Promise<void> => {
  try {
    const episodeNum: number = req.body.episodeNum;
    const novelId: number = req.body.novelId;
    const title: string = req.body.title;
    const text: string = req.body.text;
    const thumbnail: string = req.body.thumbnail;

    const episodes = await Episode.writeEpisode(
      episodeNum,
      novelId,
      title,
      text,
      thumbnail,
    )
      .then(() => Novel.countEpisode(novelId))
      .then(() => Episode.findByNovelId(novelId));

    res.status(200).send({ episodes });
  } catch (err) {
    res.status(500).send(err);
  }
};
