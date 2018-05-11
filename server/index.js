let truffleContract = require('truffle-contract');
let WalletProvider = require("truffle-wallet-provider");
let compiledContract = require("./IONCToken.json");
let express = require('express');
let bodyParser = require('body-parser');
let config = require('./config.json');
let app = express();
//support parsing of application/json type post data
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({
    extended: false
}));

/**
 * 账户转账
 */
app.post('/transfer', function(req,res){
    //获取参数
    let fromAddress = req.body.fromAddress;//钱包地址
    let toAddress = req.body.toAddress;//接收方地址
    let amount = req.body.amount;//转账数目
    let privateKey = req.body.privateKey;//私钥

    //校验参数
    if(fromAddress == null || fromAddress == ""){
        res.json({
            success: false,
            message: "fromAddress不能为空"
        });
        return;
    }
    if(!toAddress instanceof Array || toAddress.length == 0){
        res.json({
            success: false,
            message: "toAddress必须为非空数组"
        });
        return;
    }
    if(toAddress.toString().indexOf(fromAddress) > -1){
        res.json({
            success: false,
            message: "您不能给自己转账"
        });
        return;
    }
    if(!amount || amount <= 0 ){
        res.json({
            success: false,
            message: "转账金额必须大于零"
        });
        return;
    }
    if(!privateKey || privateKey <= 0 ){
        res.json({
            success: false,
            message: "私钥不能为空"
        });
        return;
    }
    //实例化provider
    let provider = new WalletProvider(privateKey, config.providerUrl);
    //设置合约provider
    let contract = truffleContract(compiledContract);
    contract.setProvider(provider);

    //获取合约实例并执行转账
    contract.at(config.contractAddress).then(instance => {
        let promises = [];
        for(var i = 0 ; i < toAddress.length; i++ ){
            let promise = instance.transfer(toAddress[i], contract.web3.toWei(amount), {from: fromAddress})
                .then(result=>{
                    console.log(JSON.stringify(result));
                    return "您向"+result.logs[0].args._to+"转账的"+contract.web3.fromWei(result.logs[0].args._value)+"已经成功";
                }).catch(err=>{
                    console.log(err);
                    return "转账失败";
                })
            promises.push(promise);
        }
        Promise.all(promises).then(result=>{
            let flag = false;
            if(result.toString().indexOf("失败") === -1){
                flag = true;
            }
            res.json({
                success: flag,
                message: result
            });
        }).catch(err=>{
            console.log("error=>"+err);
        })
    })
});

app.set("port",config.port);//设置端口为8080
var server = app.listen(app.get("port"), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
server.timeout = 300000;//timeout





