import { Request, Response } from 'express';
import CloudHistory from '../../entity/CloudHistory';

export default async (req: Request, res: Response): Promise<void> => {
  try {
    const userId: number = +req.cookies.userId;

    const data = await CloudHistory.getCloudHistories(userId).then(
      async (histories) =>
        await Promise.all(histories.filter((history) => history.cloud > 0)),
    );

    res.status(200).send({ data });
  } catch (err) {
    res.status(500).send(err);
  }
};
