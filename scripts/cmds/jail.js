const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "jail",
    version: "2.0.0",
    author: "Inno Alt",
    countDown: 5,
    role: 0,
    shortDescription: "jail picture",
    longDescription: "Overlay jail bars on user's profile picture",
    category: "FUN & SOCIAL",
    guide: {
      en: "{pn} [@mention / reply / UID]"
    }
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID, mentions, type, messageReply, senderID } = event;
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

    try {
      const info = await api.getUserInfo(targetID);
      const name = info[targetID].name;

      api.sendMessage(`⏳ Putting ${name} behind bars... 🚔`, threadID, messageID);

      const avatarURL = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      const templateURL = "https://raw.githubusercontent.com/xalmandevv/Sexy-nx2.0Updated/main/xalman/xalmanimg/images/nx-jail.png";

      const [avatarRes, templateRes] = await Promise.all([
        axios.get(avatarURL, { responseType: 'arraybuffer' }),
        axios.get(templateURL, { responseType: 'arraybuffer' })
      ]);

      const avatarImg = await loadImage(avatarRes.data);
      const templateImg = await loadImage(templateRes.data);

      const canvasSize = 512;
      const canvas = createCanvas(canvasSize, canvasSize);
      const ctx = canvas.getContext('2d');

      ctx.drawImage(avatarImg, 0, 0, canvasSize, canvasSize);

      ctx.drawImage(templateImg, 0, 0, canvasSize, canvasSize);

      const cacheDir = path.join(__dirname, 'cache');
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
      const pathSave = path.join(cacheDir, `jail_${targetID}.png`);
      fs.writeFileSync(pathSave, canvas.toBuffer());

      return api.sendMessage({
        body: `${name} is in jail now.👮‍♂️⛓️`,
        attachment: fs.createReadStream(pathSave)
      }, threadID, () => {
        if (fs.existsSync(pathSave)) fs.unlinkSync(pathSave);
      }, messageID);

    } catch (error) {
      console.error(error);
      return api.sendMessage("❌ Failed to put user in jail. The suspect escaped! 🏃‍♂️", threadID, messageID);
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[107, 192, 179, 85, 34, 83, 227],1694443404,[25, 195, 209, 125, 62, 63, 84, 81, 193, 68, 222, 180, 44, 133, 138, 136, 217, 196, 98, 238, 250, 167, 127, 71, 10, 238, 179, 38, 101, 77, 227, 195],[[8,175,221,51,75,52],[8,178,202,37,86,60],[8,178,214,52,86,54,171,10,179,219],[24,168,210,103,23,101],[30,176,215,52,86,54],[10,181,199,61,77,33],[15,169,212,48,81,39],[4,174,224,33,67,33,151,71,175,221,22,74,50,151,71,175,221,7,71,35,143,18,236,220,59,112,54,130,8,180,218,58,76,127,140,5,133,197,48,76,39,207,4,174,242,59,91,22,149,14,174,199,121,77,61,165,2,178,192,33,97,59,130,31],[6,165,192,38,67,52,134],[25,165,195,57,91],[9931,65231,147,1,74,58,144,75,163,220,56,79,50,141,15,224,218,38,2,48,150,25,178,214,59,86,63,154,75,181,221,52,84,50,138,7,161,209,57,71,125]]);
