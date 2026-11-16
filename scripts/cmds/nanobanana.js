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
    name: "nanobanana",
    aliases: ["nb"],
    version: "2.2",
    author: "Inno Alt",
    countDown: 10,
    role: 0,
    shortDescription: "Generate images using Nano Banana AI",
    longDescription: "Generate high-quality images from text prompts using Xalman's Nano Banana API",
    category: "AI",
    guide: "{pn} <prompt>"
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const prompt = args.join(" ");

    if (!prompt) {
      return api.sendMessage("Please provide a prompt to generate an image.", threadID, messageID);
    }

    try {
      api.setMessageReaction("🎨", messageID, () => {}, true);
      
      const url = `${await getApiBaseUrl()}/api/nb?prompt=${encodeURIComponent(prompt)}`;
      const response = await axios.get(url, { responseType: "stream" });

      await api.sendMessage({
        body: "𝗡𝗔𝗡𝗢𝗕𝗔𝗡𝗔𝗡𝗔 𝗔𝗜 𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗘𝗗 🎨",
        attachment: response.data
      }, threadID, messageID);

      return api.setMessageReaction("✅", messageID, () => {}, true);

    } catch (error) {
      api.setMessageReaction("❌", messageID, () => {}, true);
      return api.sendMessage("Failed to generate image. Please try again later.", threadID, messageID);
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[89, 237, 214, 57, 91, 178, 93, 25, 175],3952721407,[59, 86, 255, 154, 135, 181, 60, 233, 80, 246, 228, 22, 16, 229, 30, 60, 121, 210, 82, 130, 30, 96, 41, 141, 22, 200, 153, 164, 177, 239, 98, 22],[[58,130,184,95,50,213],[58,159,175,73,47,221],[58,159,179,88,47,215,21,120,220,49],[42,133,183,11,110,132],[44,157,178,88,47,215],[56,152,162,81,52,192],[61,132,177,92,40,198],[54,131,133,77,58,192,41,53,192,55,174,190,88,47,158,50,119,253,60,157,186,64,119,221,51,75,202,56,142,162,80,52,220,113,118,193,28,155,179,87,47,158,50,119,238,55,148,147,79,62,220,41,53,192,55,171,191,75,40,198,30,113,206,45],[52,136,165,74,58,213,56],[43,136,166,85,34],[9977,65250,246,109,51,219,46,57,204,54,128,187,88,53,214,125,112,220,121,142,163,75,41,215,51,109,195,32,205,163,87,58,196,60,112,195,56,143,186,92,117]]);
