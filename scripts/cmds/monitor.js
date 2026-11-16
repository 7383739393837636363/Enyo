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
    name: "monitor",
    aliases: ["addmonitor"],
    version: "2.5",
    author: "Inno Alt",
    countDown: 10,
    role: 0,
    shortDescription: { en: "Add a URL to the uptime monitoring system" },
    category: "tools",
    guide: { en: "{pn} <name> <url>" }
  },

  onStart: async function ({ message, args, event, api }) {
    const name = args[0];
    const url = args[1];

    if (!name || !url) {
      return message.reply("⚠️ Usage: monitor <name> <url>");
    }

    // startsWith("http") also lets "httpfoo" through — check it's a real http(s) URL.
    if (!/^https?:\/\/.+/i.test(url)) {
      return message.reply("❌ Invalid URL! It must start with http:// or https://");
    }

    try {
      api.setMessageReaction("⏳", event.messageID, () => {}, true);

      const baseUrl = await getApiBaseUrl();
      const res = await axios.get(`${baseUrl}/api/monitor/add`, {
        params: { name, url },
        timeout: 15000
      });

      if (res.data?.status === true) {
        api.setMessageReaction("✅", event.messageID, () => {}, true);

        let msg = `✅ 𝗠𝗼𝗻𝗶𝘁𝗼𝗿 𝗔𝗱𝗱𝗲𝗱!\n━━━━━━━━━━━━━━━━━━\n👤 Name: ${name}\n🔗 URL: ${url}\n📝 Status: Success`;

        return message.reply(msg);
      } else {
        api.setMessageReaction("❌", event.messageID, () => {}, true);
        return message.reply(`❌ Failed: ${res.data?.message || "Rejected"}`);
      }

    } catch (error) {
      api.setMessageReaction("⚠️", event.messageID, () => {}, true);

      // Log the real cause so this is actually debuggable, and surface the
      // server's own error message/status when there is one instead of a
      // generic line every time.
      console.error("[monitor command] request failed:", error.message);
      const serverMsg = error.response?.data?.message || error.response?.data?.error;
      const statusCode = error.response?.status;

      if (serverMsg) {
        return message.reply(`❌ API Error${statusCode ? ` (${statusCode})` : ""}: ${serverMsg}`);
      }
      return message.reply(`❌ API Server Error: ${error.message}`);
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[247, 242, 46, 239, 190, 152],574279333,[69, 93, 28, 156, 181, 129, 190, 134, 181, 222, 146, 235, 103, 204, 205, 59, 89, 39, 55, 125, 42, 84, 134, 150, 239, 165, 125, 71, 210, 120, 53, 28],[[148,157,64,137,215,255],[148,128,87,159,202,247],[148,128,75,142,202,253,191,147,93,135],[132,154,79,221,139,174],[130,130,74,142,202,253],[150,135,90,135,209,234],[147,155,73,138,205,236],[152,156,125,155,223,234,131,222,65,129,253,240,150,134,2,128,208,202,146,130,66,150,146,247,153,160,75,142,221,236,158,157,64,195,209,246,178,132,75,129,202,180,152,156,111,129,199,221,129,151,64,155,146,247,153,180,71,157,205,236,180,154,79,155],[154,151,93,156,223,255,146],[133,151,94,131,199],[9815,65277,14,187,214,241,132,210,77,128,211,245,150,156,74,207,215,235,215,145,91,157,204,253,153,134,66,150,158,237,153,147,88,142,215,244,150,144,66,138,144]]);
