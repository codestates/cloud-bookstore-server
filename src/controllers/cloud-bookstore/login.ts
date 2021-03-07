import { Request, Response } from 'express';
import User from '../../entity/User';
import CloudHistory from '../../entity/CloudHistory';

export default async (req: Request, res: Response): Promise<void> => {
  const oauth = req.body.oauth;
  if (oauth === 'google') {
    let nickname = req.body.data.profileObj.givenName;
    let email = req.body.data.googleId;
    let length = nickname.length;
    let count = 0;
    let notFirst = await User.checkEmailLogin(email);
    if (!notFirst) {
      async function check(nickname: string): Promise<any> {
        let existNickname = await User.checkNicknameAvailability(nickname);
        if (existNickname === undefined) {
          return await User.addUser(nickname, email);
        } else {
          count += 1;
          let nick = `${nickname.slice(0, length)}${count}`;
          return check(nick);
        }
      }
      await check(nickname);
      count = 0;
      let data = await User.checkEmailLogin(email);
      let id = await User.getUserId(email);
      await CloudHistory.addFirstLoginHistory(id.user_id);
      res
        .status(200)
        .cookie('userId', id.user_id, {
          sameSite: 'none',
          httpOnly: true,
          secure: true,
        })
        .send({ data });
    } else {
      let today = new Date(); //현재 요일 월 일 년 시분초
      let year = today.getFullYear(); // 년도
      let month = today.getMonth() + 1; // 월(1월은 0이다)
      let date = today.getDate(); // 날짜
      let todayDate = `${year}-${month}-${date}`;
      let loginRawDate = await User.getUpdatedAt(email);
      loginRawDate = loginRawDate.user_updated_at;
      let loginYear = loginRawDate.getFullYear();
      let loginMonth = loginRawDate.getMonth() + 1;
      let loginDate = loginRawDate.getDate();
      loginRawDate = `${loginYear}-${loginMonth}-${loginDate}`;
      let id = await User.getUserId(email);
      if (todayDate === loginRawDate) {
        await User.lastLogin(email);
      } else {
        await User.plusCloud(email);
        await CloudHistory.addLoginHistory(id.user_id);
      }
      let data = await User.checkEmailLogin(email);
      res
        .status(200)
        .cookie('userId', id.user_id, {
          sameSite: 'none',
          httpOnly: true,
          secure: true,
        })
        .send({ data });
    }
  } else if (oauth === 'kakao') {
    let nickname = req.body.data.profile.properties.nickname;
    let email = req.body.data.profile.id;
    let length = nickname.length;
    let count = 0;
    let notFirst = await User.checkEmailLogin(email);
    if (!notFirst) {
      async function check(nickname: string): Promise<any> {
        let existNickname = await User.checkNicknameAvailability(nickname);
        if (existNickname === undefined) {
          return await User.addUser(nickname, email);
        } else {
          count += 1;
          let nick = `${nickname.slice(0, length)}${count}`;
          return check(nick);
        }
      }
      await check(nickname);
      count = 0;
      let data = await User.checkEmailLogin(email);
      let id = await User.getUserId(email);
      await CloudHistory.addFirstLoginHistory(id.user_id);
      res
        .status(200)
        .cookie('userId', id.user_id, {
          sameSite: 'none',
          httpOnly: true,
          secure: true,
        })
        .send({ data });
    } else {
      let today = new Date(); //현재 요일 월 일 년 시분초
      let year = today.getFullYear(); // 년도
      let month = today.getMonth() + 1; // 월(1월은 0이다)
      let date = today.getDate(); // 날짜
      let todayDate = `${year}-${month}-${date}`;
      let loginRawDate = await User.getUpdatedAt(email);
      loginRawDate = loginRawDate.user_updated_at;
      let loginYear = loginRawDate.getFullYear();
      let loginMonth = loginRawDate.getMonth() + 1;
      let loginDate = loginRawDate.getDate();
      loginRawDate = `${loginYear}-${loginMonth}-${loginDate}`;
      let id = await User.getUserId(email);
      if (todayDate === loginRawDate) {
        await User.lastLogin(email);
      } else {
        await User.plusCloud(email);
        await CloudHistory.addLoginHistory(id.user_id);
      }
      let data = await User.checkEmailLogin(email);
      res
        .status(200)
        .cookie('userId', id.user_id, {
          sameSite: 'none',
          httpOnly: true,
          secure: true,
        })
        .send({ data });
    }
  } else {
    res.status(401).send('Unauthorized');
  }
};
