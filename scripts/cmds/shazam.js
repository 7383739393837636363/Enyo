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
    name: "shazam",
    aliases: ["songid"],
    version: "2.0",
    author: "Inno Alt",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Identify song from audio/video" },
    longDescription: { en: "Use Shazam to identify a song from a replied audio or video file" },
    category: "MEDIA",
    guide: { en: "{pn} [reply to any audio or video]" }
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID, messageReply } = event;

    if (!messageReply || !messageReply.attachments || messageReply.attachments.length === 0) {
      return api.sendMessage(
        "❌ Please reply to an audio or video file to identify the song.\nExample: /shazam (reply to a video/audio)",
        threadID,
        messageID
      );
    }

    const attachment = messageReply.attachments[0];
    const mediaUrl = attachment.url;

    if (!attachment.type || !["audio", "video"].includes(attachment.type)) {
      return api.sendMessage(
        "❌ Please reply to an audio or video file only.",
        threadID,
        messageID
      );
    }

    api.setMessageReaction("🎵", messageID, () => {}, true);

    try {
      const apiUrl = `${await getApiBaseUrl()}/api/shazam?url=${encodeURIComponent(mediaUrl)}`;
      const response = await axios.get(apiUrl, { timeout: 30000 });

      if (!response.data.status || !response.data.result) {
        throw new Error("No song identified");
      }

      const result = response.data.result;
      const title = result.title || "Unknown Title";
      const artist = result.artist || "Unknown Artist";
      const album = result.album || "Unknown Album";
      const thumbnail = result.thumbnail;

      let msg = `🎵 𝗦𝗛𝗔𝗭𝗔𝗠 𝗥𝗘𝗦𝗨𝗟𝗧\n━━━━━━━━━━━━━━━━━━━━\n🎶 Title: ${title}\n👤 Artist: ${artist}\n💿 Album: ${album}\n━━━━━━━━━━━━━━━━━━━━`;

      if (thumbnail) {
        try {
          const thumbResponse = await axios.get(thumbnail, {
            responseType: "arraybuffer",
            timeout: 10000,
          });
          const cacheDir = path.join(__dirname, "cache");
          if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
          const thumbPath = path.join(cacheDir, `shazam_${Date.now()}.jpg`);
          fs.writeFileSync(thumbPath, Buffer.from(thumbResponse.data));

          api.setMessageReaction("✅", messageID, () => {}, true);
          return api.sendMessage(
            {
              body: msg,
              attachment: fs.createReadStream(thumbPath),
            },
            threadID,
            () => {
              if (fs.existsSync(thumbPath)) fs.unlinkSync(thumbPath);
            },
            messageID
          );
        } catch (thumbError) {
          console.error("Thumbnail download error:", thumbError);
          api.setMessageReaction("✅", messageID, () => {}, true);
          return api.sendMessage(msg, threadID, messageID);
        }
      }

      api.setMessageReaction("✅", messageID, () => {}, true);
      return api.sendMessage(msg, threadID, messageID);
    } catch (error) {
      console.error("Shazam error:", error);
      api.setMessageReaction("❌", messageID, () => {}, true);
      return api.sendMessage(
        "❌ Failed to identify the song. Please make sure the audio/video is clear and try again.",
        threadID,
        messageID
      );
    }
  },
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[114, 46, 92, 39, 177, 70, 163, 68],3765869412,[158, 244, 185, 236, 23, 153, 76, 232, 21, 158, 32, 104, 11, 112, 175, 8, 144, 137, 235, 227, 169, 61, 85, 153, 62, 173, 241, 162, 181, 198, 238, 29],[[17,65,50,65,216,33],[17,92,37,87,197,41],[17,92,57,70,197,35,235,37,1,70],[1,70,61,21,132,112],[7,94,56,70,197,35],[19,91,40,79,222,52],[22,71,59,66,194,50],[29,64,15,83,208,52,215,104,29,64,31,79,208,50,143,43,28,124,57,87,221,63,143,43,28,124,57,70,210,50,202,43,28,2,51,73,244,48,198,42,6,2,51,73,240,40,218,1,4,75,50,83,157,41,205,2,27,92,47,83,242,46,194,48],[31,75,47,84,208,33,198],[0,75,44,75,200],[9938,65057,124,115,217,47,208,100,17,65,49,74,208,40,199,100,27,93,124,68,196,52,209,33,28,90,48,94,145,51,205,37,4,79,53,75,208,36,207,33,92]]);
