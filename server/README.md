## IONCToken Transfer App

### Configuration

Modify config.json to meet you need.

```
  "contractAddress":"0x92e831bbbb22424e0f22eebb8beb126366fa07ce",
  "port":"8080",
  "providerUrl":"https://ropsten.infura.io/"

```
- contractAddress: deployed contract address
- port:app port 
- providerUrl:blockchain server supporter's url

### Running
```
cd IONCApp

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
	"fromAddress":"0xc21e95a78a224da9c69354de4470012aba1f1711",
	"toAddress":["0xd9cb455122db2cfbd9fcfc80988b9baea374cc01","0xb8304D385cA6753AD4DEBEe8175757126AdE5A00"],
	"amount":10,
	"privateKey":"b2521cdaca7dd7938d5e680a54af425103983592339f8b252d4f650b0b1d877e"
    }'
```
- fromAddress : sender's wallet address
- toAddress：receiver's wallet address
- amount：transfer value 
- privatekey: sender's wallet privateKey