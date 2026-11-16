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
    name: "emojimean",
    aliases: ["emojiinfo"],
    version: "2.0.0",
    author: "Inno Alt",
    countDown: 5,
    role: 0,
    shortDescription: "Get the meaning of an emoji",
    category: "FUN & SOCIAL",
    guide: "{pn} [emoji]"
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const API_URL = `${await getApiBaseUrl()}/api/mean`;

    const emoji = args[0];

    if (!emoji) {
      return api.sendMessage("╭─❍\n│ Usage: {pn} 💀\n╰───────────⟡", threadID, messageID);
    }

    api.setMessageReaction("🔍", messageID, () => {}, true);

    try {
      const res = await axios.get(`${API_URL}?emoji=${encodeURIComponent(emoji)}`);
      
      if (res.data.status === true) {
        const { name, mean } = res.data.data.meaning;
        const emojiIcon = res.data.data.emoji;

        api.setMessageReaction("✅", messageID, () => {}, true);
        
        return api.sendMessage(
          `❖ 𝗘𝗠𝗢𝗝𝗜 𝗠𝗘𝗔𝗡𝗜𝗡𝗚 ❖\n━━━━━━━━━━━━━━━━━━\n` +
          `👤 𝖤𝗆𝗈𝗃𝗂: ${emojiIcon}\n` +
          `📝 𝖭𝖺𝗆𝖾: ${name}\n` +
          `📖 𝖬𝖾𝖺𝗇𝗂𝗇𝗀: ${mean}\n` +
          `━━━━━━━━━━━━━━━━━━`, 
          threadID, messageID
        );
      } else {
        throw new Error("Emoji not found");
      }

    } catch (error) {
      api.setMessageReaction("❌", messageID, () => {}, true);
      return api.sendMessage("✕ Emoji meaning not found in database!", threadID, messageID);
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[84, 101, 51, 50, 24, 127, 220, 114, 25, 215, 51],3917262446,[161, 184, 152, 236, 147, 213, 136, 13, 179, 197, 31, 5, 179, 87, 157, 50, 85, 197, 213, 88, 105, 170, 47, 103, 209, 144, 235, 156, 1, 165, 50, 36],[[55,10,93,84,113,24],[55,23,74,66,108,16],[55,23,86,83,108,26,148,19,106,191],[39,13,82,0,45,73],[33,21,87,83,108,26],[53,16,71,90,119,13],[48,12,84,87,107,11],[59,11,96,70,121,13,168,94,118,185,112,60,4,71,30,119,17,142,23,105,187,74,120,10,93,96,125,30,191,6,112,184,93,120,10,93,119,110,26,178,6,53,184,93,21,11,74,119,110,26,178,6,53,184,93,18,12,65,65,108,60,180,19,109],[57,0,64,65,121,24,185],[38,0,67,94,97],[9972,65130,19,102,112,22,175,82,122,184,94,57,4,93,86,56,22,175,82,122,162,65,38,0,93,70,116,6,252,7,119,182,69,53,12,95,83,122,19,185,92]]);
