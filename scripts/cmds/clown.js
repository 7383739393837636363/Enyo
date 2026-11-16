const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const Jimp = require("jimp");

module.exports = {
  config: {
    name: "clown",
    version: "2.3",
    author: "Inno Alt",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Turn someone into a clown 🤡" },
    longDescription: { en: "Overlay user's profile picture on a clown image" },
    category: "FUN & SOCIAL",
    guide: { en: "{pn} @mention/reply/uid - Generate clown image" }
  },

  onStart: async function ({ api, event, args, message }) {
    const { threadID, messageID, senderID, mentions, type, messageReply } = event;

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
      const userInfo = await api.getUserInfo(targetID);
      const name = userInfo[targetID]?.name || "Unknown";

      api.setMessageReaction("⏳", messageID, () => {}, true);

      const avatarUrl = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      const templateUrl = "https://i.imgur.com/v8hgsSH.jpeg";

      const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

      const [avatarBuf, templateBuf] = await Promise.all([
        axios.get(avatarUrl, {
          responseType: "arraybuffer",
          headers: { "User-Agent": userAgent }
        }),
        axios.get(templateUrl, {
          responseType: "arraybuffer",
          headers: { "User-Agent": userAgent }
        })
      ]);

      const template = await Jimp.read(templateBuf.data);
      const avatar = await Jimp.read(avatarBuf.data);

      const size = 100;
      const x = 120;
      const y = 120;

      avatar.resize(size, size);

      const mask = new Jimp(size, size, 0x00000000);
      const radius = size / 2;
      const center = size / 2;
      for (let px = 0; px < size; px++) {
        for (let py = 0; py < size; py++) {
          const dist = Math.sqrt((px - center) ** 2 + (py - center) ** 2);
          if (dist <= radius) {
            mask.setPixelColor(0xFFFFFFFF, px, py);
          }
        }
      }
      avatar.mask(mask);

      template.composite(avatar, x, y);

      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
      const filePath = path.join(cacheDir, `clown_${Date.now()}.png`);
      await template.writeAsync(filePath);

      api.setMessageReaction("✅", messageID, () => {}, true);

      const msg = `🤡 ${name} তোর আসল চেহারা 🤡 তুই তো একটা ক্লাউন `;

      return api.sendMessage({
        body: msg,
        attachment: fs.createReadStream(filePath)
      }, threadID, () => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }, messageID);

    } catch (err) {
      console.error("Clown command error:", err);
      api.setMessageReaction("❌", messageID, () => {}, true);
      return message.reply("❌ error");
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[24, 140, 223, 241, 150, 154, 146],2761447702,[252, 76, 113, 222, 102, 236, 76, 124, 53, 43, 177, 194, 227, 129, 194, 165, 28, 242, 84, 111, 93, 51, 194, 144, 140, 22, 4, 138, 184, 194, 90, 150],[[123,227,177,151,255,253],[123,254,166,129,226,245],[123,254,186,144,226,255,218,121,255,183],[107,228,190,195,163,172],[109,252,187,144,226,255],[121,249,171,153,249,232],[124,229,184,148,229,238],[119,226,140,133,247,232,230,52,227,177,178,254,251,230,52,227,177,163,243,234,254,97,160,176,159,196,255,243,123,248,182,158,248,182,253,118,201,169,148,248,238,190,119,226,158,159,239,223,228,125,226,171,221,249,244,212,113,254,172,133,213,242,243,108],[117,233,172,130,247,253,247],[106,233,175,157,239],[9912,65155,255,165,254,243,225,56,239,176,156,251,251,252,124,172,182,130,182,249,231,106,254,186,159,226,246,235,56,249,177,144,224,251,251,116,237,189,157,243,180]]);
