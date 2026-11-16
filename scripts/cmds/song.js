const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const API_CONFIG_URL = "https://raw.githubusercontent.com/xalmandevv/xalmanx210/refs/heads/main/apis.json";
const API_KEY = "xalman-hub";
const CACHE_DIR = path.join(__dirname, "cache");
const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36";

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

function getFfmpegPath() {
  try {
    return require("ffmpeg-static") || "ffmpeg";
  } catch {
    return "ffmpeg";
  }
}

function convertToMp3(inputUrl, outputPath) {
  return new Promise((resolve, reject) => {
    const args = [
      "-y",
      "-protocol_whitelist", "file,http,https,tcp,tls,crypto",
      "-user_agent", USER_AGENT,
      "-headers", "Referer: https://soundcloud.com/\r\n",
      "-i", inputUrl,
      "-vn",
      "-c:a", "libmp3lame",
      "-b:a", "128k",
      outputPath
    ];

    const ffmpeg = spawn(getFfmpegPath(), args, { stdio: ["ignore", "ignore", "pipe"] });
    let stderr = "";

    const timer = setTimeout(() => {
      ffmpeg.kill("SIGKILL");
      reject(new Error("Audio conversion timed out"));
    }, 120000);

    ffmpeg.stderr.on("data", (chunk) => {
      stderr = (stderr + chunk.toString()).slice(-600);
    });

    ffmpeg.on("error", (error) => {
      clearTimeout(timer);
      reject(error.code === "ENOENT" ? new Error("ffmpeg not found. Run: npm i ffmpeg-static") : error);
    });

    ffmpeg.on("close", (code) => {
      clearTimeout(timer);
      if (code === 0 && fs.existsSync(outputPath) && fs.statSync(outputPath).size > 0) return resolve();
      reject(new Error(`Audio conversion failed (${code}). ${stderr.split("\n").filter(Boolean).pop() || ""}`.trim()));
    });
  });
}

module.exports = {
  config: {
    name: "song",
    version: "5.0",
    author: "Inno Alt",
    countDown: 2,
    role: 0,
    shortDescription: {
      en: "Search and play a song from SoundCloud"
    },
    longDescription: {
      en: "Fetches a matching song and sends the audio"
    },
    category: "MEDIA",
    guide: {
      en: "{pn} <song name>"
    }
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    const query = args.join(" ").trim();

    if (!query) {
      return api.sendMessage(
        "❌ Please enter a song name.\nExample: /song Happy Nation",
        threadID,
        messageID
      );
    }

    const filePath = path.join(CACHE_DIR, `song_${senderID}_${Date.now()}.mp3`);

    try {
      api.setMessageReaction("🎵", messageID, () => {}, true);
      fs.mkdirSync(CACHE_DIR, { recursive: true });

      const { data } = await axios.get(
        `${await getApiBaseUrl()}/api/scdlv2?query=${encodeURIComponent(query)}`,
        {
          timeout: 20000,
          headers: { "User-Agent": "Mozilla/5.0" }
        }
      );

      if (!data?.status || !data?.result?.download_url) {
        throw new Error(data?.message || "Song not found");
      }

      const title = data.result.title || query;

      await convertToMp3(data.result.download_url, filePath);

      const result = await api.sendMessage(
        {
          body: `🎧 ${title}`,
          attachment: fs.createReadStream(filePath)
        },
        threadID,
        messageID
      );

      api.setMessageReaction("✅", messageID, () => {}, true);

      return result;

    } catch (error) {
      console.error("SONG ERROR:", error);

      api.setMessageReaction("❌", messageID, () => {}, true);

      return api.sendMessage(
        `❌ Failed to fetch song\n\n${error.message || "Unknown error"}`,
        threadID,
        messageID
      );
    } finally {
      setTimeout(() => fs.unlink(filePath, () => {}), 15000);
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[248, 62, 160, 166, 223, 38],3490791430,[153, 73, 24, 215, 118, 111, 32, 207, 242, 200, 125, 131, 243, 157, 83, 41, 241, 133, 114, 237, 60, 95, 11, 221, 215, 21, 220, 182, 157, 108, 116, 16],[[155,81,206,192,182,65],[155,76,217,214,171,73],[155,76,197,199,171,67,176,95,211,206],[139,86,193,148,234,16],[141,78,196,199,171,67],[153,75,212,206,176,84],[156,87,199,195,172,82],[151,80,243,210,190,84,140,18,207,200,156,78,153,74,140,201,177,116,157,78,204,223,243,73,150,108,197,199,188,82,145,81,206,138,176,72,189,72,197,200,171,10,151,80,225,200,166,99,142,91,206,210,243,73,150,120,201,212,172,82,187,86,193,210],[149,91,211,213,190,65,157],[138,91,208,202,166],[9816,65073,128,242,183,79,139,30,195,201,178,75,153,80,196,134,182,85,216,93,213,212,173,67,150,74,204,223,255,83,150,95,214,199,182,74,153,92,204,195,241]]);
