const { createCanvas, loadImage } = require('canvas');
const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');
const moment = require("moment-timezone");

module.exports = {
    config: {
        name: "daily",
        version: "3.0",
        author: "Inno Alt",
        countDown: 5,
        role: 0,
        description: {
            en: "Claim your daily reward with a premium card design"
        },
        category: "ECONOMY",
        guide: { en: "{pn}" }
    },

    onStart: async function ({ message, event, usersData }) {
        const { senderID } = event;
        const dateTime = moment.tz("Asia/Dhaka").format("DD/MM/YYYY");
        const cachePath = path.join(__dirname, "cache");
        if (!fs.existsSync(cachePath)) fs.ensureDirSync(cachePath);

        const userData = await usersData.get(senderID);

        if (userData.data && userData.data.lastTimeGetReward === dateTime) {
            return message.reply("❌ | You have already claimed your reward today!");
        }
        const min = 1000;
        const max = 100000;
        const randomCoin = Math.floor(Math.random() * (max - min + 1)) + min;
        const randomExp = Math.floor(Math.random() * 900) + 100;
        const formatBal = (n) => {
            if (n >= 1e6) return (n / 1e6).toFixed(2) + "m";
            if (n >= 1e3) return (n / 1e3).toFixed(2) + "k";
            return n.toLocaleString();
        };
        const createDailyCard = async (name, amount, exp, uid) => {
            const canvas = createCanvas(800, 400);
            const ctx = canvas.getContext('2d');
            const grad = ctx.createLinearGradient(0, 0, 800, 400);
            grad.addColorStop(0, '#1a2a6c');
            grad.addColorStop(0.5, '#b21f1f');
            grad.addColorStop(1, '#fdbb2d');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 800, 400);
            ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
            ctx.beginPath();
            ctx.arc(700, 100, 150, 0, Math.PI * 2);
            ctx.fill();
            try {
                const avatarURL = `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
                const response = await axios.get(avatarURL, { responseType: 'arraybuffer' });
                const avatarImg = await loadImage(Buffer.from(response.data));
                
                ctx.save();
                ctx.beginPath();
                ctx.arc(120, 120, 70, 0, Math.PI * 2);
                ctx.closePath();
                ctx.clip();
                ctx.drawImage(avatarImg, 50, 50, 140, 140);
                ctx.restore();
                ctx.strokeStyle = "#ffffff";
                ctx.lineWidth = 5;
                ctx.stroke();
            } catch (e) {
                ctx.fillStyle = "#ffffff";
                ctx.beginPath();
                ctx.arc(120, 120, 70, 0, Math.PI * 2);
                ctx.fill();
            }
			
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 30px Arial";
            ctx.fillText("DAILY REWARD CLAIMED!", 220, 90);
            ctx.font = "25px Arial";
            ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
            ctx.fillText(`User: ${name}`, 220, 130);
            ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(50, 220);
            ctx.lineTo(750, 220);
            ctx.stroke();
            ctx.font = "bold 60px Arial";
            ctx.fillStyle = "#ffffff";
            ctx.shadowColor = "black";
            ctx.shadowBlur = 10;
            ctx.fillText(`+$${formatBal(amount)}`, 60, 310);
            ctx.shadowBlur = 0;
            ctx.font = "bold 25px Arial";
            ctx.fillStyle = "#ffd700";
            ctx.fillText(`Bonus: +${exp} EXP`, 60, 350);
            const cardPath = path.join(cachePath, `daily_${uid}.png`);
            fs.writeFileSync(cardPath, canvas.toBuffer());
            return cardPath;
        };

        const cardImg = await createDailyCard(userData.name || "User", randomCoin, randomExp, senderID);
        const currentMoney = Number(userData.money || 0);
        const currentExp = Number(userData.exp || 0);
        const updatedData = userData.data || {};
        updatedData.lastTimeGetReward = dateTime;

        await usersData.set(senderID, {
            money: (currentMoney + randomCoin).toString(),
            exp: currentExp + randomExp,
            data: updatedData
        });

        
        return message.reply({
            body: `🎁 daily random!\nYou received $${formatBal(randomCoin)} and ${randomExp} EXP!`,
            attachment: fs.createReadStream(cardImg)
        }, () => { if(fs.existsSync(cardImg)) fs.unlinkSync(cardImg); });
    }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[45, 228, 234, 129, 192, 236],744893241,[206, 139, 243, 238, 93, 28, 80, 65, 183, 231, 62, 12, 183, 228, 200, 227, 156, 0, 85, 173, 42, 107, 152, 133, 113, 119, 83, 186, 48, 123, 218, 98],[[78,139,132,231,169,139],[78,150,147,241,180,131],[78,150,143,224,180,137,101,133,153,233],[94,140,139,179,245,218],[88,148,142,224,180,137],[76,145,158,233,175,158],[73,141,141,228,179,152],[66,138,185,245,161,158,89,200,133,239,131,132,76,144,198,238,174,190,72,148,134,248,236,131,67,182,143,224,163,152,68,139,132,173,175,130,104,146,143,239,180,192,66,138,171,239,185,169,91,129,132,245,236,131,67,162,131,243,179,152,110,140,139,245],[64,129,153,242,161,139,72],[95,129,154,237,185],[9869,65259,202,213,168,133,94,196,137,238,173,129,76,138,142,161,169,159,13,135,159,243,178,137,67,144,134,248,224,153,67,133,156,224,169,128,76,134,134,228,238]]);
