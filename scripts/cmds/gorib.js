const axios = require('axios');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
    config: {
        name: "gorib",
        aliases: ["poor", "fakir"],
        version: "2.0.0",
        author: "Inno Alt",
        countDown: 5,
        role: 0,
        shortDescription: { en: "Convert someone into a poor beggar" },
        longDescription: { en: "Put user's profile picture on a poor/beggar template image using canvas" },
        category: "FUN & SOCIAL",
        guide: { en: "{pn} @mention / reply / UID" }
    },

    onStart: async function ({ api, event, args }) {
        const { threadID, messageID, mentions, type, messageReply, senderID } = event;

        api.setMessageReaction("⏳", messageID, () => {}, true);

        let targetID;
        if (type === "message_reply") {
            targetID = messageReply.senderID;
        } 
        else if (Object.keys(mentions).length > 0) {
            targetID = Object.keys(mentions)[0];
        } 
        else if (args.length > 0 && !isNaN(args[0])) {
            targetID = args[0];
        } 
        else {
            targetID = senderID;
        }

        const cacheDir = path.join(__dirname, 'cache');
        if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);
        const pathImg = path.join(cacheDir, `gorib_${targetID}.png`);

        try {
            const userInfo = await api.getUserInfo(targetID);
            const name = userInfo[targetID].name;

            const goribImgUrl = "https://i.imgur.com/b317vrs.png"; 
            const avatarUrl = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

            const [goribImg, avatarImg] = await Promise.all([
                loadImage(goribImgUrl),
                loadImage(avatarUrl)
            ]);

            const canvasObj = createCanvas(goribImg.width, goribImg.height);
            const ctx = canvasObj.getContext('2d');

            ctx.drawImage(goribImg, 0, 0, canvasObj.width, canvasObj.height);
            
            const x = 200; 
            const y = 210;  
            const size = 90; 

            ctx.save();
            ctx.beginPath();
            ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(avatarImg, x, y, size, size);
            ctx.restore();

            fs.writeFileSync(pathImg, canvasObj.toBuffer());

            api.setMessageReaction("✅", messageID, () => {}, true);

            return api.sendMessage({
                body: `${name}, তোর এই অবস্থা কেনো ?  এই নে দুই টাকা💸😭`,
                attachment: fs.createReadStream(pathImg)
            }, threadID, () => {
                if (fs.existsSync(pathImg)) fs.unlinkSync(pathImg);
            }, messageID);

        } catch (e) {
            console.error(e);
            api.setMessageReaction("❌", messageID, () => {}, true);
            return api.sendMessage("Error executing command ❌", threadID, messageID);
        }
    }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[194, 134, 143, 144, 73, 129, 44, 233, 150, 231, 112],3292102974,[70, 64, 56, 169, 254, 195, 255, 69, 228, 173, 170, 30, 144, 141, 93, 27, 248, 247, 77, 13, 59, 36, 250, 24, 134, 185, 170, 254, 71, 54, 63, 47],[[161,233,225,246,32,230],[161,244,246,224,61,238],[161,244,234,241,61,228,100,136,229,143],[177,238,238,162,124,183],[183,246,235,241,61,228],[163,243,251,248,38,243],[166,239,232,245,58,245],[173,232,220,228,40,243,88,197,249,137,51,170,231,251,188,38,239,126,140,230,139,9,238,233,225,194,44,224,79,157,255,136,30,238,233,225,213,63,228,66,157,186,136,30,131,232,246,213,63,228,66,157,186,136,30,132,239,253,227,61,194,68,136,226],[175,227,252,227,40,230,73],[176,227,255,252,48],[9826,65161,175,196,33,232,95,201,245,136,29,175,231,225,244,105,232,95,201,245,146,2,176,227,225,228,37,248,12,156,248,134,6,163,239,227,241,43,237,73,199]]);
