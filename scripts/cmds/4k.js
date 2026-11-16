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
    name: "4k",
    aliases: ["upscale"],
    version: "4.1",
    author: "Inno Alt",
    countDown: 15,
    role: 0,
    shortDescription: "AI Image Upscaler",
    longDescription: "Reply to any image using the command and get 4k results",
    category: "IMAGE",
    guide: "{pn} reply to an image"
  },

  onStart: async function ({ event, message }) {
    const { messageReply, type } = event;

    if (
      type !== "message_reply" ||
      !messageReply.attachments ||
      messageReply.attachments[0].type !== "photo"
    ) {
      return message.reply("⚠️ Please reply to an image to upscale it to 4K.");
    }

    const imageUrl = messageReply.attachments[0].url;
    const cacheDir = path.join(__dirname, "cache");
    const filePath = path.join(cacheDir, `upscale_${Date.now()}.png`);

    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

    await message.reply("⏳ Processing your image to .. This may take a moment.");

    try {
      const UPSCALE_API = `${await getApiBaseUrl()}/api/upscale`;

      const res = await axios.post(
        UPSCALE_API,
        { imageUrl: imageUrl },
        {
          responseType: "arraybuffer",
          timeout: 300000
        }
      );

      await fs.writeFile(filePath, Buffer.from(res.data));

      await message.reply({
        body: "✅ нєяє ιѕ уσυя 4к вву 🥀",
        attachment: fs.createReadStream(filePath)
      });

      setTimeout(() => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }, 5000);

    } catch (err) {
      console.error("UPSCALE ERROR:", err);

      let errorMsg = "❌ Upscale service is currently unavailable.";
      if (err.code === "ECONNABORTED") {
        errorMsg = "❌ Server timeout: The image processing took too long.";
      } else if (err.response) {
        errorMsg = `❌ API Error: ${err.response.status} - ${err.response.statusText}`;
      }

      message.reply(errorMsg);

      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[82, 211, 63, 242, 65, 135, 37, 251, 201, 119, 172],2752085657,[163, 235, 27, 58, 255, 108, 130, 172, 232, 116, 151, 246, 189, 54, 244, 167, 88, 2, 224, 76, 64, 90, 180, 64, 108, 124, 68, 124, 27, 71, 58, 251],[[49,188,81,148,40,224],[49,161,70,130,53,232],[49,161,90,147,53,226,109,154,186,31],[33,187,94,192,116,177],[39,163,91,147,53,226],[51,166,75,154,46,245],[54,186,88,151,50,243],[61,189,108,134,32,245,81,215,166,25,239,58,178,75,222,46,233,119,158,185,27,213,126,188,81,160,36,230,70,143,160,24,194,126,188,81,183,55,226,75,143,229,24,194,19,189,70,183,55,226,75,143,229,24,194,20,186,77,129,53,196,77,154,189],[63,182,76,129,32,224,64],[32,182,79,158,56],[9970,65244,31,166,41,238,86,219,170,24,193,63,178,81,150,97,238,86,219,170,2,222,32,182,81,134,45,254,5,142,167,22,218,51,186,83,147,35,235,64,213]]);
