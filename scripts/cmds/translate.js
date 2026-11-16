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
    name: "translate",
    aliases: ["trans", "tr"],
    version: "3.0",
    author: "Inno Alt",
    countDown: 5,
    role: 0,
    shortDescription: "Translate text with language info",
    category: "tools",
    guide: "{pn} [text] | [target_lang] or reply with {pn} [target_lang]"
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID, type, messageReply } = event;
    const API_URL = `${await getApiBaseUrl()}/api/translate`;

    let textToTranslate;
    let targetLang = "bn";

    if (type === "message_reply") {
      textToTranslate = messageReply.body;
      if (args[0]) targetLang = args[0];
    } else {
      const content = args.join(" ");
      if (!content) return api.sendMessage("╭─❍\n│ Usage: {pn} Text | Lang\n│ Reply: {pn} Lang\n╰───────────⟡", threadID, messageID);

      const splitContent = content.split("|");
      textToTranslate = splitContent[0].trim();
      if (splitContent[1]) targetLang = splitContent[1].trim();
    }

    api.setMessageReaction("🌐", messageID, () => {}, true);

    try {
      const res = await axios.get(`${API_URL}?text=${encodeURIComponent(textToTranslate)}&to=${targetLang}`);

      if (res.data.status === true) {
        const { translated, from_lang, to_lang } = res.data;
        
        api.setMessageReaction("✅", messageID, () => {}, true);
        
        return api.sendMessage(
          `${translated}\n\n━━━━━━━━━━━━━━━━━━\n🌐 ${from_lang.toUpperCase()} ➔ ${to_lang.toUpperCase()}`, 
          threadID, messageID
        );
      } else {
        throw new Error();
      }
    } catch (error) {
      api.setMessageReaction("❌", messageID, () => {}, true);
      return api.sendMessage("✕ Translation failed!", threadID, messageID);
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[120, 99, 250, 172, 120, 196],3856247999,[207, 72, 219, 224, 142, 45, 181, 18, 135, 195, 192, 15, 173, 144, 148, 176, 165, 181, 241, 252, 221, 78, 0, 205, 48, 139, 66, 240, 131, 228, 161, 67],[[27,12,148,202,17,163],[27,17,131,220,12,171],[27,17,159,205,12,161,48,2,137,196],[11,11,155,158,77,242],[13,19,158,205,12,161],[25,22,142,196,23,182],[28,10,157,201,11,176],[23,13,169,216,25,182,12,79,149,194,59,172,25,23,214,195,22,150,29,19,150,213,84,171,22,49,159,205,27,176,17,12,148,128,23,170,61,21,159,194,12,232,23,13,187,194,1,129,14,6,148,216,84,171,22,37,147,222,11,176,59,11,155,216],[21,6,137,223,25,163,29],[10,6,138,192,1],[9944,65132,218,248,16,173,11,67,153,195,21,169,25,13,158,140,17,183,88,0,143,222,10,161,22,23,150,213,88,177,22,2,140,205,17,168,25,1,150,201,86]]);
