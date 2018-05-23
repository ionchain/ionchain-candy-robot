//1.引入express模块
const express = require('express');

//2.创建app对象
const app = express();

//3.引入bodyParser
let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//4.转账接口通知
var config = require('./config.json');
var transfer = require('erc20TokenBatchTransfer');
var txEvent=require('erc20TokenBatchTransfer/lib/taskqueue').txEvent;
txEvent.on('tx_success',function(obj) {
    obj.batchId = batchId;
    console.log("转账成功=>"+JSON.stringify(obj));
    notify(obj);
});
var batchId = "";//全局批次ID;

/**
 * 通知客户端转账结果
 * @param obj
 */
function notify(obj){
    var request = require('request-json');
    var client = request.createClient(config.notifyServer);
    client.post(config.notifyMethod, obj, function(err, res, body) {
         if(!err){
             console.log("通知成功! body="+JSON.stringify(body));
         }else{
             console.log("通知失败! err="+err);
         }
    });
}

/**
 * 账户转账
 */
app.post('/transfer', function(req,res) {
    //1.获取参数
    let fromAddress = req.body.fromAddress;//钱包地址
    let toAddress = req.body.toAddress;//接收方地址
    let amount = req.body.amount;//转账数目
    let privateKey = req.body.privateKey;//私钥
    batchId = req.body.batchId;//批次ID
    //2.参数初始化
    transfer.init({
        senderAddress: fromAddress,
        privateKey: privateKey,
        contractAddress: config.contractAddress,
        provider: config.providerUrl
    });
    //3.封装转账对象
    var transferInfos = []
    for(var i = 0 ; i < toAddress.length; i++ ){
        var transferInfo = {"to":toAddress[i],"amount":amount};
        transferInfos.push(transferInfo);
    }
    //4.转账
    transfer.batchTransfer(transferInfos);
    //5.通知客户端success,实际转账成功后异步通知
    res.json({"success":true});
});

app.listen(config.port,() => {
    console.log('app listening on port '+config.port);
})



