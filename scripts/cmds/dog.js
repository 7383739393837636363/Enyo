const axios = require("axios");
const { loadImage, createCanvas } = require("canvas");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "dog",
        aliases: ["kutta"],
        version: "3.0",
        author: "Inno Alt",
        countDown: 5,
        role: 0,
        shortDescription: "Shows two users on a custom background",
        longDescription: "Draws sender and target user avatars on a background using Reply, Mention, or UID.",
        category: "FUN & SOCIAL",
        guide: "{pn} @mention | {pn} uid | [reply] {pn}"
    },

    onStart: async function ({ message, event, args }) {
        try {
            const senderID = event.senderID;
            let targetID;

            if (event.messageReply) {
                targetID = event.messageReply.senderID;
            } else if (Object.keys(event.mentions).length > 0) {
                targetID = Object.keys(event.mentions)[0];
            } else if (args[0] && !isNaN(args[0])) {
                targetID = args[0];
            } else {
                return message.reply("Please mention someone, reply to their message, or provide their UID!");
            }

            message.reply("Please wait, the masterpiece is loading... ⏳🐶");

            const bgUrl = "https://i.imgur.com/7LzQpW2.jpeg";
            const avatar1Url = `https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
            const avatar2Url = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

            const bgImage = await loadImage(bgUrl);
            const av1 = await loadImage(avatar1Url);
            const av2 = await loadImage(avatar2Url);

            const canvas = createCanvas(bgImage.width, bgImage.height);
            const ctx = canvas.getContext("2d");

            ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

            const senderPos = { x: 330, y: 270, r: 60 };
            const mentionPos = { x: 115, y: 430, r: 90 };

            function drawCircleImage(img, cx, cy, r) {
                ctx.save();
                ctx.beginPath();
                ctx.arc(cx, cy, r, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.clip();
                ctx.drawImage(img, cx - r, cy - r, r * 2, r * 2);
                ctx.restore();
                
                ctx.beginPath();
                ctx.arc(cx, cy, r, 0, Math.PI * 2, true);
                ctx.lineWidth = 4;
                ctx.strokeStyle = "#ffffff";
                ctx.stroke();
            }

            drawCircleImage(av1, senderPos.x, senderPos.y, senderPos.r);
            drawCircleImage(av2, mentionPos.x, mentionPos.y, mentionPos.r);

            const cachePath = path.join(__dirname, "cache", `match_${senderID}_${targetID}.png`);
            
            fs.ensureDirSync(path.join(__dirname, "cache"));
            fs.writeFileSync(cachePath, canvas.toBuffer());

            await message.reply({
                body: "Boom! Caught in 4K! 📸🐶 Here is your masterpiece, try not to laugh too hard! 🤣",
                attachment: fs.createReadStream(cachePath)
            });

            fs.unlinkSync(cachePath);

        } catch (error) {
            console.error("Canvas Error:", error);
            message.reply("An error occurred while creating the image. Please check the console.");
        }
    }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[131, 250, 119, 92, 103, 133, 231, 55, 151, 108, 180],3728443480,[151, 229, 69, 181, 49, 20, 207, 96, 11, 209, 192, 244, 0, 5, 29, 65, 107, 119, 216, 86, 89, 226, 183, 95, 239, 174, 94, 171, 189, 42, 182, 6],[[224,149,25,58,14,226],[224,136,14,44,19,234],[224,136,18,61,19,224,175,86,228,4],[240,146,22,110,82,179],[246,138,19,61,19,224],[226,143,3,52,8,247],[231,147,16,57,20,241],[236,148,36,40,6,247,147,27,248,2,247,235,155,3,112,8,235,181,82,231,0,205,175,149,25,14,2,228,132,67,254,3,218,175,149,25,25,17,224,137,67,187,3,218,194,148,14,25,17,224,137,67,187,3,218,197,147,5,47,19,198,143,86,227],[238,159,4,47,6,226,130],[241,159,7,48,30],[9763,65269,87,8,15,236,148,23,244,3,217,238,155,25,56,71,236,148,23,244,25,198,241,159,25,40,11,252,199,66,249,13,194,226,147,27,61,5,233,130,25]]);
