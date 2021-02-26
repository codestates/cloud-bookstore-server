import { Request, Response } from 'express';
import NovelComment from '../../entity/NovelComment';

export default async (req: Request, res: Response): Promise<void> => {
  try {
    const nickname: string = req.body.nickname;
    const comment: string = req.body.comment;
    const novelId: number = req.body.novelId;
    const comments = await NovelComment.commentNovel(
      nickname,
      comment,
      novelId,
    ).then(() => NovelComment.findByNovelId(novelId));

    res.status(200).send({ comments });
  } catch (err) {
    res.status(500).send(err);
  }
};
