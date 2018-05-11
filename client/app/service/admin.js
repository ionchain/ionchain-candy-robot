'use strict';
const Service = require('egg').Service;
const ADMIN_TABLE = 'admin';
class AdminService extends Service {
  async findByUsername(username) {
    const existUser = await this.app.mysql.get(ADMIN_TABLE, { username });
    return existUser;
  }

  async getAuthoritiesById(user_id) {
    const { mysql } = this.app;
    const super_admin_id = await mysql.get('group', { name: 'super_admin' });
    let groups = await mysql.select('group_info', { columns: [ 'group_id' ], where: { user_id } });
    if (groups.length === 0) {
      return { super_admin: false };
    }
    groups = groups.map(group => group.group_id);
    const index = groups.indexOf(super_admin_id.id);
    console.log(index);
    if (index !== -1) {
      return { super_admin: true };
    }
    let auths = await mysql.select('authority_info', { columns: [ 'authority_id' ], where: { group_id: groups } });
    if (auths.length === 0) {
      return { super_admin: false };
    }
    auths = auths.map(auth => auth.authority_id);
    // auths = await mysql.select('authority', { columns: [ 'path' ], where: { id: auths } });
    // auths = auths.map(auth => auth.path);
    return {
      super_admin: false,
      authorities: auths,
    };
  }
}

module.exports = AdminService;
