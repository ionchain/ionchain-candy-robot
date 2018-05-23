'use strict';
const ONE_DAY = 1000 * 60 * 60 * 24;
module.exports = app => {
  const localAdminHandler = async (ctx, user) => {
    const defaultUser = app.config.defaultUser;
    const { username, password } = user;
    if (username !== defaultUser.username || password !== defaultUser.password) {
      return null;
    }
    return user;
  };
  // const sessionMap = new Map();
  // app.sessionStore = {
  //   // support promise / async
  //   async get(key) {
  //     return sessionMap.get(key);
  //   },
  //   async set(key, value, maxAge) {
  //     maxAge = ONE_DAY;
  //     sessionMap.set(key, value);
  //   },
  //   async destroy(key) {
  //     sessionMap.delete(key);
  //   },
  // };
  app.passport.verify(async (ctx, user) => {
    ctx.logger.debug('passport.verify', user);
    const handler = localAdminHandler;
    const existUser = await handler(ctx, user);
    return existUser;
  });
};
