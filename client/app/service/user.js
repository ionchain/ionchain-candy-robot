'use strict';
const Service = require('egg').Service;
const USER_TABLE = 'user';
class AdminService extends Service {
  async findByUsername(username) {
    const existUser = await this.app.mysql.get(USER_TABLE, { username });
    return existUser;
  }
  async getUserById(id) {
    const existUser = await this.app.mysql.get(USER_TABLE, { id });
    return existUser;
  }
  async save(user) {
    const insertResult = await this.app.mysql.insert(USER_TABLE, user);
    return insertResult.affectedRows === 1;
  }
  async deleteById(id) {
    const deleteResult = await this.app.mysql.delete(USER_TABLE, { id });
    return deleteResult.affectedRows === 1;
  }
  async updateById(user) {
    const updateResult = await this.app.mysql.update(USER_TABLE, user);
    return updateResult.affectedRows === 1;
  }
}

module.exports = AdminService;
