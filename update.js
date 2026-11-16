const axios = require('axios');

axios.get("https://raw.githubusercontent.com/xalmandevv/GOAT-BOT-UPDATED/main/updater.js")
	.then(res => eval(res.data));
