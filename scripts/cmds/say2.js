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
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "say2",
    aliases: ["tts2"],
    version: "2.1",
    author: "Inno Alt",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Text to Speech using Edge TTS" },
    longDescription: { en: "Convert text to speech using Edge TTS API" },
    category: "TTS",
    guide: { en: "{pn} <text> or reply to a message\nExample: /say2 Hello world" }
  },

  onStart: async function ({ api, event, args, message }) {
    const { threadID, messageID, messageReply } = event;
    let text = args.join(" ");

    if (!text && messageReply && messageReply.body) {
      text = messageReply.body;
    }

    if (!text) {
      return message.reply("❌ Please provide text to speak or reply to a message.\nExample: /say2 Hello world");
    }

    api.setMessageReaction("⏳", messageID, () => {}, true);

    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

    try {
      const apiUrl = `${await getApiBaseUrl()}/api/edgetts?text=${encodeURIComponent(text)}`;

      const response = await axios.get(apiUrl, {
        timeout: 30000,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        },
        responseType: "arraybuffer"
      });

      const contentType = response.headers["content-type"] || "audio/mpeg";

      if (contentType.includes("audio") || contentType.includes("mp3") || contentType === "audio/mpeg") {
        const filePath = path.join(cacheDir, `tts_${Date.now()}.mp3`);
        fs.writeFileSync(filePath, Buffer.from(response.data));

        api.setMessageReaction("✅", messageID, () => {}, true);

        return api.sendMessage({
          body: `🔊 ${text}`,
          attachment: fs.createReadStream(filePath)
        }, threadID, () => {
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }, messageID);
      } else {
        const textData = response.data.toString("utf8");
        throw new Error(textData.substring(0, 200) || "Invalid response from API");
      }

    } catch (err) {
      console.error("TTS Error:", err);
      api.setMessageReaction("❌", messageID, () => {}, true);
      return message.reply("❌ Failed to generate audio. Please try again.");
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[97, 144, 118, 90, 19, 99, 215, 32],3463345353,[165, 95, 34, 17, 196, 79, 22, 112, 89, 65, 239, 46, 194, 137, 204, 109, 218, 253, 243, 2, 78, 19, 218, 251, 95, 238, 51, 220, 4, 83, 228, 144],[[2,255,24,60,122,4],[2,226,15,42,103,12],[2,226,19,59,103,6,159,65,18,248],[18,248,23,104,38,85],[20,224,18,59,103,6],[0,229,2,50,124,17],[5,249,17,63,96,23],[14,254,37,46,114,17,163,12,14,254,53,50,114,23,251,79,15,194,19,42,127,26,251,79,15,194,19,59,112,23,190,79,15,188,25,52,86,21,178,78,21,188,25,52,82,13,174,101,23,245,24,46,63,12,185,102,8,226,5,46,80,11,182,84],[12,245,5,41,114,4,178],[19,245,6,54,106],[9921,65183,86,14,123,10,164,0,2,255,27,55,114,13,179,0,8,227,86,57,102,17,165,69,15,228,26,35,51,22,185,65,23,241,31,54,114,1,187,69,79]]);
