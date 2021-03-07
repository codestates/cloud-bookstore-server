import { Request, Response } from 'express';
import Novel from '../../entity/Novel';
import Episode from '../../entity/Episode';
import NovelComment from '../../entity/NovelComment';
import UserHistory from '../../entity/UserHistory';
import UserLike from '../../entity/UserLike';
import Purchase from '../../entity/Purchase';

export default async (req: Request, res: Response): Promise<void> => {
  try {
    const userId: number = +req.cookies.userId;
    const novelId: number = +req.params.novelId;

    if (!userId) {
      const data = await Novel.findByNovelId(novelId);
      const episodes = await Episode.findByNovelId(novelId);
      const comments = await NovelComment.findByNovelId(novelId);
      res.status(200).send({
        data,
        episodes,
        comments,
      });
    } else {
      const data = await Novel.findByNovelId(novelId);
      const episodes = await Episode.findByNovelId(novelId);
      const comments = await NovelComment.findByNovelId(novelId);
      const userHistory = await UserHistory.findByNovelId(userId, novelId);
      const userLike = await UserLike.findByNovelId(userId, novelId);
      const userPurchases = await Purchase.findByNovelId(userId, novelId);

      if (userHistory) {
        const episodeDetail = await Episode.findByEpisodeHis(
          userHistory.novelEpisodeId,
        );
        if (userId && userLike) {
          res.status(200).send({
            data,
            episodes,
            comments,
            userHistory: { ...episodeDetail, ...userHistory },
            userLike: true,
            userPurchases,
          });
        } else if (userId && !userLike) {
          res.status(200).send({
            data,
            episodes,
            comments,
            userHistory: { ...episodeDetail, ...userHistory },
            userLike: false,
            userPurchases,
          });
        }
      } else {
        if (userId && userLike) {
          res.status(200).send({
            data,
            episodes,
            comments,
            userHistory: {
              id: 0,
              episodeNum: 0,
              title: 'null',
              thumbnail: 'null',
              cloud: 0,
              novelEpisodeId: 0,
              updatedAt: 'null',
            },
            userLike: true,
            userPurchases,
          });
        } else if (userId && !userLike) {
          res.status(200).send({
            data,
            episodes,
            comments,
            userHistory: {
              id: 0,
              episodeNum: 0,
              title: 'null',
              thumbnail: 'null',
              cloud: 0,
              novelEpisodeId: 0,
              updatedAt: 'null',
            },
            userLike: false,
            userPurchases,
          });
        }
      }
    }
  } catch (err) {
    res.status(500).send(err);
  }
};
