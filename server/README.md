## Transfer Server

### Configuration

Modify config.json to meet you need.

```
 {
   "contractAddress":"0x92e831bbbb22424e0f22eebb8beb126366fa07ce",
   "port":"4000",
   "providerUrl":"https://ropsten.infura.io/",
   "notifyServer":"http://localhost:3000",
   "notifyMethod":"notify"
 }

```
- contractAddress: deployed contract address
- port:app port 
- providerUrl:blockchain server supporter's url
- notifyServer: notify server address
- notifyMethod: notify method

### Running
```for testing notify you can run testNotify.js 
cd server

./runApp.sh

```


* Installs node modules
* Starts the node app on PORT 8080

### Invoke Methods

```
curl -s -X POST \
  http://127.0.0.1:8080/transfer \
  -H "content-type: application/json" \
  -d '{
	"fromAddress":"0x412A1f1811E9dB5A1AFE2E1e2Cc6b028fbD646d3",
	"toAddress":["0x2dB89b3157375F6eebf2Fb7Af45EdEB95D4C072e","0x7755678C99d09A030d006DC3eE2b2310b0eDd560"],
	"amount":"1",
	"privateKey":"ac9d647c18672e076e4ce436fd19479fa806fc2b4282436a1ffd750636274a6e",
	"batchId":"520"
    }'
```
- fromAddress : sender's wallet address
- toAddress：receiver's wallet address
- amount：transfer value 
- privatekey: sender's wallet privateKey
- batchId:batchId