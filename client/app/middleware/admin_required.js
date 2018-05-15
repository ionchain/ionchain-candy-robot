'use strict';

module.exports = () => {
  /*
   * 需要管理员权限
   */

  return async function(ctx, next) {
    const { user, app } = ctx;
    if (ctx.request.url === '/passport/local_admin') {
      await next();
      return;
    }
    if (!user) {
      await ctx.render('login');
      return;
    }
    await next();
  };
};
