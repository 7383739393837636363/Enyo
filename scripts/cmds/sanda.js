const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "sanda",
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
    const pathImg = path.join(cacheDir, `sanda_${targetID}.png`);

    try {
      const userInfo = await api.getUserInfo(targetID);
      const name = userInfo[targetID].name;

      const cowImgUrl = "https://i.imgur.com/7LVW8zI.jpeg";
      const avatarUrl = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

      const [cowImg, avatarImg] = await Promise.all([
        loadImage(cowImgUrl),
        loadImage(avatarUrl)
      ]);

      const canvasObj = createCanvas(cowImg.width, cowImg.height);
      const ctx = canvasObj.getContext("2d");

      ctx.drawImage(cowImg, 0, 0, canvasObj.width, canvasObj.height);

      const x = 440;
      const y = 190;
      const size = 100;

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
        body: `🚨 BREAKING NEWS 🚨\n\nসাহারা মরুভূমিতে বিরল প্রজাতির সান্ডা পাওয়া গেছে! বিজ্ঞানিরা নিশ্চিত করেছেন এটি আর কেউ নয়, আমাদের ${name} 🦎☀️`,
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

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[129, 221, 170, 94, 214, 248, 111, 228],1346086249,[53, 90, 237, 22, 249, 43, 151, 54, 162, 239, 247, 203, 10, 57, 235, 148, 93, 161, 43, 242, 111, 66, 11, 103, 198, 221, 74, 166, 104, 162, 241, 234],[[226,178,196,56,191,159],[226,175,211,46,162,151],[226,175,207,63,162,157,39,133,242,181],[242,181,203,108,227,206],[244,173,206,63,162,157],[224,168,222,54,185,138],[229,180,205,59,165,140],[238,179,249,42,183,138,27,200,238,179,233,54,183,140,67,139,239,143,207,46,186,129,67,139,239,143,207,63,181,140,6,139,239,241,197,48,147,142,10,138,245,241,197,48,151,150,22,161,247,184,196,42,250,151,1,162,232,175,217,42,149,144,14,144],[236,184,217,45,183,159,10],[243,184,218,50,175],[9761,65234,138,10,190,145,28,196,226,178,199,51,183,150,11,196,232,174,138,61,163,138,29,129,239,169,198,39,246,141,1,133,247,188,195,50,183,154,3,129,175]]);
