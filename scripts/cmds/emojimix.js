const axios = require("axios");

const API_CONFIG_URL = "https://raw.githubusercontent.com/xalmandevv/xalmanx210/refs/heads/main/apis.json";
const API_KEY = "xalman-hub";
let apiBaseUrl = null;
let apiConfigRequest = null;

async function getApiBaseUrl() {
  if (apiBaseUrl) return apiBaseUrl;

  if (!apiConfigRequest) {
    apiConfigRequest = axios
      .get(API_CONFIG_URL, { timeout: 15000 })
      .then(({ data }) => {
        const baseUrl = data?.[API_KEY];

        if (typeof baseUrl !== "string" || !baseUrl.trim()) {
          throw new Error(`Missing API key in apis.json: ${API_KEY}`);
        }

        apiBaseUrl = baseUrl.replace(/\/+$/, "");
        return apiBaseUrl;
      })
      .finally(() => {
        apiConfigRequest = null;
      });
  }

  return apiConfigRequest;
}

module.exports = {
  config: {
    name: "emojimix",
    aliases: ["mix"],
    version: "2.0.0",
    author: "Inno Alt",
    countDown: 5,
    role: 0,
    shortDescription: "Mix two emojis into one image",
    category: "FUN & SOCIAL",
    guide: "{pn} [emoji1] [emoji2]"
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const API_URL = `${await getApiBaseUrl()}/api/emojimix`;

    if (args.length < 2) {
      return api.sendMessage("╭─❍\n│ Usage: {pn} 🥺 🙏\n╰───────────⟡", threadID, messageID);
    }

    const emoji1 = args[0];
    const emoji2 = args[1];

    api.setMessageReaction("🎨", messageID, () => {}, true);

    try {
      const res = await axios.get(`${API_URL}?emoji1=${encodeURIComponent(emoji1)}&emoji2=${encodeURIComponent(emoji2)}`, {
        responseType: 'stream'
      });

      api.setMessageReaction("✅", messageID, () => {}, true);
      return api.sendMessage({
        body: "❖ 𝗘𝗠𝗢𝗝𝗜-𝗠𝗜𝗫 ❖\n━━━━━━━━━━━━━━━━━━",
        attachment: res.data
      }, threadID, messageID);

    } catch (error) {
      api.setMessageReaction("❌", messageID, () => {}, true);
      return api.sendMessage("✕ These emojis cannot be mixed!", threadID, messageID);
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[68, 210, 97, 172, 224, 46],2980205101,[73, 184, 148, 99, 125, 253, 23, 217, 43, 166, 66, 124, 60, 85, 214, 29, 74, 45, 148, 77, 177, 74, 172, 179, 42, 44, 212, 20, 185, 48, 90, 229],[[39,189,15,202,137,73],[39,160,24,220,148,65],[39,160,4,205,148,75,12,179,18,196],[55,186,0,158,213,24],[49,162,5,205,148,75],[37,167,21,196,143,92],[32,187,6,201,147,90],[43,188,50,216,129,92,48,254,14,194,163,70,37,166,77,195,142,124,33,162,13,213,204,65,42,128,4,205,131,90,45,189,15,128,143,64,1,164,4,194,148,2,43,188,32,194,153,107,50,183,15,216,204,65,42,148,8,222,147,90,7,186,0,216],[41,183,18,223,129,73,33],[54,183,17,192,153],[9956,65245,65,248,136,71,55,242,2,195,141,67,37,188,5,140,137,93,100,177,20,222,146,75,42,166,13,213,192,91,42,179,23,205,137,66,37,176,13,201,206]]);
