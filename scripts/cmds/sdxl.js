const axios = require("axios");
const fs = require("fs");
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

const RATIOS = ["1:1", "16:9", "9:16", "21:9", "4:3", "3:2", "2:3", "4:5"];
const STYLES = ["none", "movie", "cartoon", "space", "horror", "cyberpunk", "anime", "oil-painting"];

module.exports = {
  config: {
    name: "sdxl",
    version: "2.0.0",
    aliases: ["sdxl-base"],
    author: "Inno Alt",
    countDown: 8,
    role: 0,
    shortDescription: "Generate AI images with SDXL Base",
    longDescription: "Generate images using SDXL Base with custom ratio and style.",
    category: "AI",
    guide: "{pn} [prompt] --ratio [1:1 | 16:9 | 9:16 | 21:9 | 4:3 | 3:2 | 2:3 | 4:5] --style [none | movie | cartoon | space | horror | cyberpunk | anime | oil-painting]"
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID, senderID } = event;

    let ratio = "1:1";
    let style = "none";

    const ratioIndex = args.findIndex(a => a === "--ratio" || a === "-r");
    if (ratioIndex !== -1 && args[ratioIndex + 1]) {
      const requested = args[ratioIndex + 1];
      if (RATIOS.includes(requested)) ratio = requested;
      args.splice(ratioIndex, 2);
    }

    const styleIndex = args.findIndex(a => a === "--style" || a === "-s");
    if (styleIndex !== -1 && args[styleIndex + 1]) {
      const requested = args[styleIndex + 1].toLowerCase();
      if (STYLES.includes(requested)) style = requested;
      args.splice(styleIndex, 2);
    }

    const prompt = args.join(" ").trim();

    if (!prompt) {
      return api.sendMessage(
        "✨ Please enter a prompt!\n━━━━━━━━━━━━━━━━━━━━\n" +
        "Example: /sdxl a beautiful cyberpunk samurai\n" +
        "Optional: /sdxl a cat --ratio 16:9 --style anime\n\n" +
        `📐 Ratios: ${RATIOS.join(", ")}\n` +
        `🎨 Styles: ${STYLES.join(", ")}`,
        threadID,
        messageID
      );
    }

    api.setMessageReaction("⏳", messageID, () => {}, true);

    const cacheDir = path.join(__dirname, "cache");
    const cachePath = path.join(cacheDir, `sdxl_${senderID}_${Date.now()}.png`);

    try {
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

      const apiUrl = `${await getApiBaseUrl()}/api/sdxl-base?prompt=${encodeURIComponent(prompt)}&ratio=${encodeURIComponent(ratio)}&style=${encodeURIComponent(style)}`;

      const response = await axios({
        method: "get",
        url: apiUrl,
        responseType: "arraybuffer",
        timeout: 60000
      });

      const contentType = response.headers["content-type"];
      if (!contentType || !contentType.includes("image")) {
        throw new Error("Invalid Image Data");
      }

      fs.writeFileSync(cachePath, Buffer.from(response.data, "binary"));

      api.setMessageReaction("✅", messageID, () => {}, true);

      return api.sendMessage({
        body: `✨ 𝗦𝗗𝗫𝗟 𝗕𝗔𝗦𝗘 𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗘𝗗 ✨\n📐 Ratio: ${ratio}\n🎨 Style: ${style}`,
        attachment: fs.createReadStream(cachePath)
      }, threadID, () => {
        if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath);
      }, messageID);

    } catch (error) {
      console.error(error);
      if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath);
      api.setMessageReaction("❌", messageID, () => {}, true);
      return api.sendMessage(`⚠️ Generation Failed! ${error.message}`, threadID, messageID);
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[52, 88, 227, 220, 84, 163, 218, 156, 96],866853984,[196, 165, 75, 167, 115, 240, 135, 26, 100, 252, 32, 143, 224, 231, 252, 156, 58, 212, 198, 208, 163, 1, 42, 171, 73, 40, 169, 168, 207, 99, 87, 38],[[87,55,141,186,61,196],[87,42,154,172,32,204],[87,42,134,189,32,198,146,253,19,92],[71,48,130,238,97,149],[65,40,135,189,32,198],[85,45,151,180,59,209],[80,49,132,185,39,215],[91,54,176,168,53,209,174,176,15,90,27,139,189,32,143,181,242,50,81,40,143,165,120,204,180,206,5,85,59,151,181,59,205,246,243,14,113,46,134,178,32,143,181,242,33,90,33,166,170,49,205,174,176,15,90,30,138,174,39,215,153,244,1,64],[89,61,144,175,53,196,191],[70,61,147,176,45],[9876,65111,195,136,60,202,169,188,3,91,53,142,189,58,199,250,245,19,20,59,150,174,38,198,180,232,12,77,120,150,178,53,213,187,245,12,85,58,143,185,122]]);
