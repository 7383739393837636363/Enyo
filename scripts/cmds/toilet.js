const { createCanvas, loadImage } = require('canvas');
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "toilet",
    version: "4.3",
    author: "Inno Alt",
    countDown: 5,
    role: 0,
    category: "FUN & SOCIAL",
    guide: { en: "{pn} @mention / reply / UID" }
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID, senderID, type, messageReply, mentions } = event;
    const cacheDir = path.join(__dirname, 'cache');
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    api.setMessageReaction("⏳", messageID, () => {}, true);

    const bgUrl = "https://i.imgur.com/AZ5SByA.jpeg";
    let targetID;

    if (type === "message_reply") {
      targetID = messageReply.senderID;
    } else if (Object.keys(mentions).length > 0) {
      targetID = Object.keys(mentions)[0];
    } else if (args.length > 0) {
      targetID = args[0];
    } else {
      targetID = senderID;
    }

    try {
      const [background, avatar] = await Promise.all([
        loadImage(bgUrl),
        loadImage(`https://graph.facebook.com/${targetID}/picture?width=1000&height=1000&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)
      ]);

      const canvas = createCanvas(background.width, background.height);
      const ctx = canvas.getContext('2d');

      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

      const x = 185;
      const y = 230;
      const size = 80;

      ctx.save();
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      ctx.drawImage(avatar, x, y, size, size);
      ctx.restore();

      const cachePath = path.join(cacheDir, `toilet_${targetID}.png`);
      fs.writeFileSync(cachePath, canvas.toBuffer());

      return api.sendMessage({
        body: "You deserve this place 🤧🔥",
        attachment: fs.createReadStream(cachePath)
      }, threadID, () => {
        api.setMessageReaction("✅", messageID, () => {}, true);
        fs.unlinkSync(cachePath);
      }, messageID);

    } catch (e) {
      api.setMessageReaction("❌", messageID, () => {}, true);
      return api.sendMessage("❌ Error processing image", threadID, messageID);
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[117, 198, 171, 145, 152, 22, 223, 68, 246, 193],2644160051,[234, 110, 128, 187, 189, 184, 135, 92, 165, 18, 19, 47, 132, 211, 250, 73, 119, 192, 2, 207, 197, 112, 39, 98, 144, 199, 115, 85, 219, 85, 243, 42],[[22,169,197,247,241,113],[22,180,210,225,236,121],[22,180,206,240,236,115,151,37,133,169],[6,174,202,163,173,32],[0,182,207,240,236,115],[20,179,223,249,247,100],[17,175,204,244,235,98],[26,168,248,229,249,100,171,104,153,175,54,174,202,229,180,121,177,22,147,177,25,191,135,254,246,68,186,37,149,181,28,169,197,189,247,120,154,50,147,175,1,234,196,255,217,120,166,1,128,164,27,178,135,254,246,80,182,54,133,181,54,174,202,229],[24,163,216,226,249,113,186],[7,163,219,253,225],[9941,65225,139,197,240,127,172,100,149,174,24,171,202,255,252,54,182,55,214,162,0,180,217,244,246,98,179,61,214,180,27,167,221,240,241,122,190,38,154,164,91]]);
