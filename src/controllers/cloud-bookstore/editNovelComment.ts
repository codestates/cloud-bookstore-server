import { Request, Response } from 'express';
import NovelComment from '../../entity/NovelComment';
import User from '../../entity/User';

export default async (req: Request, res: Response): Promise<void> => {
  try {
    const userId: number = +req.cookies.userId;
    const novelId: number = req.body.data.novelId;
    const commentId: number = req.body.data.commentId;
    const comment: string = req.body.data.comment;

    if (!userId) {
      res.status(401).send('unauthorized');
    } else {
      const nickname = await User.findNickname(userId).then(
        (data) => data.user_nickname,
      );

      await NovelComment.checkValidity(nickname, commentId).then(
        async (data) => {
          if (!data) {
            res.status(200).send('unauthorized');
          } else {
            const comments = await NovelComment.editComment(
              commentId,
              comment,
            ).then(() => NovelComment.findByNovelId(novelId));

            res.status(200).send({ message: 'successfully edited', comments });
          }
        },
      );
    }
  } catch (err) {
    res.status(500).send(err);
  }
};
