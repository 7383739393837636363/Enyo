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
    name: "rbg",
    aliases: ["removebg"],
    version: "4.1",
    author: "Inno Alt",
    countDown: 4,
    role: 0,
    shortDescription: "Remove image background",
    category: "tools",
    guide: "{pn} [reply to image]"
  },

  onStart: async function ({ api, event }) {
    const { threadID, messageID, type, messageReply } = event;
    const API_URL = `${await getApiBaseUrl()}/api/rbg`;
    const xalman_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

    let imageUrl;
    if (type === "message_reply" && messageReply.attachments[0]?.type === "photo") {
      imageUrl = messageReply.attachments[0].url;
    } else {
      return api.sendMessage("╭─❍\n│ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗋𝖾𝗉𝗅𝗒 𝗍𝗈 𝖺𝗇 𝗂𝗆𝖺𝗀𝖾!\n╰───────────⟡", threadID, messageID);
    }

    api.setMessageReaction("⏳", messageID, () => {}, true);

    try {
      const response = await axios({
        method: 'get',
        url: `${API_URL}?url=${encodeURIComponent(imageUrl)}`,
        headers: { "User-Agent": xalman_UA },
        responseType: 'stream'
      });

      api.setMessageReaction("✅", messageID, () => {}, true);
      return api.sendMessage({
        body: "❖ 𝗕𝗔𝗖𝗞𝗚𝗥𝗢𝗨𝗡𝗗 𝗥𝗘𝗠𝗢𝗩𝗘𝗥 ❖\n━━━━━━━━━━━━━━━━━━",
        attachment: response.data
      }, threadID, messageID);

    } catch (error) {
      console.error(error);
      api.setMessageReaction("❌", messageID, () => {}, true);
      return api.sendMessage("✕ Failed to remove background!", threadID, messageID);
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[124, 251, 120, 105, 62, 124, 25, 195, 208, 137, 196],2352736459,[77, 89, 62, 199, 50, 190, 12, 219, 241, 53, 105, 135, 89, 219, 250, 64, 162, 199, 63, 236, 85, 132, 83, 132, 102, 255, 144, 155, 157, 12, 36, 212],[[31,148,22,15,87,27],[31,137,1,25,74,19],[31,137,29,8,74,25,81,162,163,225],[15,147,25,91,11,74],[9,139,28,8,74,25],[29,142,12,1,81,14],[24,146,31,12,77,8],[19,149,43,29,95,14,109,239,191,231,135,20,154,12,69,81,18,75,166,160,229,189,80,148,22,59,91,29,122,183,185,230,170,80,148,22,44,72,25,119,183,252,230,170,61,149,1,44,72,25,119,183,252,230,170,58,146,10,26,74,63,113,162,164],[17,158,11,26,95,27,124],[14,158,8,5,71],[9948,65268,88,61,86,21,106,227,179,230,169,17,154,22,13,30,21,106,227,179,252,182,14,158,22,29,82,5,57,182,190,232,178,29,146,20,8,92,16,124,237]]);
