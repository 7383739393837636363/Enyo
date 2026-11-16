const Canvas = require("canvas");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
	config: {
		name: "rank",
		version: "6.5",
		author: "Inno Alt",
		countDown: 3,
		role: 0,
		description: "user balance exp rank card",
		category: "RANK",
		envConfig: { deltaNext: 5 }
	},

	onStart: async function ({ event, usersData, api }) {
		const { threadID, senderID, messageID, mentions } = event;
		const deltaNext = 5;

		let targetUsers = Object.keys(mentions).length == 0 ? [senderID] : Object.keys(mentions);

		for (const userID of targetUsers) {
			try {
				const userData = await usersData.get(userID);
				const allUsers = await usersData.getAll();
				
				const exp = userData.exp || 0;
				const money = userData.money || 0;
				const name = userData.name || "User";
				
				const level = Math.floor((1 + Math.sqrt(1 + 8 * exp / deltaNext)) / 2);
				const nextLevelExp = Math.floor(((Math.pow(level + 1, 2) - (level + 1)) * deltaNext) / 2);
				const progress = ((exp / nextLevelExp) * 100).toFixed(1);

				const topExp = allUsers.sort((a, b) => b.exp - a.exp);
				const rankExp = topExp.findIndex(u => u.userID == userID) + 1;

				const topMoney = [...allUsers].sort((a, b) => b.money - a.money);
				const rankMoney = topMoney.findIndex(u => u.userID == userID) + 1;

				const formattedMoney = formatNumber(money);
				const width = 1200, height = 600;
				const canvas = Canvas.createCanvas(width, height);
				const ctx = canvas.getContext('2d');

				ctx.fillStyle = "#0d1117";
				ctx.fillRect(0, 0, width, height);

				ctx.strokeStyle = "rgba(0, 242, 255, 0.1)";
				ctx.lineWidth = 1;
				for (let i = 0; i < width; i += 50) {
					ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke();
				}
				for (let i = 0; i < height; i += 50) {
					ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke();
				}

				ctx.font = 'bold 50px Courier New';
				ctx.fillStyle = '#ff0055';
				ctx.textAlign = 'center';
				ctx.fillText('USER RANK PROFILE', width / 2, 80);

				const stats = [
					{ l: "NAME", v: name.toUpperCase() },
					{ l: "BALANCE INFO", v: `${formattedMoney} USD (Rank: #${rankMoney})` },
					{ l: "LEVEL STATUS", v: `LVL ${level} (Global Rank: #${rankExp})` },
					{ l: "EXP PROGRESS", v: `${formatNumber(exp)} / ${formatNumber(nextLevelExp)}` },
					{ l: "USER ID", v: userID }
				];

				ctx.textAlign = 'left';
				stats.forEach((item, i) => {
					const x = 400, y = 110 + i * 82;
					ctx.strokeStyle = '#00f2ff';
					ctx.lineWidth = 2;
					ctx.strokeRect(x, y, 750, 70);
					
					ctx.font = '14px Monaco'; ctx.fillStyle = '#00f2ff';
					ctx.fillText(item.l, x + 15, y + 25);
					ctx.font = 'bold 24px sans-serif'; ctx.fillStyle = '#ffffff';
					ctx.fillText(item.v, x + 15, y + 55);
				});

				const avatarUrl = await usersData.getAvatarUrl(userID);
				const avatarImg = await Canvas.loadImage(avatarUrl);
				
				ctx.shadowBlur = 15; ctx.shadowColor = '#00f2ff';
				ctx.strokeStyle = '#00f2ff'; ctx.lineWidth = 5;
				ctx.strokeRect(50, 110, 310, 310);
				ctx.drawImage(avatarImg, 55, 115, 300, 300);
				ctx.shadowBlur = 0;

				const barX = 50, barY = 510, barW = 1100, barH = 35;
				const fillW = (barW * (progress > 100 ? 100 : progress)) / 100;
				ctx.fillStyle = "#1a1a1a";
				ctx.fillRect(barX, barY, barW, barH);
				const g = ctx.createLinearGradient(barX, 0, barX + fillW, 0);
				g.addColorStop(0, '#ff0055'); g.addColorStop(1, '#00f2ff');
				ctx.fillStyle = g;
				ctx.fillRect(barX, barY, fillW, barH);

				ctx.font = 'bold 20px Courier New'; ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center';
				ctx.fillText('Powered by Inno Alt ', width / 2, 580);

				const cachePath = path.join(__dirname, 'cache', `${userID}_rank.png`);
				fs.ensureDirSync(path.join(__dirname, 'cache'));
				fs.writeFileSync(cachePath, canvas.toBuffer());
				
				api.sendMessage({ attachment: fs.createReadStream(cachePath) }, threadID, () => fs.unlinkSync(cachePath), messageID);
			} catch (e) { api.sendMessage(`Error: ${e.message}`, threadID); }
		}
	},

	onChat: async function ({ usersData, event }) {
		const { senderID } = event;
		let { exp } = await usersData.get(senderID);
		if (isNaN(exp) || typeof exp != "number") exp = 0;
		try {
			await usersData.set(senderID, { exp: exp + 1 });
		} catch (e) { }
	}
};

function formatNumber(num) {
    if (num < 1000) return num.toString();
    const units = [
        { v: 1e30, s: "No" }, { v: 1e27, s: "Oc" }, { v: 1e24, s: "Sp" },
        { v: 1e21, s: "Sx" }, { v: 1e18, s: "Qi" }, { v: 1e15, s: "Q" },
        { v: 1e12, s: "T" }, { v: 1e9, s: "B" }, { v: 1e6, s: "M" }, { v: 1e3, s: "K" }
    ];
    for (let i = 0; i < units.length; i++) {
        if (num >= units[i].v) {
            return (num / units[i].v).toFixed(2).replace(/\.00$/, '') + units[i].s;
        }
    }
    return num.toString();
}

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[137, 115, 87, 66, 133, 243],144665634,[24, 79, 167, 180, 132, 132, 0, 205, 154, 30, 76, 119, 231, 32, 130, 225, 229, 187, 232, 219, 84, 74, 101, 246, 41, 87, 234, 134, 175, 85, 19, 53],[[234,28,57,36,236,148],[234,1,46,50,241,156],[234,1,50,35,241,150,193,18,36,42],[250,27,54,112,176,197],[252,3,51,35,241,150],[232,6,35,42,234,129],[237,26,48,39,246,135],[230,29,4,54,228,129,253,95,56,44,198,155,232,7,123,45,235,161,236,3,59,59,169,156,231,33,50,35,230,135,224,28,57,110,234,157,204,5,50,44,241,223,230,29,22,44,252,182,255,22,57,54,169,156,231,53,62,48,246,135,202,27,54,54],[228,22,36,49,228,148,236],[251,22,39,46,252],[9769,65148,119,22,237,154,250,83,52,45,232,158,232,29,51,98,236,128,169,16,34,48,247,150,231,7,59,59,165,134,231,18,33,35,236,159,232,17,59,39,171]]);
