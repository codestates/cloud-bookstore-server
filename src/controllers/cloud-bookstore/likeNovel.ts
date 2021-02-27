import { Request, Response } from 'express';
import Novel from '../../entity/Novel';
import UserLike from '../../entity/UserLike';

export default async (req: Request, res: Response): Promise<void> => {
  try {
    const novelId: number = +req.params.novelId;
    const userId: number = +req.cookies.userId;

    if (userId) {
      await UserLike.addLikes(userId, novelId)
        .then(async () => await Novel.likeNovel(novelId))
        .then((data) => res.status(200).send(data));
    } else {
      res.status(401).send('unauthorized');
    }
  } catch (err) {
    res.status(500).send(500);
  }
};
