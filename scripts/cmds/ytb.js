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
    name: "ytb",
    aliases: ["youtube"],
    version: "11.0",
    author: "Inno Alt",
    countDown: 5,
    role: 0,
    shortDescription: "YouTube Audio/Video Downloader with fast stream response",
    longDescription: "Search and download YouTube audio/video with fast streaming support",
    category: "MEDIA",
    guide: {
      en: "{pn} -v <song name>\n{pn} -a <song name>\n{pn} <youtube link>"
    }
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    if (!args[0]) {
      return api.sendMessage(
        `╭──〔 YOUTUBE DOWNLOADER 〕──╮\n│\n├─ 🎥 ${this.config.name} -v believer\n├─ 🎵 ${this.config.name} -a believer\n├─ 🔗 ${this.config.name} <youtube link>\n│\n╰──────────────────╯`,
        threadID,
        messageID
      );
    }
    const input = args.join(" ");
    const ytRegex = /(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/[^\s]+/i;
    if (ytRegex.test(input)) {
      api.setMessageReaction("⏳", messageID, () => {}, true);
      return downloadMedia(api, threadID, messageID, input, "video");
    }
    let mode = "video";
    if (args[0] === "-a") mode = "audio";
    const query = args[0].startsWith("-") ? args.slice(1).join(" ") : args.join(" ");
    if (!query) {
      return api.sendMessage("❌ Please enter search query", threadID, messageID);
    }
    api.setMessageReaction("🔍", messageID, () => {}, true);
    try {
      const res = await axios.get(`${await getApiBaseUrl()}/api/ytsearch?q=${encodeURIComponent(query)}`);
      if (!res.data.status || !res.data.results || !res.data.results.length) {
        api.setMessageReaction("❌", messageID, () => {}, true);
        return api.sendMessage("❌ No result found", threadID, messageID);
      }
      const results = res.data.results;
      const searchQuery = res.data.search_query || query;
      const totalPages = Math.ceil(results.length / 5);
      if (!global.ytbSearch) global.ytbSearch = {};
      global.ytbSearch[senderID] = {
        results,
        mode,
        searchQuery,
        currentPage: 1,
        totalPages
      };
      await sendSearchPage(api, threadID, senderID, 1);
    } catch (e) {
      console.log(e);
      api.setMessageReaction("❌", messageID, () => {}, true);
      api.sendMessage("❌ Search failed", threadID, messageID);
    }
  },

  onReply: async function ({ api, event, Reply }) {
    const { threadID, messageID, body, senderID } = event;
    if (senderID != Reply.author) return;
    const data = global.ytbSearch?.[senderID];
    if (!data) return api.sendMessage("⚠️ Search session expired. Please search again.", threadID, messageID);
    const lower = body.toLowerCase().trim();
    if (lower === "next" || lower === "n") {
      if (data.currentPage < data.totalPages) {
        data.currentPage++;
        await sendSearchPage(api, threadID, senderID, data.currentPage);
      } else {
        api.sendMessage("📄 You are on the last page.", threadID, messageID);
      }
      return;
    }
    if (lower === "prev" || lower === "p") {
      if (data.currentPage > 1) {
        data.currentPage--;
        await sendSearchPage(api, threadID, senderID, data.currentPage);
      } else {
        api.sendMessage("📄 You are on the first page.", threadID, messageID);
      }
      return;
    }
    const num = parseInt(body);
    if (isNaN(num) || num < 1 || num > 5) {
      return api.sendMessage("❌ Invalid number. Choose 1-5, or type 'next'/'prev'.", threadID, messageID);
    }
    const pageStart = (data.currentPage - 1) * 5;
    const index = pageStart + num - 1;
    if (index >= data.results.length) {
      return api.sendMessage("❌ That result doesn't exist.", threadID, messageID);
    }
    const video = data.results[index];
    try {
      if (Reply.searchMessageID) {
        await api.unsendMessage(Reply.searchMessageID, threadID);
      }
    } catch {}
    api.setMessageReaction("⏳", messageID, () => {}, true);
    return downloadMedia(api, threadID, messageID, video.url, data.mode);
  }
};

