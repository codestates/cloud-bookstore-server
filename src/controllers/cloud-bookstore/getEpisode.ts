import { Request, Response } from 'express';
import Episode from '../../entity/Episode';
import User from '../../entity/User';
import CloudHistory from '../../entity/CloudHistory';
import Purchase from '../../entity/Purchase';
import UserHistory from '../../entity/UserHistory';
import Novel from '../../entity/Novel';

export default async (req: Request, res: Response): Promise<void> => {
  try {
    const userId: number = +req.cookies.userId;
    const novelId: number = +req.params.novelId;
    const episodeId: number = +req.params.episodeId;

    // !userId가 존재 안했을 때는, 무조건 else문 타고
    // 있으면, 먼저 purchase 기록 확인해서, 구입한 회차면 cloud_history table, user_history table
    // 업데이트하고 구입 안한거면, cloudbalance 체크해서 0이면 사용했다고 보내고
    // 아니면 user table에서 차감하고, cloudhistory, userhistory 업데이트하고 보내주기
    const cloudBalance = await User.checkCloudBalance(userId);
    if (userId) {
      if (cloudBalance.user_cloud === 0) {
        // 사용자가 cloud를 다 사용했을 때
        res
          .status(200)
          .send(
            '구름을 모두 사용하셨습니다. 기다리면 내일 무료 구름 3개가 충전됩니다.',
          );
      } else {
        // 사용자가 아직 사용할 수 있는 cloud가 있을 때
        await UserHistory.addHistory(userId, novelId, episodeId);
        const novelTitle = await Novel.findByNovelIdTitleOnly(novelId);
        await Purchase.findByNovelId(userId, novelId).then(
          async (purchased) => {
            await Promise.all(
              purchased.filter((purchase) => purchase.episodeId === episodeId),
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
                  .then((data) => res.status(200).send({ data, novelTitle }));
              } else {
                // 유저가 이미 구매한 회차면 따로 cloud 차감 없음
                await CloudHistory.updateEpisodeCloud(
                  userId,
                  novelId,
                  episodeId,
                )
                  .then(() => Episode.findByEpisodeId(episodeId, novelId))
                  .then((data) => res.status(200).send({ data, novelTitle }));
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
