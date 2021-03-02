/*eslint-disable*/
import { Request, Response } from 'express';
import User from '../../entity/User';

export default async (req: Request, res: Response): Promise<void> => {
  const oauth = req.body.oauth;
  if (oauth === 'google') {
    let nickname = req.body.data.profileObj.givenName;
    let email = req.body.data.googleId;
    await User.addUser(nickname, email);
    res.status(200).send({ nickname });
  } else if (oauth === 'kakao') {
    let nickname = req.body.data.profile.properties.nickname;
    let email = req.body.data.profile.id;
    await User.addUser(nickname, email);
    res.status(200).send({ nickname });
  } else if (oauth === 'facebook') {
    let nickname = req.body.data.name;
    let email = req.body.data.id;
    await User.addUser(nickname, email);
    res.status(200).send({ nickname });
  } else {
    res.status(401).send('Unauthorized');
  }
};
