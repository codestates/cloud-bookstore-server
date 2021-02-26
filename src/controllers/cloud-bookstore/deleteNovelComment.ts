import { Request, Response } from 'express';

import NovelComment from '../../entity/NovelComment';

export default async (req: Request, res: Response): Promise<void> => {
  try {
    const novelId: number = Number(req.params.novelId);
    const commentId: number = Number(req.params.commentId);

    const comments = await NovelComment.deleteComment(commentId).then(() =>
      NovelComment.findByNovelId(novelId),
    );

    res.status(200).send({ message: 'successfully deleted', comments });
  } catch (err) {
    res.status(500).send(err);
  }
};
