import { Request, Response } from 'express';
import CloudHistory from '../../entity/CloudHistory';
import Novel from '../../entity/Novel';
import Episode from '../../entity/Episode';

export default async (req: Request, res: Response): Promise<void> => {
  try {
    const userId: number = +req.cookies.userId;
    const date: string = req.body.date; // `2020-02-27`

    const data = await CloudHistory.getCloudHistories(userId).then(
      async (histories) =>
        await Promise.all(histories.filter((history) => history.cloud < 0))
          .then(
            async (results) =>
              await Promise.all(
                results.map(async (result) => {
                  let title = await Novel.findByNovelIdTitleOnly(
                    result.novelId,
                  );
                  let episode = await Episode.findByEpisodeHis(
                    result.novelEpisodeId,
                  );
                  let date = result.updatedAt;
                  let cloud = result.cloud;
                  return { title, episode, date, cloud };
                }),
              ),
          )
          .then(
            async (info) =>
              await Promise.all(
                info.filter(
                  (dates) => dates.date.toISOString().slice(0, 10) === date,
                ),
              ),
          ),
    );

    res.status(200).send({ data });
  } catch (err) {
    res.status(500).send(err);
  }
};
