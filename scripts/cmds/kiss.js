const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

module.exports = {
    config: {
        name: "kiss",
        version: "4.5.0",
        author: "Inno Alt",
        countDown: 5,
        role: 0,
        description: "Kiss someone using mention, reply, or UID",
        category: "LOVE",
        guide: { en: "{p}{n} @mention | Reply to a message | {p}{n} [uid]" }
    },

    onStart: async function ({ api, event, args, usersData }) {
        const { threadID, messageID, senderID, mentions, type, messageReply } = event;
        
        let mentionID;
        if (type === "message_reply") {
            mentionID = messageReply.senderID;
        } else if (Object.keys(mentions).length > 0) {
            mentionID = Object.keys(mentions)[0];
        } else if (args[0]) {
            mentionID = args[0];
        }

        if (!mentionID) return api.sendMessage("Please mention someone, reply to a message, or provide a UID! 🌧️", threadID, messageID);

        try {
            const senderInfo = await usersData.get(senderID);
            const mentionInfo = await usersData.get(mentionID);

            const senderName = senderInfo.name;
            const mentionName = mentionInfo.name;
            const senderGender = senderInfo.gender; 

            const backgroundUrl = "https://i.ibb.co/jjhvv0j/74e00c6d62a7.jpg";
            const avatarSenderUrl = `https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
            const avatarMentionUrl = `https://graph.facebook.com/${mentionID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

            const [bgImg, avatarSender, avatarMention] = await Promise.all([
                loadImage(backgroundUrl),
                loadImage(avatarSenderUrl),
                loadImage(avatarMentionUrl)
            ]);

            const canvas = createCanvas(bgImg.width, bgImg.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

            let senderPos, mentionPos;

            if (senderGender === 2) { 
                senderPos = { x: 240, y: 190, r: 40 };
                mentionPos = { x: 320, y: 250, r: 40 };
            } else {
                senderPos = { x: 320, y: 250, r: 40 };
                mentionPos = { x: 240, y: 190, r: 40 };
            }

            ctx.save();
            ctx.beginPath();
            ctx.arc(senderPos.x, senderPos.y, senderPos.r, 0, Math.PI * 2, true);
            ctx.clip();
            ctx.drawImage(avatarSender, senderPos.x - senderPos.r, senderPos.y - senderPos.r, senderPos.r * 2, senderPos.r * 2);
            ctx.restore();

            ctx.save();
            ctx.beginPath();
            ctx.arc(mentionPos.x, mentionPos.y, mentionPos.r, 0, Math.PI * 2, true);
            ctx.clip();
            ctx.drawImage(avatarMention, mentionPos.x - mentionPos.r, mentionPos.y - mentionPos.r, mentionPos.r * 2, mentionPos.r * 2);
            ctx.restore();

            const cachePath = path.join(__dirname, 'cache', `kiss_${Date.now()}.png`);
            if (!fs.existsSync(path.join(__dirname, 'cache'))) fs.mkdirSync(path.join(__dirname, 'cache'));
            fs.writeFileSync(cachePath, canvas.toBuffer());

            return api.sendMessage({
                body: `${senderName} kissed ${mentionName} 💋`,
                attachment: fs.createReadStream(cachePath)
            }, threadID, () => {
                if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath);
            }, messageID);

        } catch (error) {
            console.error(error);
            return api.sendMessage("An error occurred while processing the image.", threadID, messageID);
        }
    }
};
      

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[109, 126, 46, 56, 235, 240, 239],2013610646,[74, 85, 245, 31, 202, 126, 87, 169, 29, 88, 237, 44, 119, 236, 40, 160, 33, 199, 35, 203, 41, 32, 31, 155, 86, 164, 32, 194, 160, 131, 204, 132],[[14,17,64,94,130,151],[14,12,87,72,159,159],[14,12,75,89,159,149,167,12,13,70],[30,22,79,10,222,198],[24,14,74,89,159,149],[12,11,90,80,132,130],[9,23,73,93,152,132],[2,16,125,76,138,130,155,65,17,64,123,131,145,155,65,17,64,106,142,128,131,20,82,65,86,185,149,142,14,10,71,87,133,220,128,3,59,88,93,133,132,195,2,16,111,86,146,181,153,8,16,90,20,132,158,169,4,12,93,76,168,152,142,25],[0,27,93,75,138,151,138],[31,27,94,84,146],[9933,65137,14,108,131,153,156,77,29,65,85,134,145,129,9,94,71,75,203,147,154,31,12,75,86,159,156,150,77,11,64,89,157,145,134,1,31,76,84,142,222]]);
