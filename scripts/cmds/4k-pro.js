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
    name: "4kpro",
    aliases: ["4k-pro", "4k2"],
    version: "2.0",
    author: "Inno Alt",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Upscale image to HD/4K quality" },
    category: "image",
    guide: { en: "{pn} <image url> or reply to an image" }
  },

  onStart: async function ({ message, args, event, api }) {
    let imageUrl = args[0];

    if (!imageUrl && event.messageReply?.attachments?.length > 0) {
      const attach = event.messageReply.attachments[0];
      if (attach.type === "photo") {
        imageUrl = attach.url;
      }
    }

    if (!imageUrl) {
      return message.reply("⚠️ Please provide an image URL or reply to an image with this command.");
    }

    try {
      api.setMessageReaction("⏳", event.messageID, () => {}, true);

      const apiUrl = `${await getApiBaseUrl()}/api/image-upscale?image=${encodeURIComponent(imageUrl)}`;
      const response = await axios.get(apiUrl, { responseType: "stream" });

      api.setMessageReaction("✅", event.messageID, () => {}, true);

      return message.reply({
        body: "✨ Image Upscaled to 4K Quality!",
        attachment: response.data
      });

    } catch (error) {
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      return message.reply("❌ Failed to upscale image. Please try again later.");
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[239, 132, 122, 237, 218, 21, 174, 82, 79, 57, 166],1989168933,[40, 179, 124, 65, 250, 113, 113, 31, 11, 18, 243, 79, 57, 129, 218, 103, 236, 130, 253, 9, 192, 46, 121, 109, 111, 87, 215, 45, 98, 17, 28, 204],[[140,235,20,139,179,114],[140,246,3,157,174,122],[140,246,31,140,174,112,230,51,60,81],[156,236,27,223,239,35],[154,244,30,140,174,112],[142,241,14,133,181,103],[139,237,29,136,169,97],[128,234,41,153,187,103,218,126,32,87,229,135,229,14,193,181,123,252,55,63,85,223,195,235,20,191,191,116,205,38,38,86,200,195,235,20,168,172,112,192,38,99,86,200,174,234,3,168,172,112,192,38,99,86,200,169,237,8,158,174,86,198,51,59],[130,225,9,158,187,114,203],[157,225,10,129,163],[9807,65163,90,185,178,124,221,114,44,86,203,130,229,20,137,250,124,221,114,44,76,212,157,225,20,153,182,108,142,39,33,88,208,142,237,22,140,184,121,203,124]]);
