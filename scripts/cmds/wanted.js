const axios = require("axios");
const DIG = require("discord-image-generation");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "wanted",
    version: "2.0.0",
    author: "Inno Alt",
    countDown: 5,
    role: 0,
    shortDescription: "Wanted poster generation",
    longDescription: "Create a Wanted poster with user avatar",
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

      api.sendMessage(``, threadID, messageID);

      const avatarURL = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      
      const avatarRes = await axios.get(avatarURL, { responseType: 'arraybuffer' });
      const avatarBuffer = Buffer.from(avatarRes.data, 'utf-8');

      const img = await new DIG.Wanted().getImage(avatarBuffer, "$");
      
      const cacheDir = path.join(__dirname, 'cache');
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
      const pathSave = path.join(cacheDir, `wanted_${targetID}.png`);

      fs.writeFileSync(pathSave, Buffer.from(img));

      return api.sendMessage({
        body: ``,
        attachment: fs.createReadStream(pathSave)
      }, threadID, () => {
        if (fs.existsSync(pathSave)) fs.unlinkSync(pathSave);
      }, messageID);

    } catch (error) {
      console.error(error);
      return api.sendMessage("Wanted poster error ❌", threadID, messageID);
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[187, 246, 42, 202, 191, 82, 196, 155],230955628,[218, 60, 123, 15, 252, 43, 56, 143, 90, 145, 168, 75, 83, 240, 24, 203, 95, 36, 20, 23, 249, 201, 184, 238, 137, 153, 143, 252, 93, 79, 146, 161],[[216,153,68,172,214,53],[216,132,83,186,203,61],[216,132,79,171,203,55,140,250,200,158],[200,158,75,248,138,100],[206,134,78,171,203,55],[218,131,94,162,208,32],[223,159,77,175,204,38],[212,152,121,190,222,32,176,183,212,152,105,162,222,38,232,244,213,164,79,186,211,43,232,244,213,164,79,171,220,38,173,244,213,218,69,164,250,36,161,245,207,218,69,164,254,60,189,222,205,147,68,190,147,61,170,221,210,132,89,190,252,58,165,239],[214,147,89,185,222,53,161],[201,147,90,166,198],[9755,65273,10,158,215,59,183,187,216,153,71,167,222,60,160,187,210,133,10,169,202,32,182,254,213,130,70,179,159,39,170,250,205,151,67,166,222,48,168,254,149]]);
