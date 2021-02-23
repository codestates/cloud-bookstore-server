import { Router } from 'express';
const router = Router();

import { controllers } from '../controllers';

// * https://server.cloud-bookstore.com/novels
router.get('/novels', controllers.getNovels);

// * https://server.cloud-bookstore.com/login
router.post('/login', controllers.login);

// * https://server.cloud-bookstore.com/category/:id
router.get('/category/:id', controllers.category);

// * https://server.cloud-bookstore.com/novel/:novelId
router.get('/novel/:novelId', controllers.getNovel);

// * https://server.cloud-bookstore.com/novel/like/:novelId
router.post('/novel/like/:novelId', controllers.likeNovel);

// * https://server.cloud-bookstore.com/novel/comment
router.post('/novel/comment', controllers.commentNovel);

// * https://server.cloud-bookstore.com/novel/comment/edit
router.patch('novel/comment/edit', controllers.editNovelComment);

// * https://server.cloud-bookstore.com/novel/comment/delete/:novelId/:commentId
router.delete(
  'novel/comment/delete/:novelId/:commentId',
  controllers.deleteNovelComment,
);

// * https://server.cloud-bookstore.com/novel/:novelId/:episodeId
router.get('/novel/:novelId/:episodeId', controllers.getEpisode);

// * https://server.cloud-bookstore.com/mypage
router.get('/mypage', controllers.mypage);

// * https://server.cloud-bookstore.com/mypage/write/novel
router.post('/mypage/write/novel', controllers.writeNovel);

// * https://server.cloud-bookstore.com/mypage/write/episode
router.post('/mypage/write/episode', controllers.writeEpisode);

// * https://server.cloud-bookstore.com/mypage/novel/:novelId
router.get('/mypage/novel/:novelId', controllers.getMyNovel);

// * https://server.cloud-bookstore.com/setting/cloudhistory
router.get('/setting/cloudhistory', controllers.getCloudHistory);

// * https://server.cloud-bookstore.com/setting/nickname
router.patch('/setting/nickname', controllers.editNickname);

export default router;
