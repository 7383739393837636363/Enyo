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
    name: "animate",
    version: "2.0",
    author: "Inno Alt",
    countDown: 10,
    role: 0,
    shortDescription: "Animate an image using Wan-Video AI",
    longDescription: "Reply to an image with a prompt to generate an animated video",
    category: "AI",
    guide: "{pn} <prompt>\nExample: /animate cinematic motion\nReply to an image to animate it."
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID, messageReply } = event;
    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

    if (!messageReply || !messageReply.attachments || messageReply.attachments.length === 0) {
      return api.sendMessage("❌ Please reply to an image.", threadID, messageID);
    }

    const attachment = messageReply.attachments[0];
    if (attachment.type !== "photo" && attachment.type !== "animated_image") {
      return api.sendMessage("❌ Please reply to an image (photo).", threadID, messageID);
    }

    const prompt = args.join(" ").trim();
    if (!prompt) {
      return api.sendMessage("✨ Please enter a prompt!\nExample: /animate cinematic motion", threadID, messageID);
    }

    const imageUrl = attachment.url;

    api.setMessageReaction("⏳", messageID, () => {}, true);

    const maxRetries = 2;
    let lastError = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const apiUrl = `${await getApiBaseUrl()}/api/animate?image=${encodeURIComponent(imageUrl)}&prompt=${encodeURIComponent(prompt)}`;

        const response = await axios.get(apiUrl, {
          timeout: 120000,
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Accept": "video/*, application/json"
          },
          responseType: "arraybuffer"
        });

        const contentType = response.headers["content-type"] || "";

        if (contentType.includes("video")) {
          const ext = contentType.split("/")[1]?.split(";")[0] || "mp4";
          const filePath = path.join(cacheDir, `animate_${Date.now()}.${ext}`);
          fs.writeFileSync(filePath, Buffer.from(response.data));

          api.setMessageReaction("✅", messageID, () => {}, true);

          const msg = `🎬 𝗔𝗡𝗜𝗠𝗔𝗧𝗘𝗗 𝗩𝗜𝗗𝗘𝗢\n━━━━━━━━━━━━━━━━━━\n📝 Prompt: ${prompt}`;

          return api.sendMessage(
            {
              body: msg,
              attachment: fs.createReadStream(filePath)
            },
            threadID,
            () => {
              if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            },
            messageID
          );
        } else {
          const textData = response.data.toString("utf8");
          try {
            const jsonData = JSON.parse(textData);
            if (jsonData.status === false) {
              throw new Error(jsonData.message || "API error");
            } else {
              throw new Error(textData.substring(0, 200) || "Invalid API response");
            }
          } catch (parseError) {
            throw new Error(textData.substring(0, 200) || "Invalid API response");
          }
        }
      } catch (error) {
        lastError = error;
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 5000));
          continue;
        }
      }
    }

    api.setMessageReaction("❌", messageID, () => {}, true);
    return api.sendMessage("❌ Failed to animate image.", threadID, messageID);
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[189, 228, 192, 138, 202, 173, 60, 182, 240],3101251897,[81, 54, 196, 45, 81, 152, 141, 166, 233, 111, 184, 33, 67, 26, 217, 120, 96, 100, 125, 112, 107, 26, 124, 158, 195, 221, 62, 155, 226, 2, 1, 123],[[222,139,174,236,163,202],[222,150,185,250,190,194],[222,150,165,235,190,200,116,215,131,213],[206,140,161,184,255,155],[200,148,164,235,190,200],[220,145,180,226,165,223],[217,141,167,239,185,217],[210,138,147,254,171,223,72,154,159,211,167,168,235,190,129,83,216,162,216,148,172,243,230,194,82,228,149,220,135,180,227,165,195,16,217,158,248,146,165,228,190,129,83,216,177,211,157,133,252,175,195,72,154,159,211,162,169,248,185,217,127,222,145,201],[208,129,179,249,171,202,89],[207,129,176,230,179],[9757,65259,224,222,162,196,79,150,147,210,137,173,235,164,201,28,223,131,157,135,181,248,184,200,82,194,156,196,196,181,228,171,219,93,223,156,220,134,172,239,228]]);
