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

    if (userId) {
      // 로그인이 되어있다면,
      const novelTitle = await Novel.findByNovelIdTitleOnly(novelId);
      await Purchase.findByNovelId(userId, novelId).then(async (purchased) => {
        // 구입한 기록 확인부터
        await Promise.all(
          purchased.filter((purchase) => purchase.episodeId === episodeId),
        ).then(async (purchase) => {
          if (purchase.length === 0) {
            // 구입한 기록이 없다면,
            const cloudBalance = await User.checkCloudBalance(userId);
            // 구름 잔량을 확인
            if (cloudBalance.user_cloud === 0) {
              // 사용자가 cloud를 다 사용했을 때
              res
                .status(200)
                .send(
                  '구름을 모두 사용하셨습니다. 기다리면 내일 무료 구름 3개가 충전됩니다.',
                );
            } else {
              // 사용가능한 구름이 있다면,
              await User.cutCloud(userId) // 구름 1 차감
                .then(() =>
                  // 사용자 기록 저장
                  UserHistory.addHistory(userId, novelId, episodeId),
                )
                .then(() =>
                  // 구름 기록 저장
                  CloudHistory.updateEpisodeCloud(userId, novelId, episodeId),
                )
                .then(() => Episode.getThumbnail(episodeId))
                // 회차에 저장 된 thumbnail 가져오기
                .then((data: any) =>
                  // 사용 내역 저장
                  Purchase.addPurchase(
                    userId,
                    episodeId,
                    data.episode_thumbnail,
                  ),
                )
                .then(() => Novel.updateCloud(novelId))
                .then(() => Episode.updateCloud(episodeId, novelId))
                .then(() => Episode.findByEpisodeId(episodeId, novelId))
                // 회차의 누적구름 추가 및 회차의 타이틀과 내용 가져오기
                .then((episode) =>
                  res.status(200).send({ episode, novelTitle }),
                );
            }
          } else {
            // 유저가 이미 구매한 회차면 따로 cloud 차감 없이 사용 내역 업데이트
            await UserHistory.addHistory(userId, novelId, episodeId)
              .then(() => Episode.findByEpisodeId(episodeId, novelId))
              .then((episode) => res.status(200).send({ episode, novelTitle }));
          }
        });
      });
    } else {
      res.status(200).send('다음 회차를 보기 위해 로그인을 해주세요.');
    }
  } catch (err) {
    res.status(500).send(err);
  }
};
