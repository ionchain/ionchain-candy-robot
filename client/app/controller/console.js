'use strict';

const Controller = require('egg').Controller;
const sendToWormhole = require('stream-wormhole');
const path = require('path');
const uuidv1 = require('uuid/v1');
const fs = require('fs');
const awaitWriteStream = require('await-stream-ready').write;
class ConsoleController extends Controller {
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
    const { ctx, service, config } = this;
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
        rewards.push(item);
      }
      const importResult = await service.transfer.import(rewardMap);
      if (!importResult) {
        ctx.body = {
          code: 1,
          message: ctx.__('upload_fail'),
        };
        return;
      }
      ctx.body = {
        code: 0,
        data: { rewards: importResult },
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
    const { ctx, config, service } = this;
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
    let { fromAddress, amount, eths, privateKey, gas } = ctx.request.body;
    fromAddress = fromAddress.toLowerCase();
    eths = eths.toLowerCase();
    const toAddress = JSON.parse(eths);
    const result = await ctx.curl(config.tranferUrl, {
      method: 'POST',
      data: { amount, fromAddress, toAddress, privateKey, gas: Number(gas) },
      // 自动解析 JSON response
      dataType: 'json',
      contentType: 'json',
      // 3 秒超时
      timeout: 600000,
    });
    const addrMap = new Map();
    toAddress.forEach(item => {
      addrMap.set(item, 0);
    });
    if (result.status === 200) {
      if (result.data.success) {
        result.message.forEach(item => {
          if (item.startWith(ctx.__('ninxiang'))) {
            const index = item.indexOf(ctx.__('zhuan'));
            const addr = item.substring(2, index);
            addrMap.set(addr, 1);
          }
        });
        const now = new Date();
        const transferInfos = [];
        const rewardMap = ctx.session.rewardMap;
        for (const item of addrMap.entries()) {
          const transferInfo = {};
          transferInfo.batch_id = ctx.session.batch_id;
          transferInfo.gmt_create = now;
          transferInfo.gmt_modified = now;
          transferInfo.from_address = fromAddress;
          transferInfo.to_address = item[0];
          transferInfo.status = 1;
          const val = rewardMap.get(item[0]);
          val.status = 1;
          if (item[1] !== 1) {
            transferInfo.status = 2;
            val.status = 2;
          }
          rewardMap.set(item[0], val);
          transferInfos.push(transferInfo);
        }
        await service.tranfer.saveOrder(transferInfos);
        const rewards = [];
        for (const item of rewardMap.values()) {
          rewards.push(item);
        }
        ctx.body = {
          code: 0,
          data: { rewards },
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

  async listBatches() {
    const { ctx, service } = this;
    const batches = await service.transfer.getBatches();
    ctx.body = {
      code: 0,
      data: { batches },
      message: '',
    };
  }

  async listOrders() {
    const { ctx, service } = this;
    const batch_id = ctx.request.query.batch_id;
    const orders = await service.transfer.getOrderByBatchId(batch_id);
    ctx.body = {
      code: 0,
      data: { orders },
      message: '',
    };
  }
}


module.exports = ConsoleController;
