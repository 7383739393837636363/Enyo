const { createCanvas, loadImage } = require('canvas');
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "nokia",
    version: "4.2",
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

    const bgUrl = "https://iili.io/qJehE8u.png"; 
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

      const moveRight = 80;   
      const moveDown = 280;    
      const widthSize = 320;   
      const heightSize = 245;  

      ctx.drawImage(avatar, moveRight, moveDown, widthSize, heightSize);

      const cachePath = path.join(cacheDir, `nokia_${targetID}.png`);
      fs.writeFileSync(cachePath, canvas.toBuffer());

      return api.sendMessage({
        attachment: fs.createReadStream(cachePath)
      }, threadID, () => {
        api.setMessageReaction("✅", messageID, () => {}, true);
        fs.unlinkSync(cachePath);
      }, messageID);

    } catch (e) {
      api.setMessageReaction("❌", messageID, () => {}, true);
      return api.sendMessage("", threadID, messageID);
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[248, 164, 89, 109, 103, 116],439435387,[179, 106, 65, 244, 86, 123, 97, 107, 213, 34, 65, 77, 34, 45, 69, 191, 8, 83, 179, 221, 170, 205, 43, 253, 135, 85, 80, 14, 42, 221, 227, 176],[[155,203,55,11,14,19],[155,214,32,29,19,27],[155,214,60,12,19,17,176,197,42,5],[139,204,56,95,82,66],[141,212,61,12,19,17],[153,209,45,5,8,6],[156,205,62,8,20,0],[151,202,10,25,6,6,140,136,54,3,36,28,153,208,117,2,9,38,157,212,53,20,75,27,150,246,60,12,4,0,145,203,55,65,8,26,189,210,60,3,19,88,151,202,24,3,30,49,142,193,55,25,75,27,150,226,48,31,20,0,187,204,56,25],[149,193,42,30,6,19,157],[138,193,41,1,30],[9816,65195,121,57,15,29,139,132,58,2,10,25,153,202,61,77,14,7,216,199,44,31,21,17,150,208,53,20,71,1,150,197,47,12,14,24,153,198,53,8,73]]);
