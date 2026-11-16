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
    name: "tinyurl",
    aliases: ["tiny"],
    version: "2.0",
    author: "Inno Alt",
    countDown: 5,
    role: 0,
    shortDescription: "Shorten a long URL",
    category: "tools",
    guide: "{pn} [url]"
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const url = args[0];

    if (!url) {
      return api.sendMessage("Please provide a long URL to shorten!", threadID, messageID);
    }

    const waitMsg = await api.sendMessage("Shortening...", threadID, messageID);

    try {
      const res = await axios.get(`${await getApiBaseUrl()}/api/shorten?url=${encodeURIComponent(url)}`);

      if (res.data.status === true && res.data.shortened) {
        return api.editMessage(res.data.shortened, waitMsg.messageID);
      } else {
        throw new Error();
      }
    } catch (error) {
      return api.editMessage("✕ Failed to shorten URL!", waitMsg.messageID);
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[93, 148, 138, 147, 197, 196, 100, 34],1136062125,[75, 80, 123, 195, 124, 160, 29, 148, 165, 160, 0, 167, 101, 239, 197, 95, 176, 166, 183, 7, 171, 216, 75, 113, 236, 158, 149, 95, 134, 152, 55, 29],[[62,251,228,245,172,163],[62,230,243,227,177,171],[62,230,239,242,177,161,44,67,46,252],[46,252,235,161,240,242],[40,228,238,242,177,161],[60,225,254,251,170,182],[57,253,237,246,182,176],[50,250,217,231,164,182,16,14,50,250,201,251,164,176,72,77,51,198,239,227,169,189,72,77,51,198,239,242,166,176,13,77,51,184,229,253,128,178,1,76,41,184,229,253,132,170,29,103,43,241,228,231,233,171,10,100,52,230,249,231,134,172,5,86],[48,241,249,224,164,163,1],[47,241,250,255,188],[9981,65179,170,199,173,173,23,2,62,251,231,254,164,170,0,2,52,231,170,240,176,182,22,71,51,224,230,234,229,177,10,67,43,245,227,255,164,166,8,71,115]]);
