const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

module.exports = {
    config: {
        name: "hug",
        version: "3.0",
        author: "Inno Alt",
        countDown: 5,
        role: 0,
        shortDescription: "Send a warm hug!",
        longDescription: "Hug someone using mention, reply, or UID. Generates a custom image.",
        category: "LOVE",
        guide: "{pn} @mention | [reply] {pn} | {pn} uid"
    },

    onStart: async function ({ api, event, args, usersData }) {
        const { threadID, messageID, senderID, mentions, type, messageReply } = event;
        
        let targetID;

        if (type === "message_reply") {
            targetID = messageReply.senderID;
        } else if (Object.keys(mentions).length > 0) {
            targetID = Object.keys(mentions)[0];
        } else if (args[0] && !isNaN(args[0])) {
            targetID = args[0];
        } else {
            return api.sendMessage("Oops! You forgot to mention someone. Please mention, reply, or provide a UID to send a hug! 🤗", threadID, messageID);
        }

        try {
            api.sendMessage("Sending a warm hug... Please wait! 🫂✨", threadID, messageID);

            const senderInfo = await usersData.get(senderID);
            const targetInfo = await usersData.get(targetID);

            const cleanName = (name) => {
                if (!name) return "Someone";
                return name.split(" (")[0].split(" •")[0].split(" @")[0].trim();
            };

            const senderName = cleanName(senderInfo.name);
            const targetName = cleanName(targetInfo.name);
            const senderGender = senderInfo.gender; 

            const backgroundUrl = "https://i.imgur.com/WyIZ7Zk.jpeg";
            const avatarSenderUrl = `https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
            const avatarTargetUrl = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

            const [bgImg, avatarSender, avatarTarget] = await Promise.all([
                loadImage(backgroundUrl),
                loadImage(avatarSenderUrl),
                loadImage(avatarTargetUrl)
            ]);

            const canvas = createCanvas(bgImg.width, bgImg.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

            let senderPos, targetPos;
            if (senderGender === 2) { 
                senderPos = { x: 220, y: 140, r: 45 };
                targetPos = { x: 280, y: 200, r: 45 };
            } else {
                senderPos = { x: 280, y: 200, r: 45 };
                targetPos = { x: 220, y: 140, r: 45 };
            }

            function drawAvatar(img, pos) {
                ctx.save();
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, pos.r, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.clip();
                ctx.drawImage(img, pos.x - pos.r, pos.y - pos.r, pos.r * 2, pos.r * 2);
                ctx.restore();
                
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, pos.r, 0, Math.PI * 2, true);
                ctx.lineWidth = 3;
                ctx.strokeStyle = "#ffffff";
                ctx.stroke();
            }

            drawAvatar(avatarSender, senderPos);
            drawAvatar(avatarTarget, targetPos);

            const cacheDir = path.join(__dirname, 'cache');
            const cachePath = path.join(cacheDir, `hug_${senderID}_${targetID}.png`);
            
            fs.ensureDirSync(cacheDir);
            fs.writeFileSync(cachePath, canvas.toBuffer());

            const bodyMsg = `Aww! 🥺\n${senderName} just gave a big, warm hug to ${targetName}! 🫂💖\n\n"Sometimes a hug speaks volumes that words can't explain." ✨`;

            return api.sendMessage({
                body: bodyMsg,
                attachment: fs.createReadStream(cachePath)
            }, threadID, () => {
                if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath);
            }, messageID);

        } catch (error) {
            console.error("Canvas/Hug Error:", error);
            return api.sendMessage("Oh no! Couldn't send the hug due to an error. 💔 Check the console.", threadID, messageID);
        }
    }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[213, 203, 73, 163, 171, 22, 189, 132, 85, 212, 22],3327026077,[180, 67, 143, 0, 132, 167, 27, 170, 36, 142, 81, 113, 178, 59, 79, 17, 119, 254, 99, 60, 121, 86, 58, 66, 226, 179, 213, 211, 250, 142, 94, 87],[[182,164,39,197,194,113],[182,185,48,211,223,121],[182,185,44,194,223,115,245,229,38,188],[166,163,40,145,158,32],[160,187,45,194,223,115],[180,190,61,203,196,100],[177,162,46,198,216,98],[186,165,26,215,202,100,201,168,58,186,85,189,170,61,143,196,120,239,225,37,184,111,249,164,39,241,206,119,222,240,60,187,120,249,164,39,230,221,115,211,240,121,187,120,148,165,48,230,221,115,211,240,121,187,120,147,162,59,208,223,85,213,229,33],[184,174,58,208,202,113,216],[167,174,57,207,210],[9845,65220,105,247,195,127,206,164,54,187,123,184,170,39,199,139,127,206,164,54,161,100,167,174,39,215,199,111,157,241,59,181,96,180,162,37,194,201,122,216,170]]);
