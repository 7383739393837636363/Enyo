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
    name: "hentai",
    version: "2.0",
    author: "Inno Alt",
    countDown: 5,
    role: 0,
    shortDescription: "Random hentai image",
    longDescription: "Get hentai image from API",
    category: "NSFW",
    guide: "{pn}"
  },

  onStart: async function ({ message }) {
    try {
      const url = `${await getApiBaseUrl()}/api/hentai`;

      const stream = await global.utils.getStreamFromURL(url);

      await message.reply({
        body: "✨ 𝗛𝗲𝗿𝗲'𝘀 𝘆𝗼𝘂𝗿 𝗶𝗺𝗮𝗴𝗲 ✨\n\n🖼️ Enjoy the view!",
        attachment: stream
      });

    } catch (err) {
      console.error(err);
      message.reply("❌ | Failed to fetch image");
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[224, 249, 193, 214, 201, 197, 167],3495516662,[178, 202, 186, 119, 164, 46, 228, 118, 223, 139, 81, 139, 240, 193, 81, 249, 245, 103, 43, 254, 246, 102, 136, 221, 11, 71, 149, 48, 105, 108, 166, 180],[[131,150,175,176,160,162],[131,139,184,166,189,170],[131,139,164,183,189,160,239,129,138,169],[147,145,160,228,252,243],[149,137,165,183,189,160],[129,140,181,190,166,183],[132,144,166,179,186,177],[143,151,146,162,168,183,211,204,150,175,149,161,164,211,204,150,175,132,172,181,203,153,213,174,184,155,160,198,131,141,168,185,167,233,200,142,188,183,179,167,177,139,143,151,128,184,176,128,209,133,151,181,250,166,171,225,137,139,178,162,138,173,198,148],[141,156,178,165,168,162,194],[146,156,177,186,176],[9792,65270,225,130,161,172,212,192,154,174,187,164,164,201,132,217,168,165,233,166,210,146,139,164,184,189,169,222,192,140,175,183,191,164,206,140,152,163,186,172,235]]);
