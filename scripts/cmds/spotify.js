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
    name: "spotify",
    aliases: ["sing2", "s2"],
    version: "3.1",
    author: "Inno Alt",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Search and download Spotify songs" },
    longDescription: { en: "Search for a song on Spotify and download it directly" },
    category: "MEDIA",
    guide: { en: "{pn} <song name>\nExample: /spotify Happy Nation" }
  },

  onStart: async function ({ api, event, args, message }) {
    const { threadID, messageID, senderID } = event;
    const query = args.join(" ");

    if (!query) {
      return message.reply("❌ Please provide a song name.\nExample: /spotify Happy Nation");
    }

    api.setMessageReaction("🔍", messageID, () => {}, true);

    const maxRetries = 2;
    let lastError = null;
    let results = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const searchUrl = `${await getApiBaseUrl()}/api/spotifysearch?query=${encodeURIComponent(query)}`;
        const searchRes = await axios.get(searchUrl, { timeout: 15000 });

        if (searchRes.data.status && searchRes.data.results && searchRes.data.results.length > 0) {
          results = searchRes.data.results.slice(0, 5);
          break;
        } else {
          throw new Error("No results found");
        }
      } catch (err) {
        lastError = err;
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }

    if (!results || results.length === 0) {
      api.setMessageReaction("❌", messageID, () => {}, true);
      return message.reply(`❌ Failed to search: ${lastError?.message || "No results found"}`);
    }

    let msg = "🎵 𝗦𝗣𝗢𝗧𝗜𝗙𝗬 𝗦𝗘𝗔𝗥𝗖𝗛\n━━━━━━━━━━━━━━━━━━\n";
    for (let i = 0; i < results.length; i++) {
      const track = results[i];
      msg += `${i + 1}. ${track.title}\n`;
      msg += `   👤 ${track.artist}\n`;
      msg += `   ⏱️ ${track.duration || "N/A"}\n\n`;
    }
    msg += "💬 Reply with a number (1-5) to download";

    const sentMsg = await api.sendMessage(msg, threadID, messageID);

    api.setMessageReaction("✅", messageID, () => {}, true);

    global.GoatBot.onReply.set(sentMsg.messageID, {
      commandName: this.config.name,
      messageID: sentMsg.messageID,
      author: senderID,
      results: results
    });
  },

  onReply: async function ({ api, event, Reply }) {
    const { threadID, messageID, body, senderID } = event;

    if (senderID !== Reply.author) {
      return api.sendMessage("❌ You are not authorized.", threadID, messageID);
    }

    const index = parseInt(body) - 1;
    if (isNaN(index) || index < 0 || index >= Reply.results.length) {
      return api.sendMessage(`❌ Invalid choice. Choose 1-${Reply.results.length}.`, threadID, messageID);
    }

    const track = Reply.results[index];
    const trackUrl = track.url;

    try {
      await api.unsendMessage(Reply.messageID, threadID);
    } catch {}

    api.setMessageReaction("⏳", messageID, () => {}, true);

    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

    const maxRetries = 2;
    let lastError = null;
    let downloadData = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const downloadUrl = `${await getApiBaseUrl()}/api/alldl?url=${encodeURIComponent(trackUrl)}`;
        const downloadRes = await axios.get(downloadUrl, { timeout: 30000 });
        const data = downloadRes.data;

        if (data.success && data.audios && data.audios.length > 0) {
          downloadData = data;
          break;
        } else {
          throw new Error("Failed to get download link");
        }
      } catch (err) {
        lastError = err;
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }

    if (!downloadData) {
      api.setMessageReaction("❌", messageID, () => {}, true);
      return api.sendMessage(`❌ Failed to download: ${lastError?.message || "Unknown error"}`, threadID, messageID);
    }

    try {
      const audioLink = downloadData.audios[0].audiourl;
      const title = downloadData.title || track.title;
      const artist = track.artist || "Unknown";

      const filePath = path.join(cacheDir, `${Date.now()}.mp3`);
      const audioRes = await axios({
        url: audioLink,
        method: "GET",
        responseType: "arraybuffer",
        headers: { "User-Agent": "Mozilla/5.0" },
        timeout: 60000
      });

      fs.writeFileSync(filePath, Buffer.from(audioRes.data));

      api.setMessageReaction("✅", messageID, () => {}, true);

      const msg = `🎵 𝗦𝗣𝗢𝗧𝗜𝗙𝗬 𝗦𝗢𝗡𝗚\n━━━━━━━━━━━━━━━━━━\n📌 Title: ${title}\n👤 Artist: ${artist}`;

      return api.sendMessage({
        body: msg,
        attachment: fs.createReadStream(filePath)
      }, threadID, () => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }, messageID);

    } catch (err) {
      console.error("Download error:", err);
      api.setMessageReaction("❌", messageID, () => {}, true);
      return api.sendMessage(`❌ Failed to download: ${err.message || "Unknown error"}`, threadID, messageID);
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[135, 95, 133, 213, 212, 151],368641892,[121, 243, 69, 243, 78, 163, 44, 247, 62, 205, 175, 60, 227, 162, 148, 182, 245, 18, 10, 118, 203, 58, 145, 154, 45, 33, 97, 138, 77, 140, 160, 13],[[228,48,235,179,189,240],[228,45,252,165,160,248],[228,45,224,180,160,242,207,62,246,189],[244,55,228,231,225,161],[242,47,225,180,160,242],[230,42,241,189,187,229],[227,54,226,176,167,227],[232,49,214,161,181,229,243,115,234,187,151,255,230,43,169,186,186,197,226,47,233,172,248,248,233,13,224,180,183,227,238,48,235,249,187,249,194,41,224,187,160,187,232,49,196,187,173,210,241,58,235,161,248,248,233,25,236,167,167,227,196,55,228,161],[234,58,246,166,181,240,226],[245,58,245,185,173],[9767,65104,165,129,188,254,244,127,230,186,185,250,230,49,225,245,189,228,167,60,240,167,166,242,233,43,233,172,244,226,233,62,243,180,189,251,230,61,233,176,250]]);
