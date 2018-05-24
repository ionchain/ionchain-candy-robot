'use strict';


const Service = require('egg').Service;

class TransferService extends Service {
  async import(user_info, filename) {
    const { mysql } = this.app;
    const conn = await mysql.beginTransaction();
    const now = new Date();
    const users = [];
    try {
      const insertResult = await conn.insert('batch', { gmt_create: now, gmt_modified: now, filename: filename });
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

  // async updateBatch(){
  //   const { mysql } = this.app;
  //   await return await mysql.update(table, attributes);
  // }

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

  async getBatchInfoByBatchId(batch_id){
    const {mysql} = this.app
    return await mysql.select('batch_info', {where: {batch_id: batch_id}})
  }

  async find(table, id){
    const {mysql} = this.app
    return await mysql.select(table, {where: {id: id}})
  }

  async where(table, conditions){
    const {mysql} = this.app
    return await mysql.select(table, {where: conditions})
  }

  async updateAttributes(table, attributes){

    const {mysql} = this.app
    return await mysql.update(table, attributes)
    // if (Object.keys(conditions).length == 0) {
    //   return await mysql.update(table, attributes)
    // }else {
    //   //const results = yield app.mysql.query('update ' + table + ' set hits = (hits + ?) where id = ?', [1, postId]);
    //   conn = 'update' + table + 'set = '
    //   values = []
    //   Object.entries(attributes).forEach(function(entry){
    //     console.log(entry)
    //     conn += entry[0] + ' = ? '
    //     values.push(entry[1])
    //   });

    //   conn += ' where '
    //   cond = []
    //   Object.entries(conditions).forEach(function(entry){
    //     cond.push(entry[0] + ' = ? ')
    //     values.push(entry[1])
    //   });

    //   for (let value of Object.entries(attributes).values()) {
    //     console.log(value);
    //   }
    //   return await mysql.query('update ' + table + ' set status = ? where id = ?', [1, 34]);
    // }
  }

  async updateBatchInfo(conns) {
    const {mysql} = this.app
    return await mysql.query('update batch_info set status = 1 where batch_id = ? and eth_address = ? ', conns);
  }
}

module.exports = TransferService;
