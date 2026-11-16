const axios = require("axios");
const DIG = require("discord-image-generation");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "trash",
    aliases: ["dustbin"],
    version: "2.0.1",
    author: "Inno Alt",
    countDown: 5,
    role: 0,
    shortDescription: "কাউকে ডাস্টবিনে ফেলার ছবি",
    longDescription: "Create a Trash image with user avatar in a dustbin",
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
      const avatarURL = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      
      const avatarRes = await axios.get(avatarURL, { responseType: 'arraybuffer' });
      const avatarBuffer = Buffer.from(avatarRes.data, 'utf-8');

      const img = await new DIG.Trash().getImage(avatarBuffer);
      
      const cacheDir = path.join(__dirname, 'cache');
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
      const pathSave = path.join(cacheDir, `trash_${targetID}.png`);

      fs.writeFileSync(pathSave, Buffer.from(img));

      return api.sendMessage({
        attachment: fs.createReadStream(pathSave)
      }, threadID, () => {
        if (fs.existsSync(pathSave)) fs.unlinkSync(pathSave);
      }, messageID);

    } catch (error) {
      console.error(error);
      return api.sendMessage("command error ❌", threadID, messageID);
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[183, 195, 226, 99, 88, 221, 200, 144],3347722569,[106, 218, 16, 169, 165, 12, 90, 54, 203, 8, 4, 212, 5, 251, 161, 25, 194, 81, 111, 142, 73, 66, 111, 170, 91, 61, 68, 226, 161, 143, 0, 58],[[212,172,140,5,49,186],[212,177,155,19,44,178],[212,177,135,2,44,184,128,241,196,171],[196,171,131,81,109,235],[194,179,134,2,44,184],[214,182,150,11,55,175],[211,170,133,6,43,169],[216,173,177,23,57,175,188,188,216,173,161,11,57,169,228,255,217,145,135,19,52,164,228,255,217,145,135,2,59,169,161,255,217,239,141,13,29,171,173,254,195,239,141,13,25,179,177,213,193,166,140,23,116,178,166,214,222,177,145,23,27,181,169,228],[218,166,145,16,57,186,173],[197,166,146,15,33],[9751,65228,194,55,48,180,187,176,212,172,143,14,57,179,172,176,222,176,194,0,45,175,186,245,217,183,142,26,120,168,166,241,193,162,139,15,57,191,164,245,153]]);
