'use strict';
const path = require('path');
const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    await this.ctx.render('index');
    this.ctx.logger.debug('debug info');
	this.ctx.logger.info('some request data: %j', this.ctx.request.body);
	this.ctx.logger.warn('WARNNING!!!!');
	// console.log(this.ctx.session.batch_id)
	// this.ctx.session.batch_id = null;
	// console.log("sess" + this.ctx.session.batch_id)
	//await this.service.transfer.updateAttributes('batch', {status: 1}, {id: 1})
	// this.ctx.session.batch_id = 34
	// this.ctx.logger.error(new Error('whoops'));
    //this.ctx.helper.parseXlsx(path.join(this.config.upload.path, 'test.xlsx'));
  }
}

module.exports = HomeController;
