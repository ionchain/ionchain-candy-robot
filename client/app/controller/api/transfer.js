'use strict';

const Controller = require('egg').Controller;

class TransferController extends Controller {

	async notify() {
	    const {ctx, service} = this
	    const batch_id = this.ctx.request.body.batchId
	    const eth_address = ctx.request.body.to
	    ctx.logger.info('notify success: %j', ctx.request.body);
	    const batch = await service.transfer.find('batch', batch_id)
	    const batch_info = await service.transfer.where('batch_info', {batch_id: batch_id, eth_address: eth_address})
	    if(batch){
	      await await this.service.transfer.updateAttributes('batch', {id: batch_id, status: 1})
	      ctx.logger.info('update batch success, eth_address:' + eth_address);	
	    }else {
	      ctx.logger.info('update batch faild, eth_address:' + eth_address);		
	    }
	    if(batch_info){
	      await service.transfer.updateBatchInfo([batch_id, eth_address])	
	      ctx.logger.info('update batch_info success, eth_address:' + eth_address);		
	    }else{
	      ctx.logger.info('update batch_info faild, eth_address:' + eth_address);
	    }
	    
	    ctx.body = {
	        code: 0,
	        data: {},
	        message: ctx.__('notify_success'),
        };
  	}
}

module.exports = TransferController;