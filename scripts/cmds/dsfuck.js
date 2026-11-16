const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const API_CONFIG_URL = "https://raw.githubusercontent.com/xalmandevv/xalmanx210/refs/heads/main/apis.json";
const API_KEY = "xalman-canvas";
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

async function getUserName(api, userID) {
  try {
    const info = await api.getUserInfo(userID);
    return info[userID]?.name || "User";
  } catch {
    return "User";
  }
}

async function fetchWithRetry(url, retries = 3, delay = 3000) {
  let lastErr;
  for (let i = 0; i < retries; i++) {
    try {
      const res = await axios.get(url, {
        responseType: "arraybuffer",
        timeout: 90000,
        validateStatus: () => true,
        headers: { "User-Agent": "Mozilla/5.0" }
      });
      const ct = res.headers["content-type"] || "";
      if (ct.includes("image")) return res;
      lastErr = new Error("Server returned non-image response");
    } catch (e) {
      lastErr = e;
    }
    if (i < retries - 1) await new Promise(r => setTimeout(r, delay));
  }
  throw lastErr || new Error("Request failed");
}

module.exports = {
  config: {
    name: "dsfuck",
    aliases: ["doggystylefuck", "dsf"],
    version: "2.0",
    author: "Inno Alt",
    countDown: 5,
    role: 3,
    shortDescription: "Doggystylefuck canvas - explicit couple image",
    longDescription: "Sender on id1, target (mention/reply/UID) on id2",
    category: "NSFW",
    guide: { en: "{pn} @user | reply | {pn} <uid>" }
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID, mentions, messageReply, senderID } = event;

    let id1 = senderID;
    let id2 = null;

    const mIDs = Object.keys(mentions || {}).filter(id => id !== senderID);
    if (mIDs.length > 0) id2 = mIDs[0];
    else if (messageReply && messageReply.senderID) id2 = messageReply.senderID;
    else {
      const uidArg = args.find(a => /^\d{6,}$/.test(a));
      if (uidArg) id2 = uidArg;
    }

    if (!id2) {
      return api.sendMessage(
        "⚠️ Please mention, reply to, or provide the UID of the other user.\n" +
        "Example: dsfuck @user  |  reply with dsfuck  |  dsfuck 61596383823942",
        threadID, messageID
      );
    }

    let outPath = null;

    try {
      api.setMessageReaction("⏳", messageID, () => {}, true);

      const [base, senderName, targetName] = await Promise.all([
        getApiBaseUrl(),
        getUserName(api, id1),
        getUserName(api, id2)
      ]);

      const url = `${base}/api/dsfuck?id1=${encodeURIComponent(id1)}&id2=${encodeURIComponent(id2)}`;

      const response = await fetchWithRetry(url, 3, 3000);

      const cacheDir = path.join(__dirname, "cache");
      await fs.ensureDir(cacheDir);
      outPath = path.join(cacheDir, `dsfuck_${Date.now()}.png`);
      await fs.writeFile(outPath, Buffer.from(response.data));

      api.setMessageReaction("🔥", messageID, () => {}, true);

      const body = `🥵 ${senderName} 𝗴𝗮𝘃𝗲 ${targetName} 𝗮 𝙬𝙞𝙡𝙙 𝙙𝙤𝙜𝙜𝙮𝙨𝙩𝙮𝙡𝙚 𝙧𝙞𝙙𝙚 😈🔥`;

      return api.sendMessage({
        body,
        attachment: fs.createReadStream(outPath)
      }, threadID, async () => {
        if (outPath && fs.existsSync(outPath)) await fs.unlink(outPath);
      }, messageID);

    } catch (err) {
      console.error(err);
      if (outPath && fs.existsSync(outPath)) await fs.unlink(outPath);
      api.setMessageReaction("❌", messageID, () => {}, true);
      return api.sendMessage(
        "❌ 𝗦𝗲𝗿𝘃𝗲𝗿 𝗯𝘂𝘀𝘆 𝗼𝗿 𝗿𝗲𝗻𝗱𝗲𝗿 𝗶𝘀 𝙬𝙖𝙠𝗶𝗻𝙜 𝘂𝙥 💤\n" +
        "⏳ Please try again in 20-30 seconds.",
        threadID, messageID
      );
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[200, 117, 212, 83, 116, 67, 84, 197, 170, 150],389427184,[67, 249, 198, 185, 3, 240, 79, 75, 42, 185, 5, 117, 38, 20, 157, 93, 170, 147, 128, 5, 63, 60, 68, 125, 167, 21, 182, 134, 219, 43, 187, 178],[[171,26,186,53,29,36],[171,7,173,35,0,44],[171,7,177,50,0,38,28,164,217,254],[187,29,181,97,65,117],[189,5,176,50,0,38],[169,0,160,59,27,49],[172,28,179,54,7,55],[167,27,135,39,21,49,32,233,197,248,139,29,181,39,88,44,58,151,207,230,164,12,248,60,26,17,49,164,201,226,161,26,186,127,27,45,17,179,207,248,188,89,187,61,53,45,45,128,220,243,166,1,248,60,26,5,61,183,217,226,139,29,181,39],[165,16,167,32,21,36,49],[186,16,164,63,13],[9832,65146,244,7,28,42,39,229,201,249,165,24,181,61,16,99,61,182,138,245,189,7,166,54,26,55,56,188,138,227,166,20,162,50,29,47,53,167,198,243,230]]);
