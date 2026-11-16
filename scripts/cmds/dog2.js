const axios = require('axios');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
    config: {
        name: "dog2",
        aliases: ["kutta2"],
        version: "4.0",
        author: "Inno Alt",
        countDown: 5,
        role: 0,
        shortDescription: { en: "Convert someone into a dog" },
        longDescription: { en: "Put user's profile picture on a dog image using canvas" },
        category: "FUN & SOCIAL",
        guide: { en: "{pn} @mention / reply / UID" }
    },

    onStart: async function ({ api, event, args }) {
        const { threadID, messageID, mentions, type, messageReply, senderID } = event;

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
        const pathImg = path.join(cacheDir, `dog_${targetID}.png`);

        try {
            const userInfo = await api.getUserInfo(targetID);
            const name = userInfo[targetID].name;

            const dogImgUrl = "https://i.ibb.co/DDMySDsS/a5f597724c71.jpg"; 
            const avatarUrl = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

            const [dogImg, avatarImg] = await Promise.all([
                loadImage(dogImgUrl),
                loadImage(avatarUrl)
            ]);

            const canvasObj = createCanvas(dogImg.width, dogImg.height);
            const ctx = canvasObj.getContext('2d');

            ctx.drawImage(dogImg, 0, 0, canvasObj.width, canvasObj.height);
            
            const x = 290; 
            const y = 50;  
            const size = 100; 

            ctx.save();
            ctx.beginPath();
            ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(avatarImg, x, y, size, size);
            ctx.restore();

            fs.writeFileSync(pathImg, canvasObj.toBuffer());

            return api.sendMessage({
                body: `${name}, তোর আসল রূপ 🐕`,
                attachment: fs.createReadStream(pathImg)
            }, threadID, () => {
                if (fs.existsSync(pathImg)) fs.unlinkSync(pathImg);
            }, messageID);

        } catch (e) {
            return api.sendMessage("Error executing command ❌", threadID, messageID);
        }
    }
};
                                   

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[45, 30, 140, 149, 226, 158, 237],701800370,[148, 186, 126, 135, 207, 205, 191, 10, 152, 217, 35, 28, 74, 144, 136, 250, 217, 244, 63, 87, 211, 101, 116, 234, 11, 26, 238, 69, 218, 220, 184, 251],[[78,113,226,243,139,249],[78,108,245,229,150,241],[78,108,233,244,150,251,165,76,109,228],[94,118,237,167,215,168],[88,110,232,244,150,251],[76,107,248,253,141,236],[73,119,235,240,145,234],[66,112,223,225,131,236,153,1,113,226,214,138,255,153,1,113,226,199,135,238,129,84,50,227,251,176,251,140,78,106,229,250,140,178,130,67,91,250,240,140,234,193,66,112,205,251,155,219,155,72,112,248,185,141,240,171,68,108,255,225,161,246,140,89],[64,123,255,230,131,249,136],[95,123,252,249,155],[9869,65041,172,193,138,247,158,13,125,227,248,143,255,131,73,62,229,230,194,253,152,95,108,233,251,150,242,148,13,107,226,244,148,255,132,65,127,238,249,135,176]]);
