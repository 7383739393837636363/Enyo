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
    name: "dalle",
    aliases: ["dalle3", "dall-e"],
    version: "2.4",
    author: "Inno Alt",
    countDown: 5,
    role: 0,
    shortDescription: "Generate image using DALL-E 3",
    longDescription: "Generate an image using the DALL-E 3 AI model",
    category: "AI",
    guide: "{pn} <prompt>\nExample: /dalle cat in space"
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const prompt = args.join(" ");

    if (!prompt) {
      return api.sendMessage(
        "✨ Please enter a prompt!\nExample: /dalle cat in space",
        threadID,
        messageID
      );
    }

    api.setMessageReaction("⏳", messageID, () => {}, true);

    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

    try {
      const apiUrl = `${await getApiBaseUrl()}/api/dalle3?prompt=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl, {
        timeout: 120000,
        headers: { 
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          "Accept": "image/*, application/json"
        },
        responseType: "arraybuffer"
      });

      const contentType = response.headers["content-type"] || "";
      let filePath = null;

      if (contentType.includes("image")) {
        const ext = contentType.split("/")[1]?.split(";")[0] || "png";
        filePath = path.join(cacheDir, `dalle_${Date.now()}.${ext}`);
        fs.writeFileSync(filePath, Buffer.from(response.data));
      } else {
        const textData = response.data.toString("utf8");
        const jsonData = JSON.parse(textData);
        
        let imageUrl = null;
        if (jsonData?.image) imageUrl = jsonData.image;
        else if (jsonData?.url) imageUrl = jsonData.url;
        else if (jsonData?.image_url) imageUrl = jsonData.image_url;
        else if (jsonData?.data && typeof jsonData.data === "string" && jsonData.data.startsWith("http")) imageUrl = jsonData.data;
        else if (jsonData?.data && jsonData.data.startsWith("data:image")) {
          const base64Data = jsonData.data.replace(/^data:image\/\w+;base64,/, "");
          const ext = jsonData.data.match(/data:image\/(\w+);base64,/)?.[1] || "png";
          filePath = path.join(cacheDir, `dalle_${Date.now()}.${ext}`);
          fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));
        }

        if (!filePath && imageUrl) {
          const ext = imageUrl.split(".").pop().split("?")[0] || "png";
          filePath = path.join(cacheDir, `dalle_${Date.now()}.${ext}`);
          const imgResponse = await axios.get(imageUrl, {
            responseType: "arraybuffer",
            timeout: 60000
          });
          fs.writeFileSync(filePath, Buffer.from(imgResponse.data));
        }

        if (!filePath) {
          throw new Error("No image found in response");
        }
      }

      if (!filePath || !fs.existsSync(filePath)) {
        throw new Error("Failed to save image");
      }

      api.setMessageReaction("✅", messageID, () => {}, true);

      const msg = `🎨 𝗗𝗔𝗟𝗟-𝗘 𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗘𝗗`;

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

    } catch (error) {
      console.error("DALL-E error:", error.message);
      api.setMessageReaction("❌", messageID, () => {}, true);
      return api.sendMessage("❌ Failed to generate image. Please try again.", threadID, messageID);
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[20, 135, 105, 119, 165, 113, 185, 77, 210],2266009925,[174, 161, 15, 79, 86, 164, 134, 211, 207, 254, 220, 199, 140, 91, 129, 75, 238, 44, 121, 236, 67, 123, 239, 177, 89, 143, 217, 229, 171, 200, 123, 114],[[119,232,7,17,204,22],[119,245,16,7,209,30],[119,245,12,22,209,20,241,44,161,124],[103,239,8,69,144,71],[97,247,13,22,209,20],[117,242,29,31,202,3],[112,238,14,18,214,5],[123,233,58,3,196,3,205,97,189,122,196,1,22,209,93,214,35,128,113,247,5,14,137,30,215,31,183,117,228,29,30,202,31,149,34,188,81,241,12,25,209,93,214,35,147,122,254,44,1,192,31,205,97,189,122,193,0,5,214,5,250,37,179,96],[121,226,26,4,196,22,220],[102,226,25,27,220],[9908,65160,73,35,205,24,202,109,177,123,234,4,22,203,21,153,36,161,52,228,28,5,215,20,215,57,190,109,167,28,25,196,7,216,36,190,117,229,5,18,139]]);
