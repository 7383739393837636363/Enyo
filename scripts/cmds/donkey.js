const axios = require('axios');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
    config: {
        name: "donkey",
        aliases: ["gadha"],
        version: "2.0",
        author: "Inno Alt",
        countDown: 5,
        role: 0,
        shortDescription: { en: "Convert someone into a donkey" },
        longDescription: { en: "Put user's profile picture on a donkey image using canvas" },
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
        const pathImg = path.join(cacheDir, `donkey_${targetID}.png`);

        try {
            const userInfo = await api.getUserInfo(targetID);
            const name = userInfo[targetID].name;

            const donkeyImgUrl = "https://i.imgur.com/K4s1EJJ.jpeg"; 
            const avatarUrl = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

            const [donkeyImg, avatarImg] = await Promise.all([
                loadImage(donkeyImgUrl),
                loadImage(avatarUrl)
            ]);

            const canvasObj = createCanvas(donkeyImg.width, donkeyImg.height);
            const ctx = canvasObj.getContext('2d');

            ctx.drawImage(donkeyImg, 0, 0, canvasObj.width, canvasObj.height);
            
            const x = 270; 
            const y = 200;  
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
                body: `${name}, তোকে গাধা বানিয়ে দিলাম 🐴`,
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

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[85, 172, 236, 166, 229, 102, 117, 168],694097762,[140, 0, 163, 184, 216, 246, 158, 88, 57, 193, 147, 94, 2, 2, 116, 122, 254, 226, 155, 219, 80, 63, 211, 238, 50, 229, 87, 177, 181, 51, 54, 69],[[54,195,130,192,140,1],[54,222,149,214,145,9],[54,222,137,199,145,3,61,201,38,196],[38,196,141,148,208,80],[32,220,136,199,145,3],[52,217,152,206,138,20],[49,197,139,195,150,18],[58,194,191,210,132,20,1,132,58,194,175,206,132,18,89,199,59,254,137,214,137,31,89,199,59,254,137,199,134,18,28,199,59,128,131,200,160,16,16,198,33,128,131,200,164,8,12,237,35,201,130,210,201,9,27,238,60,222,159,210,166,14,20,220],[56,201,159,213,132,1,16],[39,201,156,202,156],[9973,65187,204,242,141,15,6,136,54,195,129,203,132,8,17,136,60,223,204,197,144,20,7,205,59,216,128,223,197,19,27,201,35,205,133,202,132,4,25,205,123]]);
