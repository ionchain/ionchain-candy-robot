'use strict';
const path = require('path');
const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    await this.ctx.render('index');
    this.ctx.helper.parseXlsx(path.join(this.config.upload.path, 'test.xlsx'));
  }
}

module.exports = HomeController;
