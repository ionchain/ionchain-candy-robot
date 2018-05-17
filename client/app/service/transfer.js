'use strict';


const Service = require('egg').Service;

class TransferService extends Service {
  async import(user_info) {
    const { mysql } = this.app;
    const conn = await mysql.beginTransaction();
    const now = new Date();
    const users = [];
    try {
      const insertResult = await conn.insert('batch', { gmt_create: now, gmt_modified: now });
      this.ctx.session.batch_id = insertResult.insertId;
      for (const item of user_info.values()) {
        item.gmt_create = now;
        item.gmt_modified = now;
        item.batch_id = insertResult.insertId;
        users.push(item);
      }
      await conn.insert('batch_info', users);
      await conn.commit();
    } catch (e) {
      this.ctx.logger.error(e);
      await conn.rollback();
      return false;
    }
    return users.map(item => {
      item.status = 0;
      return item;
    });
  }

  async saveOrder(transferInfos) {
    const { mysql } = this.app;
    try {
      await mysql.insert('order', transferInfos);
    } catch (e) {
      this.ctx.logger.error(e);
      return false;
    }
    return true;
  }

  async getBatches() {
    const { mysql } = this.app;
    return await mysql.select('batch', { orders: [[ 'gmt_create', 'desc' ]] });
  }

  async getOrderByBatchId(batch_id) {
    const { mysql } = this.app;
    const result = await mysql.query('select `order`.amount as amount,`order`.from_address as from_address,`order`.to_address as to_address,`order`.gmt_create as gmt_create,`order`.status as status,batch_info.`name` as ' +
    'name,batch_info.address as address,batch_info.weixin as weixin,batch_info.phone as phone,batch_info.commit_time as commit_time,batch_info.seq_id as seq_id from `order`,batch_info ' +
    'where batch_info.batch_id=? and `order`.to_address=batch_info.eth_address and `order`.batch_id=batch_info.batch_id', [ batch_id ]);
    return result;
  }
}

module.exports = TransferService;
