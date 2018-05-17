'use strict';
const path = require('path');
module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1525750673128_3591';

  // 中间件
  config.middleware = [ 'adminRequired' ];

  // mysql config
  config.mysql = {
    // 单数据库信息配置
    client: {
    // host
      host: 'localhost',
      // 端口号
      port: '3306',
      // 用户名
      user: 'root',
      // 密码
      password: '123456',
      // 数据库名
      database: 'ionchain_tool',
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
  };

  // 模板引擎
  config.view = {
    defaultViewEngine: 'ejs',
    mapping: {
      '.html': 'ejs',
    },
  };

  // 数据校验
  config.validateRules = {
    sendCoinRule: {
      fromAddress: { type: 'string' },
      privateKey: { type: 'string' },
      gas: { type: 'string' },
      amount: { type: 'string', match: /^[0-9]+(.[0-9]{1,})?$/ },
      eths: { type: 'string' },
    },
  };

  // 分页显示数目
  config.listAdminLimit = 20;

  // 本地文件上传配置
  config.upload = {
    path: path.join(__dirname, '../app/public/upload/'),
    url: '/public/upload/',
  };

  config.security = {
    csrf: {
      useSession: true, // 默认为 false，当设置为 true 时，将会把 csrf token 保存到 Session 中
      cookieName: 'csrfToken', // Cookie 中的字段名，默认为 csrfToken
      sessionName: 'csrfToken', // Session 中的字段名，默认为 csrfToken
    },
  };
  config.multipart = {
    // will append to whilelist
    fileExtensions: [
      '.xlsx',
      '.txt',
    ],
  };

  // 转账地址
  config.tranferUrl = 'http://192.168.23.54:8080/transfer';

  // 默认的用户名密码
  config.defaultUser = {
    username: 'admin',
    password: 'abcd.1234',
  };
  return config;
};
