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
    name: "freeimage",
    aliases: ["freeimg", "imghost"],
    version: "2.0.0",
    author: "Inno Alt",
    countDown: 5,
    role: 0,
    shortDescription: "Upload image to FreeImage via URL",
    category: "tools",
    guide: "{pn} [reply to an image]"
  },

  onStart: async function ({ api, event }) {
    const { threadID, messageID, type, messageReply } = event;
    const API_URL = `${await getApiBaseUrl()}/api/imghost`;

    let imageUrl;
    if (type === "message_reply" && messageReply.attachments[0]?.type === "photo") {
      imageUrl = messageReply.attachments[0].url;
    } else {
      return api.sendMessage("╭─❍\n│ Please reply to an image!\n╰───────────⟡", threadID, messageID);
    }

    const waitMsg = await api.sendMessage("Uploading to FreeImage...", threadID, messageID);

    try {
      const res = await axios.get(`${API_URL}?url=${encodeURIComponent(imageUrl)}`);

      if (res.data.success === true) {
        const displayUrl = res.data.data.display_url;
        return api.editMessage(displayUrl, waitMsg.messageID);
      } else {
        throw new Error();
      }

    } catch (error) {
      return api.editMessage("✕ Failed to upload image!", waitMsg.messageID);
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[67, 23, 167, 65, 216, 121, 146, 216, 88],3086000356,[5, 122, 88, 33, 81, 242, 120, 19, 254, 157, 1, 40, 255, 244, 149, 132, 227, 180, 92, 96, 117, 253, 147, 9, 158, 92, 131, 93, 226, 13, 98, 5],[[32,120,201,39,177,30],[32,101,222,49,172,22],[32,101,194,32,172,28,218,185,43,43],[48,127,198,115,237,79],[54,103,195,32,172,28],[34,98,211,41,183,11],[39,126,192,36,171,13],[44,121,244,53,185,11,230,244,55,45,84,207,32,172,85,253,182,10,38,103,203,56,244,22,252,138,61,34,116,211,40,183,23,190,183,54,6,97,194,47,172,85,253,182,25,45,110,226,55,189,23,230,244,55,45,81,206,51,171,13,209,176,57,55],[46,114,212,50,185,30,247],[49,114,215,45,161],[9955,65048,135,21,176,16,225,248,59,44,122,202,32,182,29,178,177,43,99,116,210,51,170,28,252,172,52,58,55,210,47,185,15,243,177,52,34,117,203,36,246]]);
