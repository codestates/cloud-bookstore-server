import { Request, Response } from 'express';
import User from '../../entity/User';
import Novel from '../../entity/Novel';
import NovelComment from '../../entity/NovelComment';

export default async (req: Request, res: Response): Promise<void> => {
  try {
    const userId: number = +req.cookies.userId;
    const nickname: string = req.body.nickname;

    const originalAuthorName = await User.findNickname(userId).then(
      (data) => data.user_nickname,
    );

    await User.checkNicknameAvailability(nickname).then(async (data) => {
      if (!data) {
        await User.editNickname(userId, nickname)
          .then(
            async () => await Novel.editNickname(originalAuthorName, nickname),
          )
          .then(
            async () =>
              await NovelComment.editNickname(originalAuthorName, nickname),
          )
          .then(() => res.status(200).send('successfully updated'));
      } else {
        res.status(409).send('Duplicate nickname exists');
      }
    });
  } catch (err) {
    res.status(500).send(err);
  }
};
