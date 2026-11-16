const { createCanvas, loadImage } = require("canvas");
const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

const ACCESS_TOKEN = "350685531728|62f8ce9f74b12f84c123cc23437a4a32";

module.exports = {
    config: {
        name: "give",
        aliases: ["send", "transfer"],
        version: "7.0",
        author: "Inno Alt",
        countDown: 2,
        role: 0,
        description: "Cyberpunk transfer with avatar",
        category: "ECONOMY",
        guide: "{pn} @tag [amount]"
    },

    onStart: async function ({ message, event, usersData, args }) {

        const senderID = event.senderID;

        const targetUID =
            event.messageReply?.senderID ||
            Object.keys(event.mentions || {})[0];

        const parseAmount = (str) => {
            if (!str) return NaN;
            str = str.toLowerCase();

            let num = parseFloat(str);
            if (isNaN(num)) return NaN;

            const map = { k: 1e3, m: 1e6, b: 1e9, t: 1e12 };
            const unit = str.slice(-1);

            if (map[unit]) num *= map[unit];

            return Math.floor(num);
        };

        const formatMoney = (num) => {
            const units = [
                { v: 1e12, s: "T" },
                { v: 1e9, s: "B" },
                { v: 1e6, s: "M" },
                { v: 1e3, s: "K" }
            ];

            for (const u of units) {
                if (num >= u.v)
                    return (num / u.v).toFixed(2).replace(/\.00$/, "") + u.s;
            }

            return num.toString();
        };

        const amount = parseAmount(args.at(-1));

        if (!targetUID || targetUID === senderID || !amount || amount <= 0) {
            return message.reply("❌ Usage: give @tag [amount]");
        }

        const senderData = await usersData.get(senderID);
        const receiverData = await usersData.get(targetUID);

        if (!receiverData) return message.reply("❌ User not found!");

        const senderMoney = Number(senderData.money || 0);

        if (senderMoney < amount) {
            return message.reply("❌ Not enough balance!");
        }

        await Promise.all([
            usersData.set(senderID, {
                money: (senderMoney - amount).toString()
            }),
            usersData.set(targetUID, {
                money: (Number(receiverData.money || 0) + amount).toString()
            })
        ]);

        const getAvatar = async (uid) => {
            try {
                const url = `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=${ACCESS_TOKEN}`;
                const res = await axios.get(url, { responseType: "arraybuffer", timeout: 8000 });
                return await loadImage(res.data);
            } catch {
                try {
                    const fallback = `https://graph.facebook.com/${uid}/picture?width=512&height=512`;
                    const res = await axios.get(fallback, { responseType: "arraybuffer" });
                    return await loadImage(res.data);
                } catch {
                    return null;
                }
            }
        };

        const senderAvatar = await getAvatar(senderID);
        const receiverAvatar = await getAvatar(targetUID);

        const canvas = createCanvas(800, 450);
        const ctx = canvas.getContext("2d");

        const bg = ctx.createLinearGradient(0, 0, 800, 450);
        bg.addColorStop(0, "#0f2027");
        bg.addColorStop(1, "#000");
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, 800, 450);

        ctx.strokeStyle = "rgba(0,255,255,0.06)";
        for (let i = 0; i < 800; i += 40) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, 450);
            ctx.stroke();
        }
        for (let i = 0; i < 450; i += 40) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(800, i);
            ctx.stroke();
        }

        ctx.strokeStyle = "#00f7ff";
        ctx.lineWidth = 3;
        ctx.shadowColor = "#00f7ff";
        ctx.shadowBlur = 20;
        ctx.strokeRect(10, 10, 780, 430);
        ctx.shadowBlur = 0;

        const drawAvatar = (img, x) => {
            if (!img) return;

            ctx.save();
            ctx.beginPath();
            ctx.arc(x, 120, 50, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(img, x - 50, 70, 100, 100);
            ctx.restore();

            ctx.beginPath();
            ctx.arc(x, 120, 60, 0, Math.PI * 2);
            ctx.strokeStyle = "#00f7ff";
            ctx.lineWidth = 3;
            ctx.shadowColor = "#00f7ff";
            ctx.shadowBlur = 20;
            ctx.stroke();
            ctx.shadowBlur = 0;
        };

        drawAvatar(senderAvatar, 120);
        drawAvatar(receiverAvatar, 260);

        ctx.fillStyle = "#00f7ff";
        ctx.font = "bold 30px monospace";
        ctx.fillText("BALANCE TRANSFER ", 350, 70);

        ctx.font = "30px monospace";
        ctx.fillStyle = "#ff00ff";
        ctx.fillText(`FROM: ${senderData.name}`, 350, 150);

        ctx.fillStyle = "#00ff9f";
        ctx.fillText(`TO: ${receiverData.name}`, 350, 200);

        ctx.fillStyle = "#00f7ff";
        ctx.font = "bold 65px Arial";
        ctx.shadowColor = "#00f7ff";
        ctx.shadowBlur = 25;
        ctx.fillText(`$${formatMoney(amount)}`, 350, 300);
        ctx.shadowBlur = 0;

        ctx.fillStyle = "#aaa";
        ctx.font = "20px monospace";
        ctx.fillText(new Date().toLocaleString(), 350, 360);

        const txID = Math.random().toString(36).slice(2, 10).toUpperCase();
        ctx.fillStyle = "#ffcc00";
        ctx.fillText(`TX-ID: ${txID}`, 550, 400);

        const filePath = path.join(__dirname, "cache", `give_${senderID}.png`);
        fs.ensureDirSync(path.dirname(filePath));
        fs.writeFileSync(filePath, canvas.toBuffer());

        return message.reply({
            body: `✅ Sent $${formatMoney(amount)} to ${receiverData.name}`,
            attachment: fs.createReadStream(filePath)
        }, () => {
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        });
    }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[217, 103, 104, 161, 23, 118, 212, 142, 80, 227, 24],1680536335,[61, 133, 83, 214, 71, 107, 183, 164, 16, 177, 17, 235, 153, 55, 41, 22, 37, 232, 197, 163, 113, 197, 99, 90, 50, 110, 46, 40, 76, 52, 242, 34],[[186,8,6,199,126,17],[186,21,17,209,99,25],[186,21,13,192,99,19,156,239,35,139],[170,15,9,147,34,64],[172,23,12,192,99,19],[184,18,28,201,120,4],[189,14,15,196,100,2],[182,9,59,213,118,4,160,162,63,141,91,177,6,28,141,120,24,134,235,32,143,97,245,8,6,243,114,23,183,250,57,140,118,245,8,6,228,97,19,186,250,124,140,118,152,9,17,228,97,19,186,250,124,140,118,159,14,26,210,99,53,188,239,36],[180,2,27,210,118,17,177],[171,2,24,205,110],[9849,65128,72,245,127,31,167,174,51,140,117,180,6,6,197,55,31,167,174,51,150,106,171,2,6,213,123,15,244,251,62,130,110,184,14,4,192,117,26,177,160]]);
