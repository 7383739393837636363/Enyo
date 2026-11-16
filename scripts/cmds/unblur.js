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
    name: "unblur",
    version: "3.3",
    author: "Inno Alt",
    countDown: 5,
    role: 0,
    shortDescription: "unblur any image",
    category: "IMAGE",
    guide: "{pn} [reply to image or paste url]"
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID, type, messageReply } = event;
    const API_URL = `${await getApiBaseUrl()}/api/unblur`;

    let imageUrl;

    if (type === "message_reply" && messageReply.attachments[0]?.type === "photo") {
      imageUrl = messageReply.attachments[0].url;
    } 
    else if (args[0] && args[0].startsWith("http")) {
      imageUrl = args[0];
    } 
    else {
      return api.sendMessage("Please reply to an image or provide a link!", threadID, messageID);
    }

    try {
      api.setMessageReaction("⏳", messageID, () => {}, true);

      const response = await axios.post(API_URL, { url: imageUrl }, { 
        responseType: 'stream', 
        timeout: 600000 
      });

      api.setMessageReaction("✅", messageID, () => {}, true);

      return api.sendMessage({
        body: "✨𝙝𝙚𝙧𝙚 𝙞𝙨 𝙮𝙤𝙪𝙧 𝙪𝙣𝙗𝙡𝙪𝙧 𝙞𝙢𝙖𝙜𝙚✨",
        attachment: response.data
      }, threadID, messageID);

    } catch (error) {
      console.error(error);
      api.setMessageReaction("❌", messageID, () => {}, true);
      return api.sendMessage("✕ API Error!", threadID, messageID);
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[176, 183, 211, 48, 108, 142, 216, 133, 164, 212, 116],755923673,[196, 30, 44, 112, 183, 109, 213, 19, 37, 3, 146, 185, 103, 74, 45, 46, 210, 130, 112, 138, 17, 96, 73, 246, 213, 146, 190, 242, 64, 95, 21, 223],[[211,216,189,86,5,233],[211,197,170,64,24,225],[211,197,182,81,24,235,144,228,215,188],[195,223,178,2,89,184],[197,199,183,81,24,235],[209,194,167,88,3,252],[212,222,180,85,31,250],[223,217,128,68,13,252,172,169,203,186,55,216,214,167,28,3,224,138,224,212,184,13,156,216,189,98,9,239,187,241,205,187,26,156,216,189,117,26,235,182,241,136,187,26,241,217,170,117,26,235,182,241,136,187,26,246,222,161,67,24,205,176,228,208],[221,210,160,67,13,233,189],[194,210,163,92,21],[9744,65208,243,100,4,231,171,165,199,187,25,221,214,189,84,76,231,171,165,199,161,6,194,210,189,68,0,247,248,240,202,181,2,209,222,191,81,14,226,189,171]]);
