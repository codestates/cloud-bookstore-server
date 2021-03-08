import { Request, Response } from 'express';
import Novel from '../../entity/Novel';
import NovelComment from '../../entity/NovelComment';
import Episode from '../../entity/Episode';
import UserWork from '../../entity/UserWork';
import User from '../../entity/User';
import UserLike from '../../entity/UserLike';
import Purchase from '../../entity/Purchase';

export default async (req: Request, res: Response): Promise<void> => {
  try {
    const userId: number = +req.cookies.userId;
    const novelId: number = +req.params.novelId;

    await Episode.findByNovelId(novelId)
      .then(
        async (data) =>
          await Promise.all(
            data.map((purchase: any) => Purchase.deleteNovel(purchase.id)),
          ),
      )
      .then(() => {
        NovelComment.deleteNovel(novelId);
        Episode.deleteNovel(novelId);
      })
      .then(() => Novel.deleteNovel(novelId))
      .then(async () => {
        await UserWork.deleteNovel(novelId);
        await UserLike.deleteNovel(novelId);
        const author = await User.findNickname(userId).then(
          (info) => info.user_nickname,
        );
        const remainingWorks = await Novel.findAllNovelsByUser(author);
        res.status(200).send({ remainingWorks });
      });
  } catch (err) {
    res.status(500).send(err);
  }
};
