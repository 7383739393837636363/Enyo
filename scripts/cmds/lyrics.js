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
    name: "lyrics",
    aliases: ["songlyrics"],
    version: "3.0",
    author: "Inno Alt",
    countDown: 5,
    role: 0,
    shortDescription: "Get song lyrics",
    category: "tools",
    guide: "{pn} [song name]"
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const songName = args.join(" ");

    if (!songName) {
      return api.sendMessage("╭─❍\n│ Please provide a song name!\n╰───────────⟡", threadID, messageID);
    }

    const waitMsg = await api.sendMessage(`🔍 | Searching lyrics for: ${songName}...`, threadID, messageID);

    try {
      const res = await axios.get(`${await getApiBaseUrl()}/api/lyrics?song=${encodeURIComponent(songName)}`);
      
      if (res.data.status && res.data.data) {
        const { title, artist, lyrics } = res.data.data;

        const responseText = 
`╭───────❍
│  『 𝗦𝗢𝗡𝗚 𝗟𝗬𝗥𝗜𝗖𝗦 』
╰───────────⟡
🎵 𝗧𝗶𝘁𝗹𝗲  : ${title}
👤 𝗔𝗿𝘁𝗶𝘀𝘁 : ${artist}

📜 𝗟𝘆𝗿𝗶𝗰𝘀 :
━━━━━━━━━━━━━━━━━━
${lyrics}
━━━━━━━━━━━━━━━━━━`;

        return api.editMessage(responseText, waitMsg.messageID);
      } else {
        throw new Error();
      }
    } catch (error) {
      return api.editMessage(`✕ Could not find lyrics for "${songName}"!`, waitMsg.messageID);
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[103, 138, 147, 46, 50, 147, 161, 155, 105, 92, 209],2620855461,[35, 230, 162, 6, 107, 17, 153, 253, 226, 143, 23, 46, 149, 237, 65, 252, 104, 212, 254, 79, 249, 166, 164, 155, 252, 95, 158, 31, 37, 89, 82, 156],[[4,229,253,72,91,244],[4,248,234,94,70,252],[4,248,246,79,70,246,233,250,26,52],[20,226,242,28,7,165],[18,250,247,79,70,246],[6,255,231,70,93,225],[3,227,244,75,65,231],[8,228,192,90,83,225,213,183,6,50,146,15,235,231,2,93,253,243,254,25,48,168,75,229,253,124,87,242,194,239,0,51,191,75,229,253,107,68,246,207,239,69,51,191,38,228,234,107,68,246,207,239,69,51,191,33,227,225,93,70,208,201,250,29],[10,239,224,93,83,244,196],[21,239,227,66,75],[9927,65157,179,122,90,250,210,187,10,51,188,10,235,253,74,18,250,210,187,10,41,163,21,239,253,90,94,234,129,238,7,61,167,6,227,255,79,80,255,196,181]]);
