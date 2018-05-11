'use strict';
const utility = require('utility');
const Service = require('egg').Service;
class BaseService extends Service {

  async getItemById(table, id) {
    const existUser = await this.app.mysql.get(table, { id });
    return existUser;
  }

  async save(table, item) {
    if (item.password) {
      item.password = utility.md5(item.password);
    }
    const insertResult = await this.app.mysql.insert(table, item);
    return insertResult;
  }
  async getAll(table, opts) {
    return await this.app.mysql.select(table, opts);
  }
  async getAllByPage(table, page) {
    const { config } = this;
    const { mysql } = this.app;
    const limit = config.listAdminLimit || 20;
    const opts = { limit, offset: (page - 1) * limit };
    const [ countResult, items ] = await Promise.all([
      mysql.query('select count(id) as count from ??', [ table ]),
      mysql.select(table, opts),
    ]);
    const pageCount = Math.ceil(countResult[0].count / limit);
    return { pageCount, items };
  }

  async deleteById(table, id) {
    const deleteResult = await this.app.mysql.delete(table, { id });
    return deleteResult.affectedRows === 1;
  }

  async updateById(table, data) {
    if (data.password) {
      data.password = utility.md5(data.password);
    }
    const updateResult = await this.app.mysql.update(table, data);
    return updateResult.affectedRows === 1;
  }

  async deleteItemByIdCascade(id, tableMap) {
    const { mysql } = this.app;
    const conn = await mysql.beginTransaction();
    try {
      for (let i = 0; i < tableMap.length; i++) {
        await conn.query('delete from ?? where ??=?', [ tableMap[i].table, tableMap[i].column, id ]);
      }
      await conn.commit();
    } catch (e) {
      this.ctx.logger.error(e);
      await conn.rollback();
      return false;
    }
    return true;
  }

  async isExist(table, column, value) {
    const opt = {};
    opt[column] = value;
    const result = await this.app.mysql.get(table, opt);
    return result;
  }

  async getAllIds(table) {
    const { mysql } = this.app;
    let ids = await mysql.select(table, { columns: [ 'id' ] });
    ids = ids.map(id => id.id);
    return new Set(ids);
  }
}

module.exports = BaseService;
