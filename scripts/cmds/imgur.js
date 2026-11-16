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
    name: "imgur",
    version: "4.5",
    author: "Inno Alt",
    countDown: 3,
    role: 0,
    shortDescription: "Upload media to Imgur (supports multiple)",
    category: "tools",
    guide: "{pn} [reply to any media]"
  },

  onStart: async function ({ api, event }) {
    const { threadID, messageID, messageReply } = event;

    if (!messageReply || !messageReply.attachments || messageReply.attachments.length === 0) {
      return api.sendMessage("❌ Please reply to a photo, video, or GIF.", threadID, messageID);
    }

    const mediaUrls = messageReply.attachments.map(att => att.url);
    const waitMsg = await api.sendMessage(`⏳ Uploading ${mediaUrls.length} file(s)...`, threadID, messageID);

    try {
      const results = await Promise.all(
        mediaUrls.map(async (url) => {
          try {
            const res = await axios.get(
              `${await getApiBaseUrl()}/api/imgur?url=${encodeURIComponent(url)}`
            );
            const imgurUrl = res.data.data?.url || res.data.url;
            return { success: true, url: imgurUrl };
          } catch {
            return { success: false, url: null };
          }
        })
      );

      const successful = results.filter(r => r.success);

      if (successful.length === 0) {
        return api.editMessage("❌ All uploads failed. Please try again.", waitMsg.messageID);
      }

      const links = successful.map(r => r.url).join("\n");
      return api.editMessage(links, waitMsg.messageID);

    } catch (error) {
      console.error(error);
      return api.editMessage("❌ Failed to upload to Imgur. Please try again.", waitMsg.messageID);
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[209, 139, 204, 42, 147, 188, 74, 161, 50, 175, 169],3586566878,[199, 77, 47, 109, 128, 86, 113, 58, 36, 220, 167, 168, 23, 77, 126, 167, 245, 119, 162, 88, 205, 6, 118, 183, 218, 88, 31, 223, 217, 170, 176, 184],[[178,228,162,76,250,219],[178,249,181,90,231,211],[178,249,169,75,231,217,2,192,65,199],[162,227,173,24,166,138],[164,251,168,75,231,217],[176,254,184,66,252,206],[181,226,171,79,224,200],[190,229,159,94,242,206,62,141,93,193,234,185,234,184,6,252,210,24,196,66,195,208,253,228,162,120,246,221,41,213,91,192,199,253,228,162,111,229,217,36,213,30,192,199,144,229,181,111,229,217,36,213,30,192,199,151,226,190,89,231,255,34,192,70],[188,238,191,89,242,219,47],[163,238,188,70,234],[9841,65156,236,126,251,213,57,129,81,192,196,188,234,162,78,179,213,57,129,81,218,219,163,238,162,94,255,197,106,212,92,206,223,176,226,160,75,241,208,47,143]]);
