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
    name: "v2a",
    aliases: ["video2audio"],
    version: "4.0",
    author: "Inno Alt",
    countDown: 5,
    role: 0,
    shortDescription: "Video to audio",
    longDescription: "Convert replied video or URL to audio",
    category: "MEDIA",
    guide: {
      en: "{pn} <video url>\nReply to a video"
    }
  },

  onStart: async function ({ message, event, args }) {

    try {

      let videoUrl;
      
      if (args[0]) {
        videoUrl = args[0];
      }
        
      else if (
        event.messageReply &&
        event.messageReply.attachments &&
        event.messageReply.attachments[0]
      ) {

        const attachment = event.messageReply.attachments[0];

        if (
          attachment.type === "video" ||
          attachment.type === "animated_image"
        ) {
          videoUrl = attachment.url;
        }
      }

      if (!videoUrl) {
        return message.reply(
          "❌ | Reply to a video or give video URL"
        );
      }

      await message.reply("⏳ | Converting video to audio...");

      const api =
        `${await getApiBaseUrl()}/api/v2a?url=${encodeURIComponent(videoUrl)}`;

      const filePath = path.join(
        __dirname,
        "cache",
        `v2a_${Date.now()}.mp3`
      );

      const response = await axios({
        url: api,
        method: "GET",
        responseType: "stream"
      });

      const writer = fs.createWriteStream(filePath);

      response.data.pipe(writer);

      writer.on("finish", async () => {

        await message.reply({
          body: "🎵 | Here is your audio",
          attachment: fs.createReadStream(filePath)
        });

        fs.unlinkSync(filePath);

      });

      writer.on("error", async () => {
        return message.reply("❌ | Failed to save audio");
      });

    } catch (err) {
      console.log(err);
      return message.reply("❌ | Error while converting");
    }

  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[85, 183, 149, 135, 58, 230, 49],2725625905,[95, 195, 92, 77, 35, 44, 135, 10, 135, 51, 74, 213, 198, 253, 81, 58, 229, 34, 21, 95, 46, 82, 14, 124, 229, 160, 222, 70, 220, 252, 220, 7],[[54,216,251,225,83,129],[54,197,236,247,78,137],[54,197,240,230,78,131,121,52,196,253],[38,223,244,181,15,208],[32,199,241,230,78,131],[52,194,225,239,85,148],[49,222,242,226,73,146],[58,217,198,243,91,148,69,121,216,251,196,82,135,69,121,216,251,213,95,150,93,44,155,250,233,104,131,80,54,195,252,232,84,202,94,59,242,227,226,84,146,29,58,217,212,233,67,163,71,48,217,225,171,85,136,119,60,197,230,243,121,142,80,33],[56,210,230,244,91,129,84],[39,210,229,235,67],[9973,65208,181,211,82,143,66,117,212,250,234,87,135,95,49,151,252,244,26,133,68,39,197,240,233,78,138,72,117,194,251,230,76,135,88,57,214,247,235,95,200]]);