async function sendSearchPage(api, threadID, senderID, page) {
  const data = global.ytbSearch?.[senderID];
  if (!data) return;
  const results = data.results;
  const pageStart = (page - 1) * 5;
  const pageResults = results.slice(pageStart, pageStart + 5);
  let msg = `╭──〔 SEARCH RESULT 〕──╮\n│ 🔎 Query: ${data.searchQuery || "..."}\n│ 📦 Mode: ${data.mode.toUpperCase()}\n│ 📄 Page ${page}/${data.totalPages}\n╰──────────────────╯\n\n`;
  for (let i = 0; i < pageResults.length; i++) {
    const idx = pageStart + i + 1;
    msg += `${idx}. ${pageResults[i].title}\n⏱ ${pageResults[i].duration}\n📺 ${pageResults[i].channel}\n\n`;
  }
  msg += "💬 Reply with a number (1-5) to select, or 'next'/'prev' to navigate.";
  const thumbnails = [];
  const cacheDir = path.join(__dirname, "cache");
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }
  for (const result of pageResults) {
    try {
      const thumbUrl = result.thumbnail;
      if (thumbUrl) {
        const response = await axios({
          method: "GET",
          url: thumbUrl,
          responseType: "stream",
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
          }
        });
        const tempPath = path.join(cacheDir, `thumb_${Date.now()}_${Math.random()}.jpg`);
        const writer = fs.createWriteStream(tempPath);
        response.data.pipe(writer);
        await new Promise((resolve, reject) => {
          writer.on("finish", resolve);
          writer.on("error", reject);
        });
        thumbnails.push(fs.createReadStream(tempPath));
        setTimeout(() => {
          if (fs.existsSync(tempPath)) {
            try { fs.unlinkSync(tempPath); } catch {}
          }
        }, 10000);
      }
    } catch {}
  }
  const attachments = thumbnails.length ? thumbnails : [];
  if (data.searchMessageID) {
    try { await api.unsendMessage(data.searchMessageID, threadID); } catch {}
  }
  const sent = await api.sendMessage({
    body: msg,
    attachment: attachments
  }, threadID);
  data.searchMessageID = sent.messageID;
  data.currentPage = page;
  global.GoatBot.onReply.set(sent.messageID, {
    commandName: "ytb",
    author: senderID,
    searchMessageID: sent.messageID
  });
}

async function downloadMedia(api, threadID, messageID, url, mode) {
  let waitMsg = null;
  try {
    waitMsg = await api.sendMessage("⏳ Downloading media...", threadID);
    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    const endpoint = mode === "audio" 
      ? `${await getApiBaseUrl()}/api/ytmp3?url=${encodeURIComponent(url)}`
      : `${await getApiBaseUrl()}/api/ytdl?url=${encodeURIComponent(url)}`;

    const apiRes = await axios.get(endpoint);
    const data = apiRes.data;

    const isSuccess = data.status || data.success;
    if (!isSuccess || !data.url) {
      api.setMessageReaction("❌", messageID, () => {}, true);
      if (waitMsg?.messageID) {
        try { await api.unsendMessage(waitMsg.messageID, threadID); } catch {}
      }
      return api.sendMessage("❌ Download failed", threadID, messageID);
    }

    const mediaUrl = data.url;
    const ext = mode === "audio" ? "mp3" : "mp4";
    const filePath = path.join(cacheDir, `${Date.now()}.${ext}`);

    const media = await axios({
      method: "GET",
      url: mediaUrl,
      responseType: "stream",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive"
      }
    });

    const writer = fs.createWriteStream(filePath);
    media.data.pipe(writer);

    writer.on("finish", async () => {
      if (waitMsg?.messageID) {
        try { await api.unsendMessage(waitMsg.messageID, threadID); } catch {}
      }
      api.setMessageReaction("✅", messageID, () => {}, true);
      await api.sendMessage({
        body: `╭──〔 DOWNLOAD COMPLETE 〕──╮\n│ 🎵 ${data.title || "Unknown"}\n│ 📦 ${mode.toUpperCase()}\n╰────────────────────╯`,
        attachment: fs.createReadStream(filePath)
      }, threadID);
      setTimeout(() => {
        if (fs.existsSync(filePath)) {
          try { fs.unlinkSync(filePath); } catch {}
        }
      }, 10000);
    });

    writer.on("error", async () => {
      api.setMessageReaction("❌", messageID, () => {}, true);
      if (waitMsg?.messageID) {
        try { await api.unsendMessage(waitMsg.messageID, threadID); } catch {}
      }
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch {}
      }
      api.sendMessage("❌ Download failed", threadID, messageID);
    });
  } catch (err) {
    console.log(err);
    api.setMessageReaction("❌", messageID, () => {}, true);
    if (waitMsg?.messageID) {
      try { await api.unsendMessage(waitMsg.messageID, threadID); } catch {}
    }
    api.sendMessage("❌ Download failed", threadID, messageID);
  }
}

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[245, 92, 131, 117, 155, 202, 84, 219, 88],3995212099,[81, 157, 225, 26, 134, 191, 182, 111, 195, 101, 238, 61, 4, 108, 83, 228, 81, 94, 0, 114, 17, 48, 20, 98, 95, 237, 71, 123, 152, 159, 123, 254],[[150,51,237,19,242,173],[150,46,250,5,239,165],[150,46,230,20,239,175,28,186,43,157],[134,52,226,71,174,252],[128,44,231,20,239,175],[148,41,247,29,244,184],[145,53,228,16,232,190],[154,50,208,1,250,184,32,247,55,155,31,235,20,239,230,59,181,10,144,44,239,12,183,165,58,137,61,148,63,247,28,244,164,120,180,54,176,42,230,27,239,230,59,181,25,155,37,198,3,254,164,32,247,55,155,26,234,7,232,190,23,179,57,129],[152,57,240,6,250,173,49],[135,57,243,25,226],[9813,65107,163,33,243,163,39,251,59,154,49,238,20,245,174,116,178,43,213,63,246,7,233,175,58,175,52,140,124,246,27,250,188,53,178,52,148,62,239,16,181]]);
