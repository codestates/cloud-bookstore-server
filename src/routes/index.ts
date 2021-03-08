import { Router } from 'express';
const router = Router();

import { controllers } from '../controllers';

// * https://server.cloud-bookstore.com/novels
router.get('/novels', controllers.getNovels);

// * https://server.cloud-bookstore.com/login
router.post('/login', controllers.login);

// * https://server.cloud-bookstore.com/logout
router.get('/logout', controllers.logout);

// * https://server.cloud-bookstore.com/category/:id
router.get('/category/:id', controllers.category);

// * https://server.cloud-bookstore.com/novel/:novelId
router.get('/novel/:novelId', controllers.getNovel);

// * https://server.cloud-bookstore.com/novel/like/:novelId
router.get('/novel/like/:novelId', controllers.likeNovel);

// * https://server.cloud-bookstore.com/novel/comment
router.post('/novel/comment', controllers.commentNovel);

// * https://server.cloud-bookstore.com/novel/comment/edit
router.patch('/novel/comment/edit', controllers.editNovelComment);

// * https://server.cloud-bookstore.com/novel/comment/delete/:novelId/:commentId
router.delete(
  '/novel/comment/delete/:novelId/:commentId',
  controllers.deleteNovelComment,
);

// * https://server.cloud-bookstore.com/novel/:novelId/:episodeId
router.get('/novel/:novelId/:episodeId', controllers.getEpisode);

// * https://server.cloud-bookstore.com/mypage
router.get('/mypage', controllers.mypage);

// * https://server.cloud-bookstore.com/mypage/write/novel
router.post('/mypage/write/novel', controllers.writeNovel);

// * https://server.cloud-bookstore.com/mypage/edit/novel
router.patch('/mypage/edit/novel', controllers.editNovel);

// * https://server.cloud-bookstore.com/mypage/delete/novel/:novelId
router.delete('/mypage/delete/novel/:novelId', controllers.deleteNovel);

// * https://server.cloud-bookstore.com/mypage/write/episode
router.post('/mypage/write/episode', controllers.writeEpisode);

// * https://server.cloud-bookstore.com/mypage/edit/episode
router.patch('/mypage/edit/episode', controllers.editEpisode);

// * https://server.cloud-bookstore.com/mypage/delete/episode/:episodeId
router.delete('/mypage/delete/episode/:episodeId', controllers.deleteEpisode);

// * https://server.cloud-bookstore.com/mypage/novel/:novelId
router.get('/mypage/novel/:novelId', controllers.getMyNovel);

// * https://server.cloud-bookstore.com/setting/cloudhistory/accumulation
router.get(
  '/setting/cloudhistory/accumulation',
  controllers.getAccumulatedCloudHistory,
);

// * https://server.cloud-bookstore.com/setting/cloudhistory/deduction
router.get(
  '/setting/cloudhistory/deduction',
  controllers.getDeductedCloudHistory,
);

// * https://server.cloud-bookstore.com/setting/cloudhistory/accumulation/calendar/:date
router.get(
  '/setting/cloudhistory/accumulation/calendar/:date',
  controllers.accumulatedCloudCalendar,
);

// * https://server.cloud-bookstore.com/setting/cloudhistory/deduction/calendar/:date
router.get(
  '/setting/cloudhistory/deduction/calendar/:date',
  controllers.deductedCloudCalendar,
);

// * https://server.cloud-bookstore.com/setting/nickname
router.patch('/setting/nickname', controllers.editNickname);

export default router;
