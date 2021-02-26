import { Request, Response } from 'express';

import Episode from '../../entity/Episode';
import User from '../../entity/User';
import CloudHistory from '../../entity/CloudHistory';
import Purchase from '../../entity/Purchase';

export default async (req: Request, res: Response): Promise<void> => {
  try {
    const userId: number = +req.cookies.userId;
    const novelId: number = +req.params.novelId;
    const episodeId: number = +req.params.episodeId;

    const cloudBalance = await User.checkCloudBalance(userId);
    if (userId) {
      if ((cloudBalance.user_cloud = 0)) {
        // 사용자가 cloud를 다 사용했을 때
        res
          .status(200)
          .send(
            '구름을 모두 사용하셨습니다. 기다리면 내일 무료 구름 3개가 충전됩니다.',
          );
      } else {
        // 사용자가 아직 사용할 수 있는 cloud가 있을 때
        await Purchase.findByNovelId(userId, novelId).then(
          async (purchased) => {
            await Promise.all(
              purchased.filter(
                (purchase) => purchase.purchase_episodeId === episodeId,
              ),
            ).then(async (purchase) => {
              if (purchase.length === 0) {
                await User.cutCloud(userId) // 구름 1 차감
                  .then(() =>
                    CloudHistory.updateEpisodeCloud(userId, novelId, episodeId),
                  ) // 유저 구름 기록 업데이트
                  .then(() => Episode.getThumbnail(episodeId)) // 회차에 저장 된 thumbnail 가져오기
                  .then((data) =>
                    Purchase.addPurchase(
                      userId,
                      episodeId,
                      data.episode_thumbnail,
                    ),
                  ) // 구름 사용 내역에 저장
                  .then(() => Episode.findByEpisodeId(episodeId, novelId))
                  // 회차의 누적구름 추가 및 회차의 타이틀과 내용 가져오기
                  .then((data) => res.status(200).send(data));
              } else {
                // 유저가 이미 구매한 회차면 따로 cloud 차감 없음
                await CloudHistory.updateEpisodeCloud(
                  userId,
                  novelId,
                  episodeId,
                )
                  .then(() => Episode.findByEpisodeId(episodeId, novelId))
                  .then((data) => res.status(200).send(data));
              }
            });
          },
        );
      }
    } else {
      res.status(200).send('다음 회차를 보기 위해 로그인을 해주세요.');
    }
  } catch (err) {
    res.status(500).send(err);
  }
};
