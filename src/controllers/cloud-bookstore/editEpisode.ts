import { Request, Response } from 'express';
import Novel from '../../entity/Novel';
import Episode from '../../entity/Episode';
import UserWork from '../../entity/UserWork';

export default async (req: Request, res: Response): Promise<void> => {
  try {
    const userId: number = req.cookies.userId;
    const episodeId: number = req.body.id;
    const novelId: number = req.body.novelId;
    const episodeNum: number = req.body.episodeNum;
    const thumbnail: string = req.body.thumbnail;
    const title: string = req.body.title;
    const text: string = req.body.text;
    const complete: boolean = req.body.complete;

    const isMyWork = await UserWork.findByNovelIdWithUserId(userId, novelId);

    if (isMyWork === undefined) {
      res.status(401).send('이 소설의 저자가 아닙니다');
    } else {
      await Novel.completeNovel(novelId, complete);
      await Episode.editEpisode(episodeId, episodeNum, thumbnail, title, text);
      const episodes = await Episode.findByNovelId(novelId);
      const currentEpisode = await Episode.findByEpisodeId(episodeId, novelId);
      res
        .status(200)
        .send({ episodes, currentEpisode, novelComplete: complete });
    }
  } catch (err) {
    res.status(500).send(err);
  }
};
