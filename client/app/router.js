'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.post('/upload', controller.console.upload);
  router.get('/csrf', controller.console.getCsrf);
  router.post('/transfer', controller.console.transfer);
  router.post('/api/transfer/notify', controller.api.transfer.notify)
  const localAdminStrategy = app.passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureMessage: 'Invalid username or password !',
  });
  router.post('/passport/local_admin', localAdminStrategy);// 管理员登录权鉴
  router.get('/login', controller.console.showLogin);
  router.get('/batches', controller.console.listBatches);
  router.get('/orders', controller.console.listOrders);
};
