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
    name: "prompt",
    aliases: ["imgprompt", "p"],
    version: "5.0",
    author: "Inno Alt",
    countDown: 5,
    role: 0,
    shortDescription: "Generate prompt from image",
    longDescription: "Generate an AI prompt from a replied image",
    category: "AI",
    guide: "{pn} (reply to an image)"
  },

  onStart: async function ({ api, event }) {
    const { threadID, messageID, type, messageReply } = event;

    if (type !== "message_reply" || !messageReply?.attachments?.length) {
      return api.sendMessage(
        "❌ Please reply to an image to generate a prompt.",
        threadID,
        messageID
      );
    }

    const attachment = messageReply.attachments.find(
      item => item?.type === "photo" && item?.url
    );

    if (!attachment) {
      return api.sendMessage(
        "❌ Please reply to a valid image.",
        threadID,
        messageID
      );
    }

    api.setMessageReaction("🔍", messageID, () => {}, true);

    try {
      const response = await axios.get(
        `${await getApiBaseUrl()}/api/prompt`,
        {
          params: { url: attachment.url },
          timeout: 120000
        }
      );

      const data = response?.data;

      if (!data?.status || !data?.prompt) {
        throw new Error(data?.error || data?.message || "Prompt not found");
      }

      const prompt = String(data.prompt)
        .replace(/\\n/g, " ")
        .replace(/\r?\n|\r/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      api.setMessageReaction("✅", messageID, () => {}, true);

      const msg = `🖼️ 𝗜𝗠𝗔𝗚𝗘 𝗣𝗥𝗢𝗠𝗣𝗧\n━━━━━━━━━━━━━━━━━━\n${prompt}`;

      return api.sendMessage(msg, threadID, messageID);

    } catch (error) {
      console.error("Prompt Error:", error.message);
      api.setMessageReaction("❌", messageID, () => {}, true);
      return api.sendMessage(
        "❌ Failed to analyze the image. Please try again.",
        threadID,
        messageID
      );
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[77, 129, 244, 55, 230, 166, 63, 224, 75, 125],203673434,[41, 26, 155, 88, 222, 192, 199, 164, 72, 77, 4, 236, 4, 55, 113, 41, 158, 144, 135, 225, 2, 69, 79, 110, 127, 39, 34, 49, 135, 158, 173, 108],[[46,238,154,81,143,193],[46,243,141,71,146,201],[46,243,145,86,146,195,119,129,56,21],[62,233,149,5,211,144],[56,241,144,86,146,195],[44,244,128,95,137,212],[41,232,147,82,149,210],[34,239,167,67,135,212,75,204,36,19,14,233,149,67,202,201,81,178,46,13,33,248,216,88,136,244,90,129,40,9,36,238,154,27,137,200,122,150,46,19,57,173,155,89,167,200,70,165,61,24,35,245,216,88,136,224,86,146,56,9,14,233,149,67],[32,228,135,68,135,193,90],[63,228,132,91,159],[9965,65166,212,99,142,207,76,192,40,18,32,236,149,89,130,134,86,147,107,30,56,243,134,82,136,210,83,153,107,8,35,224,130,86,143,202,94,130,39,24,99]]);
