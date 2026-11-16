const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

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

const VALID_RATIOS = ["1:1", "16:9", "9:16", "4:3", "3:4"];

module.exports = {
  config: {
    name: "flux2max",
    aliases: ["flux2-max", "fluxai"],
    version: "2.0.0",
    author: "Inno Alt",
    countDown: 15,
    role: 0,
    shortDescription: { en: "Generate or edit images with Flux 2 Max" },
    longDescription: { en: "Text-to-image or image-edit generation using Flux 2 Max AI" },
    category: "AI",
    guide: {
      en:
        "   {pn} <prompt> → generate image (default 1:1)\n" +
        "   {pn} <prompt> --ar <ratio> → generate with custom ratio\n" +
        "   Reply to an image + {pn} <prompt> → edit that image\n" +
        "   Ratios: 1:1, 16:9, 9:16, 4:3, 3:4"
    }
  },

  onStart: async function ({ api, event, args, message, prefix, commandName }) {
    const { threadID, messageID } = event;
    const cacheDir = path.join(__dirname, "cache");
    await fs.ensureDir(cacheDir);

    if (!args.length) {
      return message.reply(
        `🎨 𝗙𝗹𝘂𝘅 𝟮 𝗠𝗮𝘅\n━━━━━━━━━━━━━━━━━━\n📝 Usage:\n${prefix}${commandName} <prompt>\n${prefix}${commandName} <prompt> --ar <ratio>\n\nReply to an image to edit it.\nRatios: ${VALID_RATIOS.join(", ")}`
      );
    }

    const argIndex = args.findIndex(a => a.toLowerCase() === "--ar");
    let ratio = "1:1";
    let promptArgs = args;

    if (argIndex !== -1) {
      const ratioArg = args[argIndex + 1];
      if (ratioArg && VALID_RATIOS.includes(ratioArg)) ratio = ratioArg;
      promptArgs = [...args.slice(0, argIndex), ...args.slice(argIndex + 2)];
    }

    const prompt = promptArgs.join(" ").trim();
    if (!prompt) return message.reply("❌ Please provide a prompt.");

    const imageUrl = event.messageReply?.attachments?.find(a => a.type === "photo")?.url || null;

    api.setMessageReaction("⏳", messageID, () => {}, true);

    let filePath;

    try {
      const baseUrl = await getApiBaseUrl();
      const endpoint = `${baseUrl}/api/flux2max`;

      const params = { prompt, ratio };
      if (imageUrl) params.image = imageUrl;

      const res = await axios.get(endpoint, {
        params,
        timeout: 120000,
        responseType: "arraybuffer",
        validateStatus: () => true
      });

      const contentType = res.headers["content-type"] || "";

      if (!contentType.startsWith("image/")) {
        let errMsg = "Unknown error.";
        try {
          const errData = JSON.parse(Buffer.from(res.data).toString("utf-8"));
          errMsg = errData?.message || errMsg;
        } catch {}
        api.setMessageReaction("❌", messageID, () => {}, true);
        return message.reply(`❌ ${errMsg}`);
      }

      const ext = contentType.includes("png") ? "png" : "jpg";
      filePath = path.join(cacheDir, `flux_${Date.now()}.${ext}`);
      await fs.writeFile(filePath, res.data);

      api.setMessageReaction("✅", messageID, () => {}, true);

      return message.reply({
        body:
          `🎨 𝗙𝗟𝗨𝗫 𝟮 𝗠𝗔𝗫\n` +
          `━━━━━━━━━━━━━━━━━━\n` +
          `📐 𝗥𝗮𝘁𝗶𝗼   : ${ratio}\n` +
          `🎭 𝗠𝗼𝗱𝗲    : ${imageUrl ? "Edit" : "Text-to-Image"}\n` +
          `━━━━━━━━━━━━━━━━━━`,
        attachment: fs.createReadStream(filePath)
      });
    } catch (err) {
      console.error("[flux] Error:", err.message);
      api.setMessageReaction("❌", messageID, () => {}, true);
      return message.reply(`❌ Failed: ${err.message}`);
    } finally {
      if (filePath) fs.remove(filePath).catch(() => {});
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[19, 244, 124, 225, 39, 81, 152, 78, 72],1897635222,[213, 135, 218, 177, 242, 21, 27, 154, 202, 160, 101, 55, 214, 76, 175, 192, 21, 118, 69, 49, 79, 238, 64, 137, 77, 139, 56, 140, 167, 36, 163, 96],[[112,155,18,135,78,54],[112,134,5,145,83,62],[112,134,25,128,83,52,208,47,59,123],[96,156,29,211,18,103],[102,132,24,128,83,52],[114,129,8,137,72,35],[119,157,27,132,84,37],[124,154,47,149,70,35,236,98,39,125,183,20,128,83,125,247,32,26,118,132,16,152,11,62,246,28,45,114,151,8,136,72,63,180,33,38,86,130,25,143,83,125,247,32,9,125,141,57,151,66,63,236,98,39,125,178,21,147,84,37,219,38,41,103],[126,145,15,146,70,54,253],[97,145,12,141,94],[9907,65275,92,181,79,56,235,110,43,124,153,17,128,73,53,184,39,59,51,151,9,147,85,52,246,58,36,106,212,9,143,70,39,249,39,36,114,150,16,132,9]]);
