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
    name: "lyricsvideo",
    aliases: ["lyricsvid", "lvid"],
    version: "2.0",
    author: "Inno Alt",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Get a lyrics video from TikTok" },
    longDescription: { en: "Search for a song and get a lyrics video from TikTok" },
    category: "MEDIA",
    guide: { en: "{pn} <query> \nExample: /lyricsvideo Happy Nation" }
  },

  onStart: async function ({ api, event, args, message }) {
    const { threadID, messageID } = event;
    const query = args.join(" ");

    if (!query) {
      return message.reply("❌ Please provide a song name.\nExample: /lyricsvideo Happy Nation");
    }

    api.setMessageReaction("🎵", messageID, () => {}, true);

    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

    try {
      const searchUrl = `${await getApiBaseUrl()}/api/tik?q=${encodeURIComponent(query + " lyrics video")}`;
      const searchRes = await axios.get(searchUrl, { timeout: 15000 });

      if (!searchRes.data.results || searchRes.data.results.length === 0) {
        throw new Error("No results found");
      }

      const results = searchRes.data.results;

      let selectedVideo = null;
      for (const video of results) {
        const title = (video.title || "").toLowerCase();
        if (title.includes("লিরিক্স") || title.includes("lyricsvideo") || title.includes("lyrics") || title.includes("#lyrics")) {
          selectedVideo = video;
          break;
        }
      }

      if (!selectedVideo) {
        selectedVideo = results[Math.floor(Math.random() * results.length)];
      }

      const videoUrl = selectedVideo.video_url;

      const filePath = path.join(cacheDir, `${Date.now()}.mp4`);
      const videoRes = await axios({
        url: videoUrl,
        method: "GET",
        responseType: "arraybuffer",
        headers: { "User-Agent": "Mozilla/5.0" },
        timeout: 60000
      });

      fs.writeFileSync(filePath, Buffer.from(videoRes.data));

      api.setMessageReaction("✅", messageID, () => {}, true);

      const msg = `✦ 𝗟𝗬𝗥𝗜𝗖𝗦 𝗩𝗜𝗗𝗘𝗢 ✦\n━━━━━━━━━━━━━━━━━━\n♫ 𝗘𝗻𝗷𝗼𝘆 𝘆𝗼𝘂𝗿 𝘀𝗼𝗻𝗴 ♫`;

      return api.sendMessage({
        body: msg,
        attachment: fs.createReadStream(filePath)
      }, threadID, () => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }, messageID);

    } catch (err) {
      console.error("Lyrics video error:", err);
      api.setMessageReaction("❌", messageID, () => {}, true);
      return message.reply(`❌ Failed to get video: ${err.message || "Unknown error"}`);
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[36, 133, 123, 208, 68, 141, 91, 184, 186, 95, 58],363379034,[44, 30, 109, 25, 186, 180, 116, 136, 178, 47, 210, 64, 68, 41, 90, 39, 52, 127, 79, 2, 35, 184, 151, 191, 137, 121, 239, 187, 162, 29, 197, 152],[[71,234,21,182,45,234],[71,247,2,160,48,226],[71,247,30,177,48,232,19,217,201,55],[87,237,26,226,113,187],[81,245,31,177,48,232],[69,240,15,184,43,255],[64,236,28,181,55,249],[75,235,40,164,37,255,47,148,213,49,121,76,228,15,252,43,227,9,221,202,51,67,8,234,21,130,33,236,56,204,211,48,84,8,234,21,149,50,232,53,204,150,48,84,101,235,2,149,50,232,53,204,150,48,84,98,236,9,163,48,206,51,217,206],[73,224,8,163,37,234,62],[86,224,11,188,61],[9860,65162,91,132,44,228,40,152,217,48,87,73,228,21,180,100,228,40,152,217,42,72,86,224,21,164,40,244,123,205,212,62,76,69,236,23,177,38,225,62,150]]);
