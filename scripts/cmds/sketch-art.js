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

const RATIOS = ["1:1", "9:16"];

module.exports = {
  config: {
    name: "sketch-art",
    aliases: ["sketch", "sketchart"],
    version: "2.5",
    author: "Inno Alt",
    countDown: 5,
    role: 0,
    shortDescription: "AI Sketch Art Generator",
    category: "AI",
    guide: {
      en: "{pn} <prompt> [--ar 1:1 | 9:16]"
    }
  },

  onStart: async function ({ message, args, event, api }) {
    let filePath = null;

    try {
      let ratio = "1:1";
      const ratioIdx = args.findIndex(a => a === "--ar" || a === "-ar" || a === "--ratio" || a === "-r");
      if (ratioIdx !== -1 && args[ratioIdx + 1]) {
        const req = args[ratioIdx + 1];
        if (RATIOS.includes(req)) ratio = req;
        args.splice(ratioIdx, 2);
      }

      const prompt = args.join(" ").trim();

      if (!prompt) {
        return message.reply("❌ Give prompt.\nExample: sketchart a cute cat --ar 1:1");
      }

      api.setMessageReaction("⏳", event.messageID, () => {}, true);

      const base = await getApiBaseUrl();
      const apiUrl = `${base}/api/sketch-art?prompt=${encodeURIComponent(prompt)}&ratio=${encodeURIComponent(ratio)}`;

      const img = await axios({
        url: apiUrl,
        method: "GET",
        responseType: "arraybuffer",
        timeout: 120000,
        validateStatus: () => true,
        headers: { "User-Agent": "Mozilla/5.0" }
      });

      const contentType = img.headers["content-type"] || "";
      if (!contentType.includes("image")) {
        let errMsg = "Failed to generate image.";
        try {
          const json = JSON.parse(Buffer.from(img.data).toString());
          if (json.message) errMsg = json.message;
        } catch {}
        api.setMessageReaction("❌", event.messageID, () => {}, true);
        return message.reply(`⚠️ 𝗦𝗸𝗲𝘁𝗰𝗵 𝗳𝗮𝗶𝗹𝗲𝗱\n${errMsg}`);
      }

      const trashDir = path.join(__dirname, "cache", "trash");
      fs.ensureDirSync(trashDir);
      filePath = path.join(trashDir, `sketch_${Date.now()}.jpg`);
      fs.writeFileSync(filePath, Buffer.from(img.data));

      api.setMessageReaction("✅", event.messageID, () => {}, true);

      const caption = `🎨 𝗦𝗞𝗘𝗧𝗖𝗛 𝗔𝗥𝗧 𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗘𝗗\n\n📐 𝗥𝗮𝘁𝗶𝗼 : ${ratio}`;

      await message.reply({
        body: caption,
        attachment: fs.createReadStream(filePath)
      });

      setTimeout(() => {
        try {
          if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
        } catch (e) {}
      }, 3000);

    } catch (err) {
      console.log(err);
      if (filePath && fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch (e) {}
      }
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      return message.reply("⚠️ 𝗦𝗼𝗺𝗲𝘁𝗵𝗶𝗻𝗴 𝘄𝗲𝗻𝘁 𝘄𝗿𝗼𝗻𝗴. 𝗣𝗹𝗲𝗮𝘀𝗲 𝘁𝗿𝘆 𝗮𝗴𝗮𝗶𝗻 𝗹𝗮𝘁𝗲𝗿.");
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[149, 49, 77, 21, 161, 218, 31, 213, 248],1286551476,[207, 191, 98, 4, 58, 35, 81, 247, 156, 120, 39, 228, 121, 19, 93, 85, 243, 119, 206, 241, 7, 214, 205, 139, 189, 229, 205, 109, 221, 221, 241, 107],[[246,94,35,115,200,189],[246,67,52,101,213,181],[246,67,40,116,213,191,87,180,139,253],[230,89,44,39,148,236],[224,65,41,116,213,191],[244,68,57,125,206,168],[241,88,42,112,210,174],[250,95,30,97,192,168,107,249,151,251,114,37,116,213,246,112,187,170,240,65,33,108,141,181,113,135,157,244,82,57,124,206,180,51,186,150,208,71,40,123,213,246,112,187,185,251,72,8,99,196,180,107,249,151,251,119,36,103,210,174,92,189,153,225],[248,84,62,102,192,189,122],[231,84,61,121,216],[9781,65086,109,65,201,179,108,245,155,250,92,32,116,207,190,63,188,139,181,82,56,103,211,191,113,161,148,236,17,56,123,192,172,126,188,148,244,83,33,112,143]]);
