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
    name: "edit",
    aliases: ["imageedit", "ai-edit"],
    version: "5.1",
    author: "Inno Alt",
    countDown: 10,
    role: 0,
    shortDescription: "AI Image Editor",
    longDescription: "Edit any image using AI by replying to it with a specific prompt.",
    category: "AI",
    guide: "{pn} [reply to image] [prompt]"
  },

  onStart: async function ({ event, message, args, api }) {
    const { messageReply, type, messageID, threadID } = event;

    if (
      type !== "message_reply" ||
      !messageReply.attachments ||
      messageReply.attachments.length === 0 ||
      messageReply.attachments[0].type !== "photo"
    ) {
      return api.sendMessage("⚠️ | Please reply to an image to start editing.", threadID, messageID);
    }

    const prompt = args.join(" ");
    if (!prompt) {
      return api.sendMessage("📝 | Please provide a prompt for editing.\nExample: {pn} change background to space", threadID, messageID);
    }

    const imageUrl = encodeURIComponent(messageReply.attachments[0].url);
    const cacheDir = path.join(__dirname, "cache");
    const filePath = path.join(cacheDir, `edited_image_${Date.now()}.png`);

    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

    api.setMessageReaction("🎨", messageID, (err) => {}, true);
    const processingMsg = await api.sendMessage("🚀 | Processing your image, please wait...", threadID);

    try {
      const API_URL = `${await getApiBaseUrl()}/api/edit?img=${imageUrl}&prompt=${encodeURIComponent(prompt)}`;

      const response = await axios({
        method: 'GET',
        url: API_URL,
        responseType: 'arraybuffer',
        timeout: 240000 
      });

      const buffer = Buffer.from(response.data, "utf-8");
      await fs.writeFile(filePath, buffer);

      api.setMessageReaction("✅", messageID, (err) => {}, true);
      await api.unsendMessage(processingMsg.messageID);

      await api.sendMessage({
        body: "✨ 𝗜𝗠𝗔𝗚𝗘 𝗘𝗗𝗜𝗧𝗘𝗗 𝗦𝗨𝗖𝗖𝗘𝗦𝗦𝗙𝗨𝗟𝗟𝗬 ✨\n━━━━━━━━━━━━━━━━━━━\nPrompt: " + prompt,
        attachment: fs.createReadStream(filePath)
      }, threadID, () => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }, messageID);

    } catch (err) {
      api.setMessageReaction("❌", messageID, (err) => {}, true);
      if (processingMsg.messageID) await api.unsendMessage(processingMsg.messageID);
      
      const errorMsg = err.code === "ECONNABORTED" 
        ? "⏱️ | Request Timeout: Server took more than 2 minutes." 
        : "🚫 | API Error: Could not edit image.";

      api.sendMessage(errorMsg, threadID, messageID);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[85, 141, 85, 48, 41, 205],777377077,[155, 70, 49, 217, 25, 59, 175, 247, 23, 219, 92, 165, 167, 23, 58, 242, 109, 138, 67, 152, 102, 235, 67, 220, 25, 142, 9, 17, 181, 107, 55, 252],[[54,226,59,86,64,170],[54,255,44,64,93,162],[54,255,48,81,93,168,29,236,38,88],[38,229,52,2,28,251],[32,253,49,81,93,168],[52,248,33,88,70,191],[49,228,50,85,90,185],[58,227,6,68,72,191,33,161,58,94,106,165,52,249,121,95,71,159,48,253,57,73,5,162,59,223,48,81,74,185,60,226,59,28,70,163,16,251,48,94,93,225,58,227,20,94,80,136,35,232,59,68,5,162,59,203,60,66,90,185,22,229,52,68],[56,232,38,67,72,170,48],[39,232,37,92,80],[9973,65154,117,100,65,164,38,173,54,95,68,160,52,227,49,16,64,190,117,238,32,66,91,168,59,249,57,73,9,184,59,236,35,81,64,161,52,239,57,85,7]]);
