import { Request, Response } from 'express';
import Novel from '../../entity/Novel';
import Episode from '../../entity/Episode';
import UserHistory from '../../entity/UserHistory';
import UserLike from '../../entity/UserLike';
import UserWork from '../../entity/UserWork';

export default async (req: Request, res: Response): Promise<void> => {
  if (!req.cookies.userId) {
    res.status(401).send('Unauthorized');
  } else {
    try {
      const userId = req.cookies.userId;
      const episodes = await UserHistory.findAllMyEpisode(userId);
      const userHistories = await Promise.all(
        episodes.map(async (ele) => {
          let novels = await Novel.findByNovelHis(ele.novelId);
          let episodes = await Episode.findByEpisodeHis(ele.novelEpisodeId);
          return { novels, episodes };
        }),
      );
      const likes = await UserLike.findByUserId(userId);
      const userLikes = await Promise.all(
        likes.map(async (ele) => {
          return await Novel.findByNovelId(ele.novelId);
        }),
      );
      const works = await UserWork.getMyNovelList(userId);
      const userWorks = await Promise.all(
        works.map(async (ele) => {
          return await Novel.findByNovelId(ele.novelId);
        }),
      );

      res.status(200).send({ userHistories, userLikes, userWorks });
    } catch (err) {
      res.status(500).send(err);
    }
  }
};
