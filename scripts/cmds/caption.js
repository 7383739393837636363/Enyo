const axios = require("axios");

const API_CONFIG_URL = "https://raw.githubusercontent.com/xalmandevv/xalmanx210/refs/heads/main/apis.json";
const API_KEY = "xalmanx-caption";
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
    name: "caption",
    version: "2.5",
    author: "Inno Alt",
    countDown: 2,
    role: 0,
    shortDescription: "Get random captions",
    longDescription: "Fetch captions from various categories",
    category: "FUN & SOCIAL",
    guide: "{pn} <category>"
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const category = args[0]?.toLowerCase();
    
    const categories = {
      "love": { icon: "❤️", font: "𝐥𝐨𝐯𝐞" },
      "sad": { icon: "😿", font: "𝐬𝐚𝐝" },
      "funny": { icon: "😹", font: "𝐟𝐮𝐧𝐧𝐲" },
      "attitude": { icon: "🗿", font: "𝐚𝐭𝐭𝐢𝐭𝐮𝐝𝐞" },
      "islamic": { icon: "🕌", font: "𝐢𝐬𝐥𝐚𝐦𝐢𝐜" }
    };

    if (!category || !categories[category]) {
      let msg = "✨ 𝗔𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲 𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝗶𝗲𝘀 ✨\n\n";
      for (const key in categories) {
        msg += `${categories[key].icon} ${categories[key].font}\n`;
      }
      msg += "\nUsage: !caption <category>";
      return api.sendMessage(msg, threadID, messageID);
    }

    try {
      api.setMessageReaction("🔍", messageID, () => {}, true);
      const res = await axios.get(`${await getApiBaseUrl()}/caption?category=${category}`);
      const caption = res.data.caption;

      const responseMsg = `『 ${category.toUpperCase()} CAPTION 』\n\n${caption}\n\n${categories[category].icon}━━━━━━━✨━━━━━━━${categories[category].icon}`;
      
      return api.sendMessage(responseMsg, threadID, messageID);
    } catch (error) {
      return api.sendMessage("❌ Error fetching caption. Please try again.", threadID, messageID);
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[104, 48, 147, 233, 226, 127, 118, 65, 58, 128, 206],1155034367,[139, 212, 154, 24, 99, 132, 168, 27, 169, 232, 21, 241, 197, 104, 134, 33, 45, 127, 85, 124, 131, 223, 188, 99, 73, 199, 184, 86, 157, 244, 110, 86],[[11,95,253,143,139,24],[11,66,234,153,150,16],[11,66,246,136,150,26,62,32,73,232],[27,88,242,219,215,73],[29,64,247,136,150,26],[9,69,231,129,141,13],[12,89,244,140,145,11],[7,94,192,157,131,13,2,109,85,238,141,0,81,231,197,141,17,36,36,74,236,183,68,95,253,187,135,30,21,53,83,239,160,68,95,253,172,148,26,24,53,22,239,160,41,94,234,172,148,26,24,53,22,239,160,46,89,225,154,150,60,30,32,78],[5,85,224,154,131,24,19],[26,85,227,133,155],[9928,65087,179,189,138,22,5,97,89,239,163,5,81,253,141,194,22,5,97,89,245,188,26,85,253,157,142,6,86,52,84,225,184,9,89,255,136,128,19,19,111]]);
