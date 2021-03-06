import { Request, Response } from 'express';
import Novel from '../../entity/Novel';
import UserLike from '../../entity/UserLike';

export default async (req: Request, res: Response): Promise<void> => {
  try {
    const userId: number = +req.cookies.userId;
    const novelId: number = +req.params.novelId;

    if (userId) {
      const validation = await UserLike.findByNovelId(userId, novelId);
      if (validation) {
        await UserLike.deleteUserLike(userId, novelId)
          .then(() => Novel.disLikeNovel(novelId))
          .then((data) => res.status(200).send(data));
      } else {
        await UserLike.addLikes(userId, novelId)
          .then(() => Novel.likeNovel(novelId))
          .then((data) => res.status(200).send(data));
      }
    } else {
      res.status(401).send('unauthorized');
    }
  } catch (err) {
    res.status(500).send(err);
  }
};
