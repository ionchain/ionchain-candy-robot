'use strict';
const Service = require('egg').Service;
class GroupService extends Service {
  async findByName(name) {
    const exist = await this.app.mysql.get('group', { name });
    return exist;
  }

  async updateGroupCfg(ids, group_id, info_table, table, column_id) {
    const { mysql } = this.app;
    const [ itemOfGroup, items ] = await Promise.all([
      mysql.select(info_table, { columns: [ column_id ], where: { group_id } }),
      mysql.select(table, { columns: [ 'id' ] }),
    ]);
    const [ needToAddIds, needToDeleteIds, now ] = [[], [], new Date() ];
    ids.forEach(id => {
      const result = items.find(item => item.id === id) && itemOfGroup.findIndex(item => item[column_id] === id) === -1;
      if (result) {
        const obj = { group_id, gmt_create: now, gmt_modified: now };
        obj[column_id] = id;
        needToAddIds.push(obj);
      }
    });

    itemOfGroup.forEach(item => {
      const result = ids.findIndex(id => item[column_id] === id) === -1;
      if (result) {
        const obj = { group_id };
        obj[column_id] = item[column_id];
        needToDeleteIds.push(obj);
      }
    });
    const conn = await mysql.beginTransaction();
    try {
      if (needToAddIds.length > 0) {
        await conn.insert(info_table, needToAddIds);
      }
      for (let i = 0; i < needToDeleteIds.length; i++) {
        await conn.delete(info_table, needToDeleteIds[i]);
      }
      await conn.commit();
    } catch (e) {
      await conn.rollback();
      return false;
    }
    return true;
  }

  async getGroupCfg(group_id, info_table, table, column_id, column_name) {
    const { mysql } = this.app;
    let [ own, other ] = await Promise.all([
      mysql.select(info_table, { columns: [ column_id ], where: { group_id } }),
      mysql.query('select id as ??,?? from ??', [ column_id, column_name, table ]),
    ]);
    other = other.filter(oth => {
      const ownItem = own.find(o => o[column_id] === oth[column_id]);
      if (ownItem) {
        ownItem[column_name] = oth[column_name];
        return false;
      }
      return true;
    });
    return { group_id, own, other };
  }

  async isSuper(id) {
    const { mysql } = this.app;
    const group = await mysql.get('group', { id });
    if (!group) {
      return false;
    }
    return group.name === 'super_admin';
  }
}

module.exports = GroupService;
