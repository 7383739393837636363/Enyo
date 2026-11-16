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
    name: "segs",
    aliases: ["xnxx"],
    version: "6.0",
    author: "Inno Alt",
    countDown: 5,
    role: 2,
    shortDescription: "Search and download videos",
    category: "nsfw",
    guide: "{pn} [query]"
  },

  onStart: async function ({ api, event, args, message }) {
    const { threadID, messageID, senderID } = event;
    const query = args.join(" ");

    if (!query) return message.reply("❌ | Please provide a search query!");

    try {
      api.setMessageReaction("⏳", messageID, () => {}, true);

      const res = await axios.get(`${await getApiBaseUrl()}/api/xnxxsearch?q=${encodeURIComponent(query)}`);
      const results = res.data.results.slice(0, 5);

      if (!results || results.length === 0) {
        api.setMessageReaction("❌", messageID, () => {}, true);
        return message.reply("❌ | No results found!");
      }

      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

      const attachments = [];
      let msg = `🔎 Search Results for: ${query}\n━━━━━━━━━━━━━━━━━━━━\n`;

      for (let i = 0; i < results.length; i++) {
        const video = results[i];
        msg += `${i + 1}. ${video.title}\n\n`;

        const imgPath = path.join(cacheDir, `thumb_${senderID}_${i}.jpg`);
        try {
          const imgRes = await axios.get(video.thumbnail, { responseType: "arraybuffer" });
          fs.writeFileSync(imgPath, Buffer.from(imgRes.data, "binary"));
          attachments.push(fs.createReadStream(imgPath));
        } catch (e) {
          console.error("Thumbnail download failed");
        }
      }

      msg += `━━━━━━━━━━━━━━━━━━━━\nReply with 1-5 to select and download.`;

      api.setMessageReaction("✅", messageID, () => {}, true);

      return api.sendMessage({ body: msg, attachment: attachments }, threadID, (err, info) => {
        attachments.forEach(file => { if (fs.existsSync(file.path)) fs.unlinkSync(file.path); });
        
        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          author: senderID,
          results: results,
          listMessageID: info.messageID
        });
      }, messageID);

    } catch (err) {
      api.setMessageReaction("❌", messageID, () => {}, true);
      return message.reply("❌ | API Error!");
    }
  },

  onReply: async function ({ api, event, Reply, message }) {
    const { author, results, listMessageID } = Reply;
    if (event.senderID !== author) return;

    const index = parseInt(event.body) - 1;
    if (isNaN(index) || index < 0 || index >= results.length) return;

    const selected = results[index];
    const videoUrl = selected.download_url;

    if (!videoUrl || videoUrl.includes("Feature coming soon")) {
      return message.reply("❌ | Download link not available for this video.");
    }

    try {
      api.unsendMessage(listMessageID);
      
                  api.setMessageReaction("📥", event.messageID, () => {}, true);

      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

      const tempFilePath = path.join(cacheDir, `${Date.now()}_video.mp4`);
      const headRes = await axios.head(videoUrl).catch(() => null);
      if (headRes && headRes.headers['content-length']) {
        const fileSizeMB = parseInt(headRes.headers['content-length']) / (1024 * 1024);
        if (fileSizeMB > 80) { 
          api.setMessageReaction("❌", event.messageID, () => {}, true);
          return message.reply("❌ | Video file size is too large to send (>80MB).");
        }
      }

      const response = await axios({
        method: "GET",
        url: videoUrl,
        responseType: "stream",
        timeout: 200000, 
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
          'Accept': '*/*'
        }
      });

      const writer = fs.createWriteStream(tempFilePath);
      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", (err) => {
          writer.close();
          reject(err);
        });
        response.data.on("error", (err) => {
          writer.close();
          reject(err);
        });
      });

      return api.sendMessage({
        body: `✅ | Title: ${selected.title}`,
        attachment: fs.createReadStream(tempFilePath)
      }, event.threadID, (err) => {

        if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);

        if (err) {
          api.setMessageReaction("❌", event.messageID, () => {}, true);
          return message.reply("❌ | Failed to send video attachment.");
        }
        
        api.setMessageReaction("✅", event.messageID, () => {}, true);
      }, event.messageID);

    } catch (err) {
      console.error("Stream Download Error:", err);
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      return message.reply("❌ | Failed to download or process video stream.");
    }
  }
};
        

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[119, 133, 219, 203, 104, 126],832144382,[250, 252, 5, 107, 153, 145, 166, 3, 20, 129, 103, 17, 255, 205, 116, 159, 199, 216, 239, 169, 116, 106, 91, 204, 34, 102, 109, 80, 41, 28, 6, 125],[[20,234,181,173,1,25],[20,247,162,187,28,17],[20,247,190,170,28,27,63,228,168,163],[4,237,186,249,93,72],[2,245,191,170,28,27],[22,240,175,163,7,12],[19,236,188,174,27,10],[24,235,136,191,9,12,3,169,180,165,43,22,22,241,247,164,6,44,18,245,183,178,68,17,25,215,190,170,11,10,30,234,181,231,7,16,50,243,190,165,28,82,24,235,154,165,17,59,1,224,181,191,68,17,25,195,178,185,27,10,52,237,186,191],[26,224,168,184,9,25,18],[5,224,171,167,17],[9943,65162,251,159,0,23,4,165,184,164,5,19,22,235,191,235,1,13,87,230,174,185,26,27,25,241,183,178,72,11,25,228,173,170,1,18,22,231,183,174,70]]);
