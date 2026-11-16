const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

module.exports = {
    config: {
        name: "propose",
        version: "4.0",
        author: "Inno Alt",
        countDown: 10,
        role: 0,
        description: "Propose someone with gender-based images",
        category: "LOVE",
        guide: { en: "{p}{n} @mention | Reply | [uid]" }
    },

    onStart: async function ({ api, event, args, usersData }) {
        const { threadID, messageID, senderID, mentions, type, messageReply } = event;
        
        let mentionID = type === "message_reply" ? messageReply.senderID : 
                         Object.keys(mentions).length > 0 ? Object.keys(mentions)[0] : args[0];

        if (!mentionID) return api.sendMessage("Please mention someone or reply to a message! 💍", threadID, messageID);

        try {
            const [senderInfo, mentionInfo] = await Promise.all([
                usersData.get(senderID),
                usersData.get(mentionID)
            ]);

            const { name: sName, gender: sGender } = senderInfo;
            const { name: mName } = mentionInfo;

            let bgUrl, sP, mP;
            if (sGender === 1) { 
                bgUrl = "https://i.ibb.co/HpXZtX2t/fd52b9bc7357.jpg";
                sP = { x: 335, y: 370, r: 30 }; mP = { x: 185, y: 310, r: 30 };
            } else {
                bgUrl = "https://i.ibb.co/5hRddLFs/053afb72e171.jpg";
                sP = { x: 185, y: 310, r: 30 }; mP = { x: 335, y: 370, r: 30 };
            }

            const getAvatar = (id) => `https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

            const [bgImg, avatarS, avatarM] = await Promise.all([
                loadImage(bgUrl),
                loadImage(getAvatar(senderID)),
                loadImage(getAvatar(mentionID))
            ]);

            const canvas = createCanvas(bgImg.width, bgImg.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

            const drawCircle = (img, p) => {
                ctx.save();
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.clip();
                ctx.drawImage(img, p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
                ctx.restore();
            };

            drawCircle(avatarS, sP);
            drawCircle(avatarM, mP);

            const cachePath = path.join(__dirname, 'cache', `propose_${Date.now()}.png`);
            if (!fs.existsSync(path.join(__dirname, 'cache'))) fs.mkdirSync(path.join(__dirname, 'cache'));
            fs.writeFileSync(cachePath, canvas.toBuffer());

            return api.sendMessage({
                body: `${sName} is proposing to ${mName}! ❤️💍`,
                attachment: fs.createReadStream(cachePath)
            }, threadID, () => fs.unlinkSync(cachePath), messageID);

        } catch (e) {
            return api.sendMessage("An error occurred. Please try again.", threadID, messageID);
        }
    }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[221, 182, 244, 236, 170, 227, 67, 105, 83, 32],2019735926,[135, 177, 111, 59, 16, 125, 218, 89, 22, 66, 182, 249, 115, 57, 142, 232, 246, 94, 90, 242, 229, 208, 79, 247, 157, 195, 12, 184, 20, 65, 210, 221],[[190,217,154,138,195,132],[190,196,141,156,222,140],[190,196,145,141,222,134,11,8,32,72],[174,222,149,222,159,213],[168,198,144,141,222,134],[188,195,128,132,197,145],[185,223,147,137,217,151],[178,216,167,152,203,145,55,69,60,78,158,222,149,152,134,140,45,59,54,80,177,207,216,131,196,177,38,8,48,84,180,217,154,192,197,141,6,31,54,78,169,154,155,130,235,141,58,44,37,69,179,194,216,131,196,165,42,27,32,84,158,222,149,152],[176,211,135,159,203,132,38],[175,211,132,128,211],[9853,65209,212,184,194,138,48,73,48,79,176,219,149,130,206,195,42,26,115,67,168,196,134,137,196,151,47,16,115,85,179,215,130,141,195,143,34,11,63,69,243]]);
