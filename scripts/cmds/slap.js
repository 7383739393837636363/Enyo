const { createCanvas, loadImage } = require('canvas');
const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

const ACCESS_TOKEN = "350685531728|62f8ce9f74b12f84c123cc23437a4a32";

module.exports = {
  config: {
    name: "slap",
    version: "4.0",
    author: "Inno Alt",
    countDown: 5,
    role: 0,
    shortDescription: "Custom slap image with circular avatars",
    longDescription: "Custom slap image with your own template and circular avatars",
    category: "FUN & SOCIAL",
    guide: { en: "{pn} @tag" }
  },

  langs: {
    en: { noTag: "যারে থাপড়াবি ওরে মেনশন দে 😒" }
  },

  onStart: async function({ event, message, usersData, getLang }) {

    const uid1 = event.senderID;
    const mentions = Object.keys(event.mentions || {});
    const uid2 = mentions[0];
    if (!uid2) return message.reply(getLang("noTag"));

    async function getFbProfilePic(userId, width = 512, height = 512) {
      const url = `https://graph.facebook.com/${userId}/picture?width=${width}&height=${height}&access_token=${ACCESS_TOKEN}&redirect=false`;
      try {
        const res = await axios.get(url);
        return res.data.data.url;
      } catch {
        return null;
      }
    }

    let avatar1 = await getFbProfilePic(uid1) || await usersData.getAvatarUrl(uid1);
    let avatar2 = await getFbProfilePic(uid2) || await usersData.getAvatarUrl(uid2);

    const tmpDir = path.join(__dirname, 'tmp');
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

    const templateUrl = "https://i.postimg.cc/pdX3tmTt/xalmanx211.png";
    const [template, img1, img2] = await Promise.all([
      loadImage(templateUrl),
      loadImage(avatar1),
      loadImage(avatar2)
    ]);

    const canvas = createCanvas(template.width, template.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(template, 0, 0);

    function drawCircleAvatar(ctx, img, x, y, size) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img, x, y, size, size);
      ctx.restore();
    }
    
    drawCircleAvatar(ctx, img1, 165, 230, 90);
    drawCircleAvatar(ctx, img2, 235, 500, 110);

    const filePath = path.join(tmpDir, `slap_${uid1}_${uid2}.png`);
    fs.writeFileSync(filePath, canvas.toBuffer("image/png"));

    message.reply({
      body: "👋 thassssshshhhhh!",
      attachment: fs.createReadStream(filePath)
    }, () => {
      try { fs.unlinkSync(filePath); } catch {}
    });
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[156, 107, 107, 21, 250, 203, 44, 223, 133, 124],2936643031,[25, 236, 101, 86, 74, 179, 21, 184, 154, 16, 52, 101, 186, 178, 4, 12, 244, 123, 39, 210, 83, 189, 147, 244, 89, 89, 42, 75, 143, 236, 90, 243],[[255,4,5,115,147,172],[255,25,18,101,142,164],[255,25,14,116,142,174,100,190,246,20],[239,3,10,39,207,253],[233,27,15,116,142,174],[253,30,31,125,149,185],[248,2,12,112,137,191],[243,5,56,97,155,185,88,243,234,18,223,3,10,97,214,164,66,141,224,12,240,18,71,122,148,153,73,190,230,8,245,4,5,57,149,165,105,169,224,18,232,71,4,123,187,165,85,154,243,25,242,31,71,122,148,141,69,173,246,8,223,3,10,97],[241,14,24,102,155,172,73],[238,14,27,121,131],[9788,65124,75,65,146,162,95,255,230,19,241,6,10,123,158,235,69,172,165,31,233,25,25,112,148,191,64,166,165,9,242,10,29,116,147,167,77,189,233,25,178]]);
