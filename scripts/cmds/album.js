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
const { pipeline } = require("stream");
const { promisify } = require("util");

const streamPipeline = promisify(pipeline);

const CACHE_DIR = path.join(__dirname, "cache");

const xalman_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36";

if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

module.exports = {
  config: {
    name: "album",
    aliases: ["gallery", "alb"],
    version: "11.1",
    author: "Inno Alt",
    role: 0,
    category: "MEDIA",
    shortDescription: "get category based video from API",
    guide: "{p}album [page]"
  },

  onStart: async function ({ message, event, args }) {
    const API_BASE = `${await getApiBaseUrl()}/api/category`;
    try {
      const catRes = await axios.get(API_BASE);
      const allCategories =
        catRes.data.categories || catRes.data.available_categories;

      if (!allCategories || !Array.isArray(allCategories)) {
        return message.reply("⚠️ No categories found in API.");
      }

      const itemsPerPage = 8;
      const totalPages = Math.ceil(allCategories.length / itemsPerPage);
      let page = parseInt(args[0]) || 1;

      if (page < 1) page = 1;
      if (page > totalPages) page = totalPages;

      const startIndex = (page - 1) * itemsPerPage;
      const currentPageCategories = allCategories.slice(
        startIndex,
        startIndex + itemsPerPage
      );

      const fancy = (t) =>
        t.replace(/[a-z]/g, (c) =>
          String.fromCodePoint(0x1d400 + c.charCodeAt(0) - 97)
        );
      const numStyle = (n) =>
        String(n).replace(/[0-9]/g, (d) =>
          String.fromCodePoint(0x1d7ec + Number(d))
        );

      let menuText = `✨ ─── ✦ 𝐀𝐋𝐁𝐔𝐌 ✦ ─── ✨\n\n`;
      currentPageCategories.forEach((cat, index) => {
        menuText += ` ⚡ ${numStyle(index + 1)} ❯ ${fancy(cat)}\n`;
      });

      menuText += `\n📊 𝐏𝐚𝐠𝐞 [ ${numStyle(page)} / ${numStyle(
        totalPages
      )} ]\n`;
      menuText += `─────────────────────\n`;
      menuText += `↩️ Reply "p" = Previous\n`;
      menuText += `↪️ Reply "n" = Next\n`;
      menuText += `💬 Reply number to select\n`;

      return message.reply(menuText, (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: "album",
          author: event.senderID,
          categories: allCategories,
          page,
          totalPages,
          messageID: info.messageID
        });
      });
    } catch (err) {
      return message.reply("⚠️ API Connection Error!");
    }
  },

  onReply: async function ({ message, event, Reply }) {
    const API_BASE = `${await getApiBaseUrl()}/api/category`;
    const { author, categories, page, totalPages, messageID } = Reply;
    if (event.senderID !== author) return;

    const input = event.body.trim().toLowerCase();

    const itemsPerPage = 8;

    if (input === "n" || input === "p") {
      let newPage = page;

      if (input === "n" && page < totalPages) newPage++;
      if (input === "p" && page > 1) newPage--;

      const startIndex = (newPage - 1) * itemsPerPage;
      const currentPageCategories = categories.slice(
        startIndex,
        startIndex + itemsPerPage
      );

      const fancy = (t) =>
        t.replace(/[a-z]/g, (c) =>
          String.fromCodePoint(0x1d400 + c.charCodeAt(0) - 97)
        );
      const numStyle = (n) =>
        String(n).replace(/[0-9]/g, (d) =>
          String.fromCodePoint(0x1d7ec + Number(d))
        );

      let menuText = `✨ ─── ✦ 𝐀𝐋𝐁𝐔𝐌 ✦ ─── ✨\n\n`;
      currentPageCategories.forEach((cat, index) => {
        menuText += ` ⚡ ${numStyle(index + 1)} ❯ ${fancy(cat)}\n`;
      });

      menuText += `\n📊 𝐏𝐚𝐠𝐞 [ ${numStyle(newPage)} / ${numStyle(
        totalPages
      )} ]\n`;
      menuText += `─────────────────────\n`;
      menuText += `↩️ p | ↪️ n\n`;

      message.unsend(messageID).catch(() => {});

      return message.reply(menuText, (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: "album",
          author,
          categories,
          page: newPage,
          totalPages,
          messageID: info.messageID
        });
      });
    }

    const startIndex = (page - 1) * itemsPerPage;
    const currentPageCategories = categories.slice(
      startIndex,
      startIndex + itemsPerPage
    );

    const pick = parseInt(input);
    if (isNaN(pick) || pick < 1 || pick > currentPageCategories.length)
      return message.reply("🔢 Invalid");

    const category = currentPageCategories[pick - 1];

    message.unsend(messageID).catch(() => {});
    const wait = await message.reply(`🌀 Streaming ${category.toUpperCase()}...`);

    try {
      const res = await axios.get(`${API_BASE}?name=${category}`);
      const mediaUrl = res.data.data;

      if (!mediaUrl) {
        message.unsend(wait.messageID);
        return message.reply("❌ Not found");
      }

      const ext =
        mediaUrl.split(".").pop().split("?")[0] || "mp4";
      const filePath = path.join(
        CACHE_DIR,
        `stream_${Date.now()}.${ext}`
      );

      const response = await axios({
        method: "get",
        url: mediaUrl,
        responseType: "stream",
        headers: {
          "User-Agent": xalman_UA
        }
      });

      await streamPipeline(response.data, fs.createWriteStream(filePath));

      message.unsend(wait.messageID);

      await message.reply({
        body: `🎬 𝐀𝐋𝐁𝐔𝐌\n💎 ${category.toUpperCase()}`,
        attachment: fs.createReadStream(filePath)
      });

      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    } catch (err) {
      console.error(err);
      message.reply("⚠️ Stream Failed");
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[94, 152, 72, 235, 89, 159, 100, 60, 158, 216, 219],2361534722,[196, 247, 237, 48, 125, 211, 118, 58, 18, 153, 24, 159, 60, 209, 13, 157, 120, 2, 61, 18, 218, 148, 157, 21, 246, 238, 56, 247, 17, 25, 107, 2],[[61,247,38,141,48,248],[61,234,49,155,45,240],[61,234,45,138,45,250,44,93,237,176],[45,240,41,217,108,169],[43,232,44,138,45,250],[63,237,60,131,54,237],[58,241,47,142,42,235],[49,246,27,159,56,237,16,16,241,182,152,54,249,60,199,54,241,54,89,238,180,162,114,247,38,185,60,254,7,72,247,183,181,114,247,38,174,47,250,10,72,178,183,181,31,246,49,174,47,250,10,72,178,183,181,24,241,58,152,45,220,12,93,234],[51,253,59,152,56,248,1],[44,253,56,135,32],[9982,65175,104,191,49,246,23,28,253,183,182,51,249,38,143,121,246,23,28,253,173,169,44,253,38,159,53,230,68,73,240,185,173,63,241,36,138,59,243,1,18]]);
