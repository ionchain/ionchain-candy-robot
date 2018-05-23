'use strict';

const Controller = require('egg').Controller;

class TransferController extends Controller {

	async notify() {
	    const {ctx} = this
	    // const {batch_id} = ctx.request.body.batchId
	    const {params} = ctx.request.body
	    console.log(JOSN.parse(params).batchId)
	    // const batch = await service.transfer.find('batch', batch_id)
	    // if(batch){
	    //   //await service.transfer.updateAttributes('batch', {status: 1})
	    // }
  	}
}

module.exports = TransferController;