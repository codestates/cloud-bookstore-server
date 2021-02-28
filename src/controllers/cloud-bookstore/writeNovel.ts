import { Request, Response } from 'express';
import Novel from '../../entity/Novel';
import UserWork from '../../entity/UserWork';
import User from '../../entity/User';

export default async (req: Request, res: Response): Promise<void> => {
  try {
    const userId: number = +req.cookies.userId;
    const title: string = req.body.title;
    const category: number = req.body.category;
    const description: string = req.body.description;
    const thumbnail: string = req.body.thumbnail;

    const author = await User.findNickname(userId).then(
      (user) => user.user_nickname,
    );

    const novels = await Novel.writeNovel(
      title,
      author,
      category,
      description,
      thumbnail,
    )
      .then((data) => UserWork.saveMyNovel(userId, data.identifiers[0].id))
      .then(() => Novel.findAllNovelsByUser(author));

    res.status(200).send({ novels });
  } catch (err) {
    res.status(500).send(err);
  }
};
