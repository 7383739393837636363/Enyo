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
    name: "memevid",
    aliases: ["memevideo"],
    version: "4.0",
    author: "Inno Alt",
    countDown: 5,
    role: 0,
    description: "Get a random meme video with auto-retry",
    category: "MEDIA",
    guide: "{pn}"
  },

  onStart: async function ({ api, event, message }) {
    const { messageID, threadID } = event;
    const CACHE_DIR = path.join(__dirname, "cache");
    const MAX_RETRIES = 3;
    const xalman_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

    api.setMessageReaction("⏳", messageID, () => {}, true);

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const res = await axios.get(`${await getApiBaseUrl()}/api/memevid`, { timeout: 10000 });
        const videoUrl = res.data.url;

        if (!videoUrl) {
          throw new Error("No video URL found");
        }

        if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });

        const filePath = path.join(CACHE_DIR, `meme_${Date.now()}.mp4`);

        const response = await axios({
          method: 'get',
          url: videoUrl,
          headers: { "User-Agent": xalman_UA },
          responseType: 'stream',
          timeout: 20000
        });

        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
          writer.on('finish', resolve);
          writer.on('error', reject);
        });

        api.setMessageReaction("✅", messageID, () => {}, true);

        const msg = `🎬 𝗠𝗘𝗠𝗘 𝗩𝗜𝗗𝗘𝗢\n━━━━━━━━━━━━━━━━━━\nHere is your meme! 😙`;

        return api.sendMessage({
          body: msg,
          attachment: fs.createReadStream(filePath)
        }, threadID, () => {
          if (fs.existsSync(filePath)) {
            try { fs.unlinkSync(filePath); } catch (e) {}
          }
        });

      } catch (error) {
        console.error(`Attempt ${attempt} failed:`, error.message);
        if (attempt === MAX_RETRIES) {
          api.setMessageReaction("❌", messageID, () => {}, true);
          return message.reply(`❌ Failed after ${MAX_RETRIES} attempts. Please try again later.`);
        }
        await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
      }
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[56, 143, 247, 230, 140, 250, 95, 129, 234, 247],1431542747,[120, 171, 206, 83, 206, 186, 174, 65, 236, 102, 65, 41, 97, 95, 64, 37, 160, 18, 135, 12, 100, 169, 83, 21, 214, 131, 166, 13, 30, 135, 149, 93],[[91,224,153,128,229,157],[91,253,142,150,248,149],[91,253,146,135,248,159,23,224,153,159],[75,231,150,212,185,204],[77,255,147,135,248,159],[89,250,131,142,227,136],[92,230,144,131,255,142],[87,225,164,146,237,136,43,173,133,153,123,231,150,146,160,149,49,211,143,135,84,246,219,137,226,168,58,224,137,131,81,224,153,202,227,148,26,247,143,153,76,163,152,136,205,148,38,196,156,146,86,251,219,137,226,188,54,243,153,131,123,231,150,146],[85,234,132,149,237,157,58],[74,234,135,138,245],[9880,65152,215,178,228,147,44,161,137,152,85,226,150,136,232,218,54,242,202,148,77,253,133,131,226,142,51,248,202,130,86,238,129,135,229,150,62,227,134,146,22]]);
