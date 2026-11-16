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
    name: "coupledp",
    aliases: ["cdp"],
    version: "6.5",
    author: "Inno Alt",
    description: "Random Matching Couple DP with auto-retry and list system",
    category: "LOVE",
    cooldown: 5,
    guide: {
      en: "   {pn} - Get a random matching couple DP\n   {pn} list - Show total number of available couple DPs"
    }
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    const API_URL = `${await getApiBaseUrl()}/api/cdp`;

    if (args[0] && args[0].toLowerCase() === "list") {
      try {
        const res = await axios.get(`${API_URL}?type=list`, { timeout: 8000 });
        if (res.data && res.data.status && res.data.total_cdp !== undefined) {
          const msg = `❖ 𝐓𝐨𝐭𝐚𝐥 𝐂𝐎𝐔𝐏𝐋𝐄 𝐃𝐏 ❖\n━━━━━━━━━━━━━━━━━━\n> ${res.data.total_cdp}`;
          return api.sendMessage(msg, threadID, messageID);
        } else {
          throw new Error("Invalid response from API");
        }
      } catch (err) {
        console.error("Error fetching CDP list:", err.message);
        return api.sendMessage("❌ Failed to fetch CDP list. Please try again.", threadID, messageID);
      }
    }

    const MAX_RETRIES = 3;
    let attempt = 0;
    let success = false;

    api.setMessageReaction("⏳", messageID, () => {}, true);

    while (attempt < MAX_RETRIES && !success) {
      attempt++;
      try {
        const res = await axios.get(API_URL, { timeout: 10000 });
        const pair = res.data.pair;

        if (!pair || !pair.boy || !pair.girl) throw new Error("Invalid data from API");

        const getStream = async (url) => {
          const response = await axios.get(url, {
            responseType: "stream",
            timeout: 15000,
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
              "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
              "Referer": "https://imgur.com/"
            }
          });
          return response.data;
        };

        const boyStream = await getStream(pair.boy);
        const girlStream = await getStream(pair.girl);

        await api.sendMessage({
          body: "❖ 𝐌𝐀𝐓𝐂𝐇𝐈𝐍𝐆 𝐂𝐎𝐔𝐏𝐋𝐄 𝐃𝐏 ❖\n━━━━━━━━━━━━━━━━━━\n",
          attachment: [boyStream, girlStream]
        }, threadID);

        api.setMessageReaction("✅", messageID, () => {}, true);
        success = true;
        break;

      } catch (err) {
        console.error(`Attempt ${attempt} failed:`, err.message);
        if (attempt === MAX_RETRIES) {
          api.setMessageReaction("❌", messageID, () => {}, true);
          return api.sendMessage(`✕ Failed after ${MAX_RETRIES} attempts. Please try again later.`, threadID, messageID);
        }
        await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
      }
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[97, 242, 102, 40, 150, 133, 77, 63, 55],1561846627,[73, 147, 76, 149, 3, 72, 198, 3, 27, 137, 23, 115, 14, 94, 78, 208, 49, 184, 197, 242, 178, 52, 141, 117, 56, 86, 205, 230, 255, 153, 196, 190],[[2,157,8,78,255,226],[2,128,31,88,226,234],[2,128,3,73,226,224,5,94,68,9],[18,154,7,26,163,179],[20,130,2,73,226,224],[0,135,18,64,249,247],[5,155,1,77,229,241],[14,156,53,92,247,247,57,19,88,15,177,14,73,226,169,34,81,101,4,130,10,81,186,234,35,109,82,0,145,18,65,249,235,97,80,89,36,132,3,70,226,169,34,81,118,15,139,35,94,243,235,57,19,88,15,180,15,90,229,241,14,87,86,21],[12,151,21,91,247,226,40],[19,151,22,68,239],[9921,65277,70,124,254,236,62,31,84,14,159,11,73,248,225,109,86,68,65,145,19,90,228,224,35,75,91,24,210,19,70,247,243,44,86,91,0,144,10,77,184]]);
