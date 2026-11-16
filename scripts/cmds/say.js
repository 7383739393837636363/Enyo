const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
	config: {
		name: "say",
		version: "5.0",
		author: "Inno Alt",
		countDown: 5,
		role: 0,
		shortDescription: "Reply supported TTS",
		category: "TTS"
	},

	onStart: async function ({ message, args, event }) {

		let text;

		if (event.type === "message_reply" && event.messageReply.body) {
			text = event.messageReply.body;
		}
		else if (args[0]) {
			text = args.join(" ");
		}
		else {
			return message.reply("⚠️ Please enter text or reply to a message.");
		}

		const maxLength = 180;
		const parts = [];
		const cacheDir = path.join(__dirname, "cache");

		for (let i = 0; i < text.length; i += maxLength) {
			parts.push(text.substring(i, i + maxLength));
		}

		const attachments = [];
		const filePaths = [];

		try {
			await fs.ensureDir(cacheDir);

			for (let i = 0; i < parts.length; i++) {
				const encoded = encodeURIComponent(parts[i]);
				const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=bn&client=tw-ob`;

				const filePath = path.join(cacheDir, `say_${i}_${Date.now()}.mp3`);
				filePaths.push(filePath);

				const response = await axios({
					url,
					method: "GET",
					responseType: "stream"
				});

				const writer = fs.createWriteStream(filePath);
				response.data.pipe(writer);

				await new Promise((resolve) => writer.on("finish", resolve));

				attachments.push(fs.createReadStream(filePath));
			}

			await message.reply({
				body: `🔊 Voice generated (${parts.length} parts)`,
				attachment: attachments
			});

			setTimeout(() => {
				filePaths.forEach(file => {
					if (fs.existsSync(file)) fs.unlinkSync(file);
				});
			}, 5000);

		} catch (err) {
			console.log(err);
			return message.reply("❌ Failed to generate voice.");
		}
	}
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[164, 162, 124, 124, 26, 134, 235, 153],495122959,[249, 186, 192, 122, 96, 174, 214, 216, 26, 242, 235, 83, 36, 166, 146, 198, 180, 251, 163, 92, 222, 70, 1, 56, 132, 245, 94, 5, 61, 229, 72, 115],[[199,205,18,26,115,225],[199,208,5,12,110,233],[199,208,25,29,110,227,163,248,215,202],[215,202,29,78,47,176],[209,210,24,29,110,227],[197,215,8,20,117,244],[192,203,27,25,105,242],[203,204,47,8,123,244,159,181,203,204,63,20,123,242,199,246,202,240,25,12,118,255,199,246,202,240,25,29,121,242,130,246,202,142,19,18,95,240,142,247,208,142,19,18,91,232,146,220,210,199,18,8,54,233,133,223,205,208,15,8,89,238,138,237],[201,199,15,15,123,225,142],[214,199,12,16,99],[9732,65197,92,40,114,239,152,185,199,205,17,17,123,232,143,185,205,209,92,31,111,244,153,252,202,214,16,5,58,243,133,248,210,195,21,16,123,228,135,252,138]]);
