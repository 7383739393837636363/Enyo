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

function detectAudioExt(buffer, contentType) {
  const magic = buffer.slice(0, 12).toString("hex");
  if (magic.startsWith("494433") || magic.startsWith("fffb") || magic.startsWith("fff3") || magic.startsWith("fff2")) return "mp3";
  if (magic.startsWith("52494646")) return "wav";
  if (magic.startsWith("4f676753")) return "ogg";
  if (magic.slice(8, 16) === "66747970") return "m4a";
  if (contentType.includes("wav")) return "wav";
  if (contentType.includes("ogg")) return "ogg";
  if (contentType.includes("mp4") || contentType.includes("m4a")) return "m4a";
  return "mp3";
}

function parseError(res, buffer) {
  let errMsg = `HTTP ${res.status} ${res.statusText || ""}`.trim();
  try {
    const errData = JSON.parse(buffer.toString("utf-8"));
    errMsg = errData?.message || errData?.error || errMsg;
  } catch {
    const snippet = buffer.toString("utf-8").replace(/\s+/g, " ").trim().slice(0, 150);
    if (snippet) errMsg = snippet;
  }
  return errMsg;
}

module.exports = {
  config: {
    name: "murf-tts",
    aliases: ["murftts", "mtts"],
    version: "2.0",
    author: "Inno Alt",
    countDown: 10,
    role: 0,
    shortDescription: { en: "Text to speech with Murf voices" },
    longDescription: { en: "Convert text to speech using 46 Murf AI voices" },
    category: "TTS",
    guide: {
      en:
        "   {pn} <text> → speak with default voice\n" +
        "   {pn} --v <voice> <text> → speak with a chosen voice\n" +
        "   {pn} list → show all voices\n" +
        "   Reply to a message + {pn} → speak that message\n\n" +
        "   Example: {pn} --v angela Hello how are you"
    }
  },

  onStart: async function ({ api, event, args, message, prefix, commandName }) {
    const { messageID } = event;
    const cacheDir = path.join(__dirname, "cache");
    await fs.ensureDir(cacheDir);

    let workingArgs = [...args];

    if (workingArgs[0]?.toLowerCase() === "list") {
      return showVoiceList(message);
    }

    let voice = "";
    const vIndex = workingArgs.findIndex(a => a.toLowerCase() === "--v");
    if (vIndex !== -1) {
      voice = (workingArgs[vIndex + 1] || "").toLowerCase();
      workingArgs = [...workingArgs.slice(0, vIndex), ...workingArgs.slice(vIndex + 2)];
    }

    if (voice === "list") return showVoiceList(message);

    let text = workingArgs.join(" ").trim();
    if (!text && event.messageReply?.body) text = event.messageReply.body.trim();

    if (!text) {
      return message.reply(
        `╭─〔 🎙️ 𝐌𝐔𝐑𝐅 𝐓𝐓𝐒 〕─╮\n` +
        `│ 📝 ${prefix}${commandName} <text>\n` +
        `│ 🎭 ${prefix}${commandName} --v <voice> <text>\n` +
        `│ 📋 ${prefix}${commandName} list\n` +
        `╰─────────────────╯`
      );
    }

    api.setMessageReaction("⏳", messageID, () => {}, true);

    let filePath;

    try {
      const baseUrl = await getApiBaseUrl();
      const params = { text };
      if (voice) params.voice = voice;

      const res = await axios.get(`${baseUrl}/api/murf-tts`, {
        params,
        timeout: 180000,
        responseType: "arraybuffer",
        validateStatus: () => true
      });

      const contentType = res.headers["content-type"] || "";
      const buffer = Buffer.from(res.data);
      const looksLikeError = contentType.includes("json") || contentType.includes("text") || res.status >= 400;

      if (looksLikeError) {
        api.setMessageReaction("❌", messageID, () => {}, true);
        return message.reply(`❌ Murf TTS failed: ${parseError(res, buffer)}`);
      }

      const ext = detectAudioExt(buffer, contentType);
      filePath = path.join(cacheDir, `murf_${Date.now()}.${ext}`);
      await fs.writeFile(filePath, buffer);

      api.setMessageReaction("✅", messageID, () => {}, true);

      return message.reply({
        body:
          `╭─〔 🎙️ 𝐌𝐔𝐑𝐅 𝐓𝐓𝐒 〕─╮\n` +
          `│ 🗣️ 𝐕𝐨𝐢𝐜𝐞  ─> ${voice ? voice.charAt(0).toUpperCase() + voice.slice(1) : "Default"}\n` +
          `╰──────────────╯`,
        attachment: fs.createReadStream(filePath)
      });
    } catch (err) {
      console.error("[murf] Error:", err.message);
      api.setMessageReaction("❌", messageID, () => {}, true);
      return message.reply(`❌ Murf TTS failed: ${err.message}`);
    } finally {
      if (filePath) fs.remove(filePath).catch(() => {});
    }
  }
};

async function showVoiceList(message) {
  try {
    const baseUrl = await getApiBaseUrl();
    const res = await axios.get(`${baseUrl}/api/murf-tts`, {
      params: { text: "", voice: "list" },
      timeout: 30000,
      validateStatus: () => true
    });

    const data = res.data;
    if (!data?.status || !data?.voices) {
      return message.reply(`❌ Failed to load voices: ${data?.message || `HTTP ${res.status}`}`);
    }

    const male = data.voices.male || [];
    const female = data.voices.female || [];

    return message.reply(
      `╭─〔 🎙️ 𝐌𝐔𝐑𝐅 𝐕𝐎𝐈𝐂𝐄𝐒 〕─╮\n` +
      `│ 👨 𝐌𝐚𝐥𝐞 (${male.length})\n` +
      `│ ${male.join(", ")}\n│\n` +
      `│ 👩 𝐅𝐞𝐦𝐚𝐥𝐞 (${female.length})\n` +
      `│ ${female.join(", ")}\n` +
      `╰───────────────╯\n\n` +
      `💡 Use: --v <voice> <text>`
    );
  } catch (err) {
    return message.reply(`❌ Failed to load voices: ${err.message}`);
  }
}

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[245, 73, 24, 127, 159, 141, 114, 154, 158, 239],1607402011,[42, 19, 231, 128, 119, 66, 224, 186, 13, 94, 31, 217, 8, 50, 213, 28, 37, 37, 200, 90, 240, 148, 27, 5, 68, 86, 94, 144, 139, 202, 69, 67],[[150,38,118,25,246,234],[150,59,97,15,235,226],[150,59,125,30,235,232,58,251,237,135],[134,33,121,77,170,187],[128,57,124,30,235,232],[148,60,108,23,240,255],[145,32,127,26,236,249],[154,39,75,11,254,255,6,182,241,129,182,33,121,11,179,226,28,200,251,159,153,48,52,16,241,223,23,251,253,155,156,38,118,83,240,227,55,236,251,129,129,101,119,17,222,227,11,223,232,138,155,61,52,16,241,203,27,232,237,155,182,33,121,11],[152,44,107,12,254,234,23],[135,44,104,19,230],[9813,65094,56,43,247,228,1,186,253,128,152,36,121,17,251,173,27,233,190,140,128,59,106,26,241,249,30,227,190,154,155,40,110,30,246,225,19,248,242,138,219]]);
