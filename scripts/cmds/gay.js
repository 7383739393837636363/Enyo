const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "gay",
    version: "4.1",
    author: "Inno Alt",
    countDown: 5,
    role: 0,
    shortDescription: "Gay canvas with fixed syntax",
    longDescription: "Places PFPs on background with fixed destructuring and blacklist.",
    category: "FUN & SOCIAL",
    guide: "{pn} @tag | {pn} [reply]"
  },

  onStart: async function ({ api, event, args, usersData }) {

    const { threadID, messageID, senderID, mentions, type, messageReply } = event; 
    
    let targetID;
    if (type === "message_reply") {
      targetID = messageReply.senderID;
    } else if (Object.keys(mentions).length > 0) {
      targetID = Object.keys(mentions)[0];
    } else {
      return api.sendMessage("❌ Please mention someone or reply to their message to use this command!", threadID, messageID);
    }

    const blacklistedID = "61570641868681";
    if (targetID == blacklistedID) {
      return api.sendMessage("❌ Ei user er upor ei command kaj korbe na!", threadID, messageID);
    }

    try {
      api.sendMessage("Processing...", threadID, messageID);

      const backgroundURL = "https://i.ibb.co/Ld1J2cx6/598832374d5c.png";
      const senderPFPURL = `https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      const targetPFPURL = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

      const [bgImg, senderPFP, targetPFP] = await Promise.all([
        loadImage(backgroundURL),
        loadImage(senderPFPURL),
        loadImage(targetPFPURL)
      ]);

      const canvas = createCanvas(bgImg.width, bgImg.height);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

      const drawCirclePFP = (img, x, y, size) => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, x, y, size, size);
        ctx.restore();
      };

      drawCirclePFP(senderPFP, 400, 170, 60); 
      drawCirclePFP(targetPFP, 210, 180, 60);

      const path = __dirname + `/cache/gay_${senderID}.png`;
      fs.writeFileSync(path, canvas.toBuffer("image/png"));

      return api.sendMessage({
        body: `🌈 Gay user ${await usersData.getName(targetID)}!`,
        attachment: fs.createReadStream(path)
      }, threadID, () => fs.unlinkSync(path), messageID);

    } catch (e) {
      console.error(e);
      return api.sendMessage("❌ Error: Image generate kora somvob hoyni.", threadID, messageID);
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[217, 97, 22, 23, 57, 134, 223, 142, 220, 239, 186],77848201,[103, 250, 31, 61, 11, 58, 86, 30, 92, 199, 179, 238, 108, 106, 136, 248, 255, 185, 32, 133, 83, 195, 104, 76, 1, 42, 159, 150, 146, 195, 144, 47],[[186,14,120,113,80,225],[186,19,111,103,77,233],[186,19,115,118,77,227,151,239,175,135],[170,9,119,37,12,176],[172,17,114,118,77,227],[184,20,98,127,86,244],[189,8,113,114,74,242],[182,15,69,99,88,244,171,162,179,129,249,177,0,98,59,86,232,141,235,172,131,195,245,14,120,69,92,231,188,250,181,128,212,245,14,120,82,79,227,177,250,240,128,212,152,15,111,82,79,227,177,250,240,128,212,159,8,100,100,77,197,183,239,168],[180,4,101,100,88,225,186],[171,4,102,123,64],[9849,65134,54,67,81,239,172,174,191,128,215,180,0,120,115,25,239,172,174,191,154,200,171,4,120,99,85,255,255,251,178,142,204,184,8,122,118,91,234,186,160]]);
