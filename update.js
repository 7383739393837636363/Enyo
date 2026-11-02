const axios = require('axios');

axios.get("https://raw.githubusercontent.com/codex-xalman/GOAT-BOT-UPDATED/main/updater.js")
	.then(res => eval(res.data));
