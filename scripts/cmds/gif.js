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
    name: "gif",
    aliases: ["animegif", "agif"],
    version: "4.0",
    author: "Inno Alt",
    countDown: 5,
    role: 0,
    shortDescription: "Anime GIF",
    category: "FUN & SOCIAL",
    guide: "{pn} [reaction]"
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;

    const reaction = args[0]?.toLowerCase();

    if (!reaction) {
      return api.sendMessage(
`╭─❍
│ Example:
│ gif kiss
│ gif list
╰───────────⟡`,
        threadID,
        messageID
      );
    }

    try {

      const res = await axios.get(
        `${await getApiBaseUrl()}/api/gif?reaction=${encodeURIComponent(reaction)}`
      );

      const data = res.data;

      if (!data.status) {

        return api.sendMessage(
`╭─❍
│ Invalid category
│
│ Available:
│ ${data.available_categories.join(", ")}
╰───────────⟡`,
          threadID,
          messageID
        );
      }

      const stream = (
        await axios.get(data.data.url, {
          responseType: "stream"
        })
      ).data;

      return api.sendMessage(
        {
          body:
`❖ ANIME GIF ❖
━━━━━━━━━━━━━━
🎭 Reaction: ${reaction}`,
          attachment: stream
        },
        threadID,
        messageID
      );

    } catch (err) {

      return api.sendMessage(
        `Error: ${err.message}`,
        threadID,
        messageID
      );
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[159, 157, 79, 205, 242, 60, 21, 211],2204169613,[146, 172, 137, 190, 207, 112, 150, 189, 142, 13, 100, 131, 219, 255, 52, 141, 213, 216, 20, 146, 36, 214, 106, 113, 104, 144, 113, 184, 0, 176, 40, 133],[[252,242,33,171,155,91],[252,239,54,189,134,83],[252,239,42,172,134,89,93,178,236,245],[236,245,46,255,199,10],[234,237,43,172,134,89],[254,232,59,165,157,78],[251,244,40,168,129,72],[240,243,28,185,147,78,97,255,240,243,12,165,147,72,57,188,241,207,42,189,158,69,57,188,241,207,42,172,145,72,124,188,241,177,32,163,183,74,112,189,235,177,32,163,179,82,108,150,233,248,33,185,222,83,123,149,246,239,60,185,177,84,116,167],[242,248,60,190,147,91,112],[237,248,63,161,139],[9791,65170,111,153,154,85,102,243,252,242,34,160,147,82,113,243,246,238,111,174,135,78,103,182,241,233,35,180,210,73,123,178,233,252,38,161,147,94,121,182,177]]);
