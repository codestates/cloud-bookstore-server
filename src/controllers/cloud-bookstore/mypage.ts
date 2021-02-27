import { Request, Response } from 'express';
import Novel from '../../entity/Novel';
import UserHistory from '../../entity/UserHistory';
import UserLike from '../../entity/UserLike';
import UserWork from '../../entity/UserWork';

export default async (req: Request, res: Response): Promise<void> => {
  const userId: number = Number(req.cookies.userId);
  const arrEp = await UserHistory.findAllMyEpisode(userId);
  const data = Promise.all(
    arrEp.map(async (data) => {
      const novelTitle = await Novel.findByNovelId(data.novelId).title;
      const novelThumbnail = await Novel.findByNovelId(data.novelId).thumbnail;
      const episodeId = data.novelEpisodeId;
      const episodeTitle = 
    }),
  );
  res.status(200).send(req.body);
};
