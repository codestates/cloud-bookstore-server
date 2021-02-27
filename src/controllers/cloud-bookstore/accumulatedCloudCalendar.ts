import { Request, Response } from 'express';
import CloudHistory from '../../entity/CloudHistory';

export default async (req: Request, res: Response): Promise<void> => {
  try {
    const userId: number = +req.cookies.userId;
    const date: string = req.body.date; // `2020-02-27`

    const data = await CloudHistory.getCloudHistories(userId).then(
      async (histories) =>
        await Promise.all(
          histories.filter((history) => history.cloud < 0),
        ).then(
          async (info) => await console.log(String(info[0].updatedAt)),
          // await Promise.all(
          //   info.filter(
          //     (cloudDate) =>
          //       String(cloudDate.updatedAt).slice(0, 10) === date,
          //   ),
          // ),
        ),
    );

    res.status(200).send({ data });
  } catch (err) {
    res.status(500).send(err);
  }
};
