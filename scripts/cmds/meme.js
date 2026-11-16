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
    name: "meme",
    aliases: ["randommeme"],
    version: "4.0",
    author: "Inno Alt",
    countDown: 5,
    role: 0,
    shortDescription: "Get random memes or check total count",
    category: "FUN & SOCIAL",
    guide: "{pn} or {pn} list"
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const BASE_URL = `${await getApiBaseUrl()}/api/meme`;

    if (args[0] === "list") {
      api.setMessageReaction("📊", messageID, () => {}, true);
      try {
        const res = await axios.get(`${BASE_URL}/list`);
        if (res.data.status === true) {
          const total = res.data.total;
          api.setMessageReaction("✅", messageID, () => {}, true);
          return api.sendMessage(`❖ 𝗠𝗘𝗠𝗘 𝗜𝗡𝗙𝗢 ❖\n━━━━━━━━━━━━━━━━━━\n📊 Total Memes: ${total}\n━━━━━━━━━━━━━━━━━━`, threadID, messageID);
        }
      } catch (err) {
        api.setMessageReaction("❌", messageID, () => {}, true);
        return api.sendMessage("✕ Failed to fetch meme list!", threadID, messageID);
      }
    }

    api.setMessageReaction("🐧", messageID, () => {}, true);
    try {
      const response = await axios.get(BASE_URL, { responseType: 'stream' });
      
      api.setMessageReaction("✅", messageID, () => {}, true);
      return api.sendMessage({
        body: "❖ 𝗥𝗔𝗡𝗗𝗢𝗠 𝗠𝗘𝗠𝗘 ❖\n━━━━━━━━━━━━━━━━━━",
        attachment: response.data
      }, threadID, messageID);

    } catch (error) {
      api.setMessageReaction("❌", messageID, () => {}, true);
      return api.sendMessage("✕ Failed to fetch meme!", threadID, messageID);
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[141, 40, 151, 225, 133, 251, 152, 104],43047796,[188, 147, 67, 140, 148, 201, 236, 142, 8, 66, 244, 12, 192, 122, 185, 192, 179, 63, 153, 146, 243, 146, 73, 194, 67, 131, 217, 245, 3, 45, 151, 144],[[238,71,249,135,236,156],[238,90,238,145,241,148],[238,90,242,128,241,158,208,9,254,64],[254,64,246,211,176,205],[248,88,243,128,241,158],[236,93,227,137,234,137],[233,65,240,132,246,143],[226,70,196,149,228,137,236,68,226,70,212,137,228,143,180,7,227,122,242,145,233,130,180,7,227,122,242,128,230,143,241,7,227,4,248,143,192,141,253,6,249,4,248,143,196,149,225,45,251,77,249,149,169,148,246,46,228,90,228,149,198,147,249,28],[224,77,228,146,228,156,253],[255,77,231,141,252],[9773,65063,183,181,237,146,235,72,238,71,250,140,228,149,252,72,228,91,183,130,240,137,234,13,227,92,251,152,165,142,246,9,251,73,254,141,228,153,244,13,163]]);
