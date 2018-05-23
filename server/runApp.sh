#!/bin/bash

function installNodeModules() {
	echo
	if [ -d node_modules ]; then
		echo "============== node modules installed already ============="
	else
		echo "============== Installing node modules ============="
		npm install --registry=https://registry.npm.taobao.org
	fi
	echo
}
installNodeModules
nohup node app.js  > server.log 2>&1 &
