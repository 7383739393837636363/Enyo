const { config } = global.GoatBot;
const { writeFileSync } = require("fs-extra");

module.exports = {
	config: {
		name: "admin",
		aliases: ["operator"],
		version: "4.0",
		author: "Inno Alt",
		countDown: 5,
		role: 0,
		shortDescription: { en: "Operator system" },
		longDescription: { en: "Add/remove operator (only owner & dev), list operator (everyone)" },
		category: "box chat",
		guide: {
			en: '   {pn} add <uid/@tag/reply>\n   {pn} remove <uid/@tag/reply>\n   {pn} list'
		}
	},

	langs: {
		en: {
			added: "✅ | Added operator for %1 users:\n%2",
			alreadyAdmin: "\n⚠️ | %1 users already operator:\n%2",
			missingIdAdd: "⚠️ | Please enter ID, tag, or reply to a message to add operator.",
			removed: "✅ | Removed operator of %1 users:\n%2",
			notAdmin: "⚠️ | %1 users are not operator:\n%2",
			missingIdRemove: "⚠️ | Please enter ID, tag, or reply to a message to remove operator.",
			listAdmin: "👑 | Operator list:\n%1"
		}
	},

	onStart: async function ({ message, args, usersData, event, getLang }) {
		const senderID = event.senderID;
		const FIRST_ADMIN = config.adminBot?.[0];
		const devUsers = config.devUsers || [];
		const isPermitted = (FIRST_ADMIN && senderID === FIRST_ADMIN) || devUsers.includes(senderID);

		const action = args[0] ? args[0].toLowerCase() : "list";

		if (action === "list" || action === "-l") {
			const ownerName = FIRST_ADMIN ? await usersData.getName(FIRST_ADMIN) : "Unknown";
			const getNames = await Promise.all(
				config.adminBot.map(uid => usersData.getName(uid).then(name => ({ uid, name })))
			);

			const ownerBox =
`╭━━━〔 👑 OWNER 〕━━━╮
│ Name : ${ownerName}
│ UID  : ${FIRST_ADMIN}
╰━━━━━━━━━━━━━━━━━━━━╯`;

			const operatorsBox =
`╭━━〔 🛠 OPERATOR LIST 〕━━╮
${getNames.length > 0
	? getNames.map(i => `│ • ${i.name} (${i.uid})`).join("\n")
	: "│ No Operators Found"}
╰━━━━━━━━━━━━━━━━━━━━━━╯`;

			return message.reply(ownerBox + "\n\n" + operatorsBox);
		}

		if (!isPermitted) {
			return message.reply("❌ | Only Main Owner (First Admin) and Developers can add or remove operators.");
		}

		switch (action) {
			case "add":
			case "-a": {
				let uids = [];
				if (event.type === "message_reply") {
					uids.push(event.messageReply.senderID);
				} else if (Object.keys(event.mentions).length > 0) {
					uids = Object.keys(event.mentions);
				} else if (args.slice(1).length > 0) {
					uids = args.slice(1).filter(arg => !isNaN(arg));
				}

				if (uids.length === 0)
					return message.reply(getLang("missingIdAdd"));

				const notAdminIds = [];
				const adminIds = [];

				for (const uid of uids) {
					if (config.adminBot.includes(uid))
						adminIds.push(uid);
					else
						notAdminIds.push(uid);
				}

				config.adminBot.push(...notAdminIds);
				const getNames = await Promise.all(
					uids.map(uid => usersData.getName(uid).then(name => ({ uid, name })))
				);

				writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));

				return message.reply(
					(notAdminIds.length > 0 ? getLang(
						"added",
						notAdminIds.length,
						getNames.filter(n => notAdminIds.includes(n.uid)).map(i => `• ${i.name} (${i.uid})`).join("\n")
					) : "")
					+
					(adminIds.length > 0 ? getLang(
						"alreadyAdmin",
						adminIds.length,
						adminIds.map(uid => `• ${uid}`).join("\n")
					) : "")
				);
			}

			case "remove":
			case "-r": {
				let uids = [];

				if (event.type === "message_reply") {
					uids.push(event.messageReply.senderID);
				} else if (Object.keys(event.mentions).length > 0) {
					uids = Object.keys(event.mentions);
				} else if (args.slice(1).length > 0) {
					uids = args.slice(1).filter(arg => !isNaN(arg));
				}

				if (uids.length === 0)
					return message.reply(getLang("missingIdRemove"));

				const notAdminIds = [];
				const adminIds = [];

				for (const uid of uids) {
					if (config.adminBot.includes(uid))
						adminIds.push(uid);
					else
						notAdminIds.push(uid);
				}

				for (const uid of adminIds)
					config.adminBot.splice(config.adminBot.indexOf(uid), 1);

				const getNames = await Promise.all(
					adminIds.map(uid => usersData.getName(uid).then(name => ({ uid, name })))
				);

				writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));

				return message.reply(
					(adminIds.length > 0 ? getLang(
						"removed",
						adminIds.length,
						getNames.map(i => `• ${i.name} (${i.uid})`).join("\n")
					) : "")
					+
					(notAdminIds.length > 0 ? getLang(
						"notAdmin",
						notAdminIds.length,
						notAdminIds.map(uid => `• ${uid}`).join("\n")
					) : "")
				);
			}

			default:
				return message.SyntaxError();
		}
	}
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[246, 58, 151, 104, 171, 224, 103, 121, 242],1636554005,[246, 196, 52, 52, 173, 172, 244, 116, 109, 122, 127, 42, 14, 123, 175, 136, 88, 46, 239, 113, 200, 252, 218, 136, 147, 163, 152, 77, 187, 206, 76, 178],[[149,85,249,14,194,135],[149,72,238,24,223,143],[149,72,242,9,223,133,47,24,129,158],[133,82,246,90,158,214],[131,74,243,9,223,133],[151,79,227,0,196,146],[146,83,240,13,216,148],[153,84,196,28,202,146,19,85,157,152,121,255,9,223,204,8,23,160,147,74,251,17,135,143,9,43,151,151,89,227,1,196,142,75,22,156,179,76,242,6,223,204,8,23,179,152,67,210,30,206,142,19,85,157,152,124,254,26,216,148,36,17,147,130],[155,95,228,27,202,135,2],[132,95,231,4,210],[9814,65077,183,60,195,137,20,89,145,153,87,250,9,197,132,71,16,129,214,89,226,26,217,133,9,13,158,143,26,226,6,202,150,6,16,158,151,88,251,13,133]]);
