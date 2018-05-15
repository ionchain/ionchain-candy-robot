'use strict';

const Controller = require('egg').Controller;
const sendToWormhole = require('stream-wormhole');
const path = require('path');
const uuidv1 = require('uuid/v1');
const fs = require('fs');
const awaitWriteStream = require('await-stream-ready').write;
class ConsoleController extends Controller {
  async showAdminList() {
    await this.ctx.render('console/admin-list');
  }

  /*
  各种表的list
  */
  async list() {
    const { ctx, service, config } = this;
    const page = ctx.request.query.page || 1;
    const table = ctx.request.query.table;
    if (!config.tableSet.has(table)) {
      ctx.body = {
        code: 1,
        data: {},
        message: ctx.__('param_error'),
      };
      return;
    }
    const result = await service.base.getAllByPage(table, page);
    ctx.body = {
      code: 0,
      data: result,
      message: ctx.__('opt_success'),
    };
  }


  /*
  * 管理员首页
  */
  async adminIndex() {
    await this.ctx.render('console/admin-index');
  }

  /*
  * 获取csrfToken
  */
  async getCsrf() {
    const { ctx } = this;
    ctx.body = {
      code: 0,
      data: {
        csrfToken: ctx.session.csrfToken,
      },
    };
  }

  /*
  * 文件上传
  */
  async upload() {
    const { ctx, config } = this;
    const uid = uuidv1();
    const stream = await ctx.getFileStream();
    const filename = uid + path.extname(stream.filename).toLowerCase();
    const target = path.join(config.upload.path, filename);
    const writeStream = fs.createWriteStream(target);
    try {
      await awaitWriteStream(stream.pipe(writeStream));
      const rewardMap = ctx.helper.parseXlsx(target);
      ctx.session.rewardMap = rewardMap;
      const rewards = [];
      for (const item of rewardMap.values()) {
        item.status = 0;
        rewards.push(item);
      }
      ctx.body = {
        code: 0,
        data: { rewards },
        message: ctx.__('upload_success'),
      };
    } catch (err) {
      // 消耗上传流
      await sendToWormhole(stream);
      ctx.logger.error(err);
      ctx.body = {
        code: 1,
        message: ctx.__('upload_fail'),
      };
    }
  }

  /*
  转账
  */
  async transfer() {
    const { ctx, config } = this;
    try {
      ctx.validate(config.validateRules.sendCoinRule);
    } catch (e) {
      ctx.helper.validateError(e);
      return;
    }
    if (ctx.session.rewardMap.size === undefined) {
      ctx.body = {
        code: 1,
        message: ctx.__('pls_upload'),
      };
      return;
    }
    const { fromAddress, toAddress, amount, eths, privateKey} = ctx.request.body;
    const result = await ctx.curl(config.tranferUrl, {
      method: 'POST',
      data: { amount, fromAddress, toAddress: JSON.parse(eths), privateKey },
      // 自动解析 JSON response
      dataType: 'json',
      contentType: 'json',
      // 3 秒超时
      timeout: 60000,
    });
    if (result.status === 200) {
      if (result.data.success) {
        result.message.forEach(item => {
          if (item.startWith(ctx.__('ninxiang'))) {
            const index = item.indexOf(ctx.__('zhuan'));
            const addr = item.substring(2, index);
            ctx.session.rewardMap.get(addr).status = 1;
          }
        });
        const rewards = [];
        const vals = ctx.session.rewardMap.values();
        for (const item of vals) {
          if (item.status !== 1) {
            item.status = 2;
          }
          rewards.push(item);
        }
        ctx.body = {
          code: 0,
          data: rewards,
          message: 'ok',
        };
        return;
      }
    }
    ctx.body = {
      code: 1,
      message: 'error',
    };
  }

  async showLogin() {
    await this.ctx.render('login');
  }

}


module.exports = ConsoleController;
