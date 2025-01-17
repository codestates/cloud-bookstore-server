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
        userHistory: [],
        userLike: false,
        userPurchases: [],
      });
    } else {
      const data = await Novel.findByNovelId(novelId);
      const episodes = await Episode.findByNovelId(novelId);
      const comments = await NovelComment.findByNovelId(novelId);
      const userLike = await UserLike.findByNovelId(userId, novelId);
      const userPurchases = await Purchase.findByNovelId(userId, novelId);
      const userHistory = await UserHistory.findByNovelId(userId, novelId);

      if (userHistory.length !== 0) {
        const episodeDetail = await Episode.findByEpisodeHis(
          userHistory[0].novelEpisodeId,
        );
        if (userId && userLike) {
          res.status(200).send({
            data,
            episodes,
            comments,
            userHistory: { userHistory, episodeDetail },
            userLike: true,
            userPurchases,
          });
        } else if (userId && !userLike) {
          res.status(200).send({
            data,
            episodes,
            comments,
            userHistory: { userHistory, episodeDetail },
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
            userHistory,
            userLike: true,
            userPurchases,
          });
        } else if (userId && !userLike) {
          res.status(200).send({
            data,
            episodes,
            comments,
            userHistory,
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
