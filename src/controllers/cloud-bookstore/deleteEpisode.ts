import { Request, Response } from 'express';
import UserWork from '../../entity/UserWork';
import Novel from '../../entity/Novel';
import CloudHistory from '../../entity/CloudHistory';
import Episode from '../../entity/Episode';
import Purchase from '../../entity/Purchase';
import UserHistory from '../../entity/UserHistory';

export default async (req: Request, res: Response): Promise<void> => {
  const episodeId: number = +req.params.episodeId;
  const novelId: number = +req.params.novelId;
  const userId: number = +req.cookies.userId;
  try {
    const isMyWork = await UserWork.findByNovelIdWithUserId(userId, novelId);
    if (isMyWork === undefined) {
      res.status(401).send('이 소설의 저자가 아닙니다');
    } else {
      await Episode.deleteEpisode(episodeId);
      await CloudHistory.deleteEpisodeIdOfCloudHistory(episodeId);
      await Novel.episodeCountDawn(novelId);
      await Purchase.deleteNovel(episodeId);
      await UserHistory.deleteEpisode(episodeId);
      res.status(200).send('Successfully delete');
    }
  } catch (err) {
    res.status(500).send(err);
  }
};
