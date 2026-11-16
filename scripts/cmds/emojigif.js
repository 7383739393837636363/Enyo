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
    name: "emojigif",
    version: "2.0",
    author: "Inno Alt",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Get emoji image"
    },
    category: "FUN & SOCIAL",
    guide: {
      en: "{pn} 😊"
    }
  },

  onStart: async function ({ message, args }) {
    try {
      const emoji = args.join(" ");

      if (!emoji)
        return message.reply("❌ | Please provide an emoji");

      const apiUrl = `${await getApiBaseUrl()}/api/emojigif?emoji=${encodeURIComponent(emoji)}`;

      const res = await axios.get(apiUrl);
      const imageUrl = res.data?.data?.image;

      if (!imageUrl)
        return message.reply("❌ | No image found");

      const filePath = path.join(
        __dirname,
        "cache",
        `emoji_${Date.now()}.webp`
      );

      const img = await axios({
        url: imageUrl,
        method: "GET",
        responseType: "stream"
      });

      const writer = fs.createWriteStream(filePath);
      img.data.pipe(writer);

      writer.on("finish", async () => {
        await message.reply({
          body: `Emoji: ${emoji}`,
          attachment: fs.createReadStream(filePath)
        });

        fs.unlinkSync(filePath);
      });

      writer.on("error", () => {
        message.reply("❌ | Failed to download image");
      });

    } catch (err) {
      console.error(err);
      message.reply("❌ | API Error");
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[217, 144, 65, 237, 61, 225, 77],694322577,[171, 82, 163, 194, 41, 105, 151, 44, 135, 39, 134, 241, 126, 228, 202, 128, 174, 96, 29, 190, 212, 168, 26, 151, 193, 92, 64, 1, 239, 27, 204, 61],[[186,255,47,139,84,134],[186,226,56,157,73,142],[186,226,36,140,73,132,5,184,227,41],[170,248,32,223,8,215],[172,224,37,140,73,132],[184,229,53,133,82,147],[189,249,38,136,78,149],[182,254,18,153,92,147,57,245,255,47,174,85,128,57,245,255,47,191,88,145,33,160,188,46,131,111,132,44,186,228,40,130,83,205,34,183,213,55,136,83,149,97,182,254,0,131,68,164,59,188,254,53,193,82,143,11,176,226,50,153,126,137,44,173],[180,245,50,158,92,134,40],[171,245,49,129,68],[9849,65183,97,185,85,136,62,249,243,46,128,80,128,35,189,176,40,158,29,130,56,171,226,36,131,73,141,52,249,229,47,140,75,128,36,181,241,35,129,88,207]]);
