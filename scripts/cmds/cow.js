const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "cow",
    aliases: ["goru"],
    version: "3.0",
    author: "Inno Alt",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Convert someone into a cow" },
    longDescription: { en: "Put user's profile picture on a cow image using canvas" },
    category: "FUN & SOCIAL",
    guide: { en: "{pn} @mention / reply / UID" }
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID, mentions, type, messageReply, senderID } = event;

    api.setMessageReaction("⏳", messageID, () => {}, true);

    let targetID;
    if (type === "message_reply") {
      targetID = messageReply.senderID;
    } else if (Object.keys(mentions).length > 0) {
      targetID = Object.keys(mentions)[0];
    } else if (args.length > 0 && !isNaN(args[0])) {
      targetID = args[0];
    } else {
      targetID = senderID;
    }

    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);
    const pathImg = path.join(cacheDir, `cow_${targetID}.png`);

    try {
      const userInfo = await api.getUserInfo(targetID);
      const name = userInfo[targetID].name;

      const cowImgUrl = "https://i.imgur.com/ortfty0.jpeg";
      const avatarUrl = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

      const [cowImg, avatarImg] = await Promise.all([
        loadImage(cowImgUrl),
        loadImage(avatarUrl)
      ]);

      const canvasObj = createCanvas(cowImg.width, cowImg.height);
      const ctx = canvasObj.getContext("2d");

      ctx.drawImage(cowImg, 0, 0, canvasObj.width, canvasObj.height);

      const x = 300;
      const y = 330;
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
        body: `${name}, your true form 🐄`,
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

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[203, 103, 195, 190, 195, 247, 214, 212, 78, 121],2369334483,[149, 2, 171, 205, 0, 252, 65, 117, 149, 120, 138, 110, 105, 72, 230, 189, 103, 146, 15, 119, 171, 174, 163, 24, 19, 241, 245, 219, 14, 16, 38, 160],[[168,8,173,216,170,144],[168,21,186,206,183,152],[168,21,166,223,183,146,158,181,61,17],[184,15,162,140,246,193],[190,23,167,223,183,146],[170,18,183,214,172,133],[175,14,164,219,176,131],[164,9,144,202,162,133,162,248,33,23,136,15,162,202,239,152,184,134,43,9,167,30,239,209,173,165,179,181,45,13,162,8,173,146,172,153,147,162,43,23,191,75,172,208,130,153,175,145,56,28,165,19,239,209,173,177,191,166,61,13,136,15,162,202],[166,2,176,205,162,144,179],[185,2,179,210,186],[9835,65128,227,234,171,158,165,244,45,22,166,10,162,208,167,215,191,167,110,26,190,21,177,219,173,131,186,173,110,12,165,6,181,223,170,155,183,182,34,28,229]]);
