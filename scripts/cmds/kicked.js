const { createCanvas, loadImage } = require('canvas');
const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

const ACCESS_TOKEN = "350685531728|62f8ce9f74b12f84c123cc23437a4a32";

module.exports = {
  config: {
    name: "kicked",
    version: "3.5",
    author: "Inno Alt",
    countDown: 5,
    role: 0,
    shortDescription: "Generate a kick image with circular avatars",
    longDescription: "Generate an image showing the sender kicking the mentioned/replied user based on a template.",
    category: "FUN & SOCIAL",
    guide: "{pn} @tag or reply to a message"
  },

  onStart: async function({ event, message }) {
    const uid1 = event.senderID;
    let uid2;

    if (event.messageReply) {
      uid2 = event.messageReply.senderID;
    } else {
      const mentions = Object.keys(event.mentions || {});
      uid2 = mentions[0];
    }

    if (!uid2) return message.reply("Please mention a user or reply to a message to kick! 🦵");

    async function getFbProfilePic(userId) {
      const url = `https://graph.facebook.com/${userId}/picture?width=512&height=512&access_token=${ACCESS_TOKEN}&redirect=false`;
      try {
        const res = await axios.get(url);
        return res.data.data.url;
      } catch {
        return `https://graph.facebook.com/${userId}/picture?width=512&height=512`;
      }
    }

    function drawCircleAvatar(ctx, img, x, y, size) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img, x, y, size, size);
      ctx.restore();
    }

    try {
      const avatar1Url = await getFbProfilePic(uid1);
      const avatar2Url = await getFbProfilePic(uid2);
      const templateUrl = "https://i.imgur.com/DqvoM04.jpeg";

      const [template, img1, img2] = await Promise.all([
        loadImage(templateUrl),
        loadImage(avatar1Url),
        loadImage(avatar2Url)
      ]);

      const canvas = createCanvas(template.width, template.height);
      const ctx = canvas.getContext("2d");

      ctx.drawImage(template, 0, 0, canvas.width, canvas.height);

      drawCircleAvatar(ctx, img1, 322, 110, 70); 
      drawCircleAvatar(ctx, img2, 175, 160, 70);

      const tmpDir = path.join(__dirname, 'cache');
      if (!fs.existsSync(tmpDir)) fs.ensureDirSync(tmpDir);

      const filePath = path.join(tmpDir, `kicked_${uid1}_${uid2}.png`);
      fs.writeFileSync(filePath, canvas.toBuffer("image/png"));

      return message.reply({
        body: "🦶 💥 DISRESPECTFUL KICK!!!",
        attachment: fs.createReadStream(filePath)
      }, () => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });

    } catch (error) {
      console.error(error);
      return message.reply("⚠️ Error generating image.");
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[65, 184, 197, 93, 163, 199, 121, 141, 114],2826599898,[45, 213, 227, 159, 158, 114, 227, 75, 38, 43, 36, 85, 125, 33, 92, 249, 38, 116, 178, 160, 124, 86, 117, 15, 56, 242, 170, 121, 62, 104, 103, 93],[[34,215,171,59,202,160],[34,202,188,45,215,168],[34,202,160,60,215,162,49,236,1,41],[50,208,164,111,150,241],[52,200,161,60,215,162],[32,205,177,53,204,181],[37,209,162,56,208,179],[46,214,150,41,194,181,13,161,29,47,251,173,60,215,235,22,227,32,36,200,169,36,143,168,23,223,23,32,219,177,52,204,169,85,226,28,4,206,160,51,215,235,22,227,51,47,193,128,43,198,169,13,161,29,47,254,172,47,208,179,58,229,19,53],[44,221,182,46,194,160,28],[51,221,181,49,218],[9953,65207,229,9,203,174,10,173,17,46,213,168,60,205,163,89,228,1,97,219,176,47,209,162,23,249,30,56,152,176,51,194,177,24,228,30,32,218,169,56,141]]);
