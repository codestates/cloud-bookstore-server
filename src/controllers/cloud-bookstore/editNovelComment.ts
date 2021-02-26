import { Request, Response } from 'express';

import NovelComment from '../../entity/NovelComment';

export default async (req: Request, res: Response): Promise<void> => {
  try {
    const novelId: number = req.body.novelId;
    const commentId: number = req.body.commentId;
    const comment: string = req.body.comment;

    const comments = await NovelComment.editComment(
      commentId,
      comment,
    ).then(() => NovelComment.findByNovelId(novelId));

    res.status(200).send({ message: 'successfully edited', comments });
  } catch (err) {
    res.status(500).send(err);
  }
};
