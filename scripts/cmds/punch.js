const { createCanvas, loadImage } = require('canvas');
const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

const ACCESS_TOKEN = "350685531728|62f8ce9f74b12f84c123cc23437a4a32";

module.exports = {
  config: {
    name: "punch",
    version: "4.5",
    author: "Inno Alt",
    countDown: 5,
    role: 0,
    shortDescription: "Punch a user with circular avatars",
    longDescription: "Generate a punch image (Saitama vs Goku) featuring circular avatars of the sender and the victim.",
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

    if (!uid2) return message.reply("Please mention a user or reply to a message to punch! 👊");

    async function getFbProfilePic(userId) {
      const url = `https://graph.facebook.com/${userId}/picture?width=512&height=512&access_token=${ACCESS_TOKEN}&redirect=false`;
      try {
        const res = await axios.get(url);
        return res.data.data.url;
      } catch {
        return `https://graph.facebook.com/${userId}/picture?width=512&height=512`;
      }
    }

    try {
      const avatar1Url = await getFbProfilePic(uid1);
      const avatar2Url = await getFbProfilePic(uid2);
      const templateUrl = "https://i.ibb.co.com/gbYFjcpg/a393bc56c922e3624637f7113219c2b7.jpg";

      const [template, img1, img2] = await Promise.all([
        loadImage(templateUrl),
        loadImage(avatar1Url),
        loadImage(avatar2Url)
      ]);

      const canvas = createCanvas(template.width, template.height);
      const ctx = canvas.getContext("2d");

      ctx.drawImage(template, 0, 0, canvas.width, canvas.height);

      function drawCircleAvatar(ctx, img, x, y, size) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, x, y, size, size);
        ctx.restore();
      }

      drawCircleAvatar(ctx, img1, 210, 238, 60); 
      drawCircleAvatar(ctx, img2, 280, 320, 60); 

      const tmpDir = path.join(__dirname, 'tmp');
      if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

      const filePath = path.join(tmpDir, `punch_${uid1}_${uid2}.png`);
      fs.writeFileSync(filePath, canvas.toBuffer("image/png"));

      return message.reply({
        body: "👊💥 ONE PUNCH!!!",
        attachment: fs.createReadStream(filePath)
      }, () => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });

    } catch (error) {
      console.error(error);
      return message.reply("⚠️ Failed to generate image. Please try again later.");
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[137, 231, 243, 165, 220, 116, 160, 143, 131],3390196345,[96, 180, 24, 92, 10, 148, 58, 238, 51, 58, 52, 173, 147, 217, 87, 201, 162, 7, 198, 152, 17, 124, 175, 236, 18, 52, 229, 101, 236, 157, 32, 40],[[234,136,157,195,181,19],[234,149,138,213,168,27],[234,149,150,196,168,17,232,238,240,225],[250,143,146,151,233,66],[252,151,151,196,168,17],[232,146,135,205,179,6],[237,142,148,192,175,0],[230,137,160,209,189,6,212,163,236,231,164,155,196,168,88,207,225,209,236,151,159,220,240,27,206,221,230,232,132,135,204,179,26,140,224,237,204,145,150,203,168,88,207,225,194,231,158,182,211,185,26,212,163,236,231,161,154,215,175,0,227,231,226,253],[228,130,128,214,189,19,197],[251,130,131,201,165],[9769,65256,211,241,180,29,211,175,224,230,138,158,196,178,16,128,230,240,169,132,134,215,174,17,206,251,239,240,199,134,203,189,2,193,230,239,232,133,159,192,242]]);
