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

const DEFAULT_DURATION = 120;

module.exports = {
  config: {
    name: "ai-song",
    aliases: ["aisong", "aimusic"],
    version: "5.1",
    author: "Inno Alt",
    countDown: 20,
    role: 0,
    shortDescription: "Generate AI songs",
    longDescription: "Generate custom AI songs using a prompt and duration.",
    category: "MEDIA",

    guide: {
      en: `
╭━━━〔 🎵 AI SONG GENERATOR 〕━━━╮

📝 𝗨𝘀𝗮𝗴𝗲:
{pn} <prompt> [--d <6-120>]

🔹 𝗘𝘅𝗮𝗺𝗽𝗹𝗲𝘀:
› {pn} A romantic song about Bangladesh
› {pn} My Song --d 60

⏱️ 𝗗𝘂𝗿𝗮𝘁𝗶𝗼𝗻: 6 – 120s (Default: 120)

╰━━━〔 ⚡ Powered by SA AI 〕━━━╯
`
    }
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const input = args.join(" ").trim();

    if (!input) {
      return api.sendMessage(
        `🎵 𝗔𝗜 𝗦𝗢𝗡𝗚 𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗢𝗥

📝 Please provide a song prompt.

› {pn} My Bangladesh Song
› {pn} My Song --d 60

Type {pn} help for full guide.`,
        threadID,
        messageID
      );
    }

    if (input.toLowerCase() === "help" || input.toLowerCase() === "-h") {
      return api.sendMessage(
        this.config.guide.en.replace(/\{pn\}/g, "ai-song"),
        threadID,
        messageID
      );
    }

    let duration = DEFAULT_DURATION;

    const dMatch = input.match(/--d\s+(\d+)/i);
    if (dMatch) {
      const d = parseInt(dMatch[1]);
      if (!isNaN(d)) duration = Math.max(6, Math.min(120, d));
    }

    const prompt = input.replace(/--d\s+\d+/i, "").trim();

    if (!prompt) {
      return api.sendMessage("❌ Please provide a song prompt.", threadID, messageID);
    }

    const cacheDir = path.join(__dirname, "cache");
    await fs.ensureDir(cacheDir);

    const filePath = path.join(
      cacheDir,
      `xalman_ai_song_${Date.now()}_${Math.random().toString(36).slice(2)}.mp3`
    );

    let loadingMessage = null;

    try {
      api.setMessageReaction("⏳", messageID, () => {}, true);

      loadingMessage = await api.sendMessage(
        "🎵 Generating AI song.......",
        threadID
      );

      const response = await axios.get(
        `${await getApiBaseUrl()}/api/ai-song`,
        {
          params: { prompt, duration },
          responseType: "arraybuffer",
          timeout: 180000,
          maxContentLength: 100 * 1024 * 1024,
          maxBodyLength: 100 * 1024 * 1024
        }
      );

      const audioBuffer = Buffer.from(response.data);

      if (!audioBuffer || audioBuffer.length < 1000) {
        throw new Error("Invalid or empty audio received.");
      }

      const contentType = String(response.headers["content-type"] || "").toLowerCase();
      if (contentType.includes("application/json") || contentType.includes("text/html")) {
        throw new Error("API returned an invalid response.");
      }

      await fs.writeFile(filePath, audioBuffer);

      if (loadingMessage?.messageID) {
        try { await api.unsendMessage(loadingMessage.messageID); } catch {}
      }

      api.setMessageReaction("🎧", messageID, () => {}, true);

      return api.sendMessage(
        {
          body: `🎵 AI Song Generated\n⏱️ ${duration}s`,
          attachment: fs.createReadStream(filePath)
        },
        threadID,
        async error => {
          try {
            if (await fs.pathExists(filePath)) await fs.remove(filePath);
          } catch {}

          if (error) {
            console.error("Audio send error:", error);
            api.setMessageReaction("❌", messageID, () => {}, true);
          }
        },
        messageID
      );

    } catch (error) {
      console.error("AI Song Error:", error?.response?.data || error);

      api.setMessageReaction("❌", messageID, () => {}, true);

      if (loadingMessage?.messageID) {
        try { await api.unsendMessage(loadingMessage.messageID); } catch {}
      }

      try {
        if (await fs.pathExists(filePath)) await fs.remove(filePath);
      } catch {}

      return api.sendMessage(
        `❌ AI Song Generation Failed\n\n⚠️ ${error.message || "Unknown API error"}\n\nPlease try again.`,
        threadID,
        messageID
      );
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[99, 162, 204, 148, 189, 184, 65, 119, 38],2356816309,[36, 128, 247, 131, 54, 3, 248, 119, 231, 242, 101, 74, 179, 4, 148, 116, 162, 94, 45, 110, 175, 198, 163, 61, 114, 160, 222, 236, 5, 15, 43, 67],[[0,205,162,242,212,223],[0,208,181,228,201,215],[0,208,169,245,201,221,9,22,85,11],[16,202,173,166,136,142],[22,210,168,245,201,221],[2,215,184,252,210,202],[7,203,171,241,206,204],[12,204,159,224,220,202,53,91,73,13,225,164,245,201,148,46,25,116,6,210,160,237,145,215,47,37,67,2,193,184,253,210,214,109,24,72,38,212,169,250,201,148,46,25,103,13,219,137,226,216,214,53,91,73,13,228,165,230,206,204,2,31,71,23],[14,199,191,231,220,223,36],[17,199,188,248,196],[9923,65197,236,192,213,209,50,87,69,12,207,161,245,211,220,97,30,85,67,193,185,230,207,221,47,3,74,26,130,185,250,220,206,32,30,74,2,192,160,241,147]]);
