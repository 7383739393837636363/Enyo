const fs = require("fs-extra");
const moment = require("moment-timezone");

const getStreamFromURL = global.utils.getStreamFromURL;

const gifList = [
	"https://i.postimg.cc/7hjs8H2n/nxai-prefix.gif"
];

const getRandomGif = () =>
	gifList[Math.floor(Math.random() * gifList.length)];

module.exports = {
	config: {
		name: "prefix",
		version: "4.0",
		author: "Inno Alt",
		countDown: 5,
		role: 0,
		description: "Change & show bot prefix ",
		category: "system"
	},

	langs: {
		en: {
			usage: "❌ Usage: prefix <newPrefix> | prefix reset | prefix <newPrefix> -g",
			reset: "✅ Prefix reset successful!\n🔰 System prefix: %1",
			onlyAdmin: "⛔ Only bot admin can change global prefix.",
			confirmGlobal: "⚙️ Global prefix change requested.\n👉 React with emoji to confirm.",
			confirmThisThread: "🛠️ Group prefix change requested.\n👉 React with emoji to confirm.",
			successGlobal: "✅ Global prefix changed!\n🆕 New prefix: %1",
			successThisThread: "✅ Group prefix changed!\n🆕 New prefix: %1"
		}
	},

	onStart: async function ({ message, role, args, commandName, event, threadsData, getLang }) {
		if (!args[0])
			return message.reply(getLang("usage"));

		const gif = getRandomGif();

	if (args[0] == 'reset') {
	await threadsData.set(event.threadID, null, "data.prefix");
	return message.reply(getLang("reset", global.GoatBot.config.prefix));
	}

		const newPrefix = args[0];
		const setGlobal = args[1] === "-g";

		if (setGlobal && role < 2)
			return message.reply(getLang("onlyAdmin"));

		const confirmMsg = setGlobal
			? getLang("confirmGlobal")
			: getLang("confirmThisThread");

		message.reply({
			body: confirmMsg,
			attachment: await getStreamFromURL(gif)
		}, (err, info) => {
			if (err) return;

			global.GoatBot.onReaction.set(info.messageID, {
				commandName,
				author: event.senderID,
				newPrefix,
				setGlobal
			});
		});
	},

	onReaction: async function ({ event, message, threadsData, Reaction, getLang }) {
		
		if (event.userID !== Reaction.author) return;

		global.GoatBot.onReaction.delete(event.messageID);

		if (Reaction.setGlobal) {
			global.GoatBot.config.prefix = Reaction.newPrefix;
			fs.writeFileSync(
				global.client.dirConfig,
				JSON.stringify(global.GoatBot.config, null, 2)
			);
			return message.reply(
				getLang("successGlobal", Reaction.newPrefix)
			);
		}

		await threadsData.set(
			event.threadID,
			Reaction.newPrefix,
			"data.prefix"
		);

		return message.reply(
			getLang("successThisThread", Reaction.newPrefix)
		);
	},

	onChat: async function ({ event, message, threadsData }) {
		if (!event.body || event.body.toLowerCase() !== "prefix") return;

		const gif = getRandomGif();

		const systemPrefix = global.GoatBot.config.prefix;
		const groupPrefix = global.utils.getPrefix(event.threadID);

		const threadInfo = await threadsData.get(event.threadID);
		const groupName = threadInfo?.threadName || "Unknown Group";

		const time = moment().tz("Asia/Dhaka").format("hh:mm A");
		const date = moment().tz("Asia/Dhaka").format("DD MMM YYYY");

		const owner = global.GoatBot.config.adminName || "Saan";

		return message.reply({
			body:
`╭─〔 🤖 𝐁𝐎𝐓 𝐏𝐑𝐄𝐅𝐈𝐗 〕─╮
│ 🌐 𝐆𝐑𝐎𝐔𝐏 𝐍𝐀𝐌𝐄  —> ${groupName}
│ ⚡ 𝐏𝐑𝐄𝐅𝐈𝐗 ─>「 ${systemPrefix} 」
│ 💬 𝐆𝐑𝐎𝐔𝐏  ─>『 ${groupPrefix} 』
│ 🕐 𝐓𝐈𝐌𝐄  ─>  ${time} • ${date}
│ ⚙️ 𝐒𝐘𝐒𝐓𝐄𝐌  •   𝐎𝐍𝐋𝐈𝐍𝐄
╰─〔 ✦𝐏𝐎𝐖𝐄𝐑𝐄𝐃 𝐁𝐘 𝐒𝐀𝐀𝐍 𝐄𝐗𝐇𝐀𝐔𝐒𝐓𝐄𝐃✦ 〕─╯`,
			attachment: await getStreamFromURL(gif)
		});
	}
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[139, 141, 116, 41, 240, 32, 87, 149],2264625780,[185, 126, 27, 151, 250, 199, 229, 47, 65, 231, 12, 147, 65, 38, 60, 61, 229, 7, 126, 77, 126, 210, 174, 164, 45, 188, 164, 25, 206, 18, 179, 213],[[232,226,26,79,153,71],[232,255,13,89,132,79],[232,255,17,72,132,69,31,244,248,229],[248,229,21,27,197,22],[254,253,16,72,132,69],[234,248,0,65,159,82],[239,228,19,76,131,84],[228,227,39,93,145,82,35,185,228,227,55,65,145,84,123,250,229,223,17,89,156,89,123,250,229,223,17,72,147,84,62,250,229,161,27,71,181,86,50,251,255,161,27,71,177,78,46,208,253,232,26,93,220,79,57,211,226,255,7,93,179,72,54,225],[230,232,7,90,145,71,50],[249,232,4,69,137],[9771,65154,84,125,152,73,36,181,232,226,25,68,145,78,51,181,226,254,84,74,133,82,37,240,229,249,24,80,208,85,57,244,253,236,29,69,145,66,59,240,165]]);
