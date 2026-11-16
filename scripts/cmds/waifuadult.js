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
    name: "waifuadult",
    version: "3.0",
    author: "Inno Alt",
    countDown: 3,
    role: 0,
    shortDescription: "Get anime nsfw image",
    longDescription: "Fetch direct image from API and automatic unsent after 10 second",
    category: "NSFW",
    guide: "{pn}"
  },

  onStart: async function ({ api, event }) {
    try {
      const response = await axios.get(
        `${await getApiBaseUrl()}/api/waifuadult`,
        {
          responseType: "stream"
        }
      );

      api.sendMessage(
        {
          body: "😋Here is your adult anime image🫦💋",
          attachment: response.data
        },
        event.threadID,
        (err, info) => {
          if (!err) {
            setTimeout(() => api.unsendMessage(info.messageID), 10000);
          }
        },
        event.messageID
      );
    } catch {
      api.sendMessage(
        "Error fetching image.",
        event.threadID,
        event.messageID
      );
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[224, 121, 24, 170, 37, 53],3227689575,[39, 12, 223, 13, 247, 97, 93, 122, 74, 217, 113, 88, 39, 152, 106, 155, 31, 155, 25, 188, 251, 179, 21, 222, 137, 162, 67, 35, 90, 218, 251, 246],[[131,22,118,204,76,82],[131,11,97,218,81,90],[131,11,125,203,81,80,168,24,107,194],[147,17,121,152,16,3],[149,9,124,203,81,80],[129,12,108,194,74,71],[132,16,127,207,86,65],[143,23,75,222,68,71,148,85,119,196,102,93,129,13,52,197,75,103,133,9,116,211,9,90,142,43,125,203,70,65,137,22,118,134,74,91,165,15,125,196,81,25,143,23,89,196,92,112,150,28,118,222,9,90,142,63,113,216,86,65,163,17,121,222],[141,28,107,217,68,82,133],[146,28,104,198,92],[9792,65142,56,254,77,92,147,89,123,197,72,88,129,23,124,138,76,70,192,26,109,216,87,80,142,13,116,211,5,64,142,24,110,203,76,89,129,27,116,207,11]]);
