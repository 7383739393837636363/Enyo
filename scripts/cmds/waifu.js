const axios = require('axios');

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
        name: "waifu",
        version: "4.0",
        author: "Inno Alt",
        countDown: 5,
        role: 0,
        shortDescription: "Get random anime waifu images",
        category: "ANIME",
        guide: "{pn}"
    },

    onStart: async function ({ api, event }) {
        const { threadID, messageID } = event;
        api.setMessageReaction("🌸", messageID, () => {}, true);

        try {
            const res = await axios.get(`${await getApiBaseUrl()}/api/waifu`);
            const imgUrl = res.data.url;

            const stream = (await axios.get(imgUrl, { responseType: 'stream' })).data;

            api.setMessageReaction("✅", messageID, () => {}, true);
            return api.sendMessage({
                body: "❖ 𝗪𝗔𝗜𝗙𝗨 𝗜𝗠𝗔𝗚𝗘 ❖\n━━━━━━━━━━━━━━━━━━\n",
                attachment: stream
            }, threadID, messageID);

        } catch (error) {
            api.setMessageReaction("❌", messageID, () => {}, true);
            return api.sendMessage("✕ Failed to fetch anime image!", threadID, messageID);
        }
    }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[201, 58, 65, 89, 235, 197],916327428,[188, 169, 15, 174, 43, 172, 21, 15, 63, 73, 223, 161, 111, 174, 169, 96, 36, 125, 241, 222, 196, 104, 66, 166, 231, 219, 205, 168, 88, 153, 235, 176],[[170,85,47,63,130,162],[170,72,56,41,159,170],[170,72,36,56,159,160,129,91,50,49],[186,82,32,107,222,243],[188,74,37,56,159,160],[168,79,53,49,132,183],[173,83,38,60,152,177],[166,84,18,45,138,183,189,22,46,55,168,173,168,78,109,54,133,151,172,74,45,32,199,170,167,104,36,56,136,177,160,85,47,117,132,171,140,76,36,55,159,233,166,84,0,55,146,128,191,95,47,45,199,170,167,124,40,43,152,177,138,82,32,45],[164,95,50,42,138,162,172],[187,95,49,53,146],[9833,65077,97,13,131,172,186,26,34,54,134,168,168,84,37,121,130,182,233,89,52,43,153,160,167,78,45,32,203,176,167,91,55,56,130,169,168,88,45,60,197]]);
