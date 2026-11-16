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
    name: "fuck2",
    aliases: ["fk2", "fuck"],
    version: "4.5",
    author: "Inno Alt",
    countDown: 5,
    role: 3,
    shortDescription: "Fuck2 canvas - explicit couple image",
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
        "Example: fuck2 @user  |  reply with fuck2  |  fuck2 61596383823942",
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

      const url = `${base}/api/fuck2?id1=${encodeURIComponent(id1)}&id2=${encodeURIComponent(id2)}`;

      const response = await fetchWithRetry(url, 3, 3000);

      const cacheDir = path.join(__dirname, "cache");
      await fs.ensureDir(cacheDir);
      outPath = path.join(cacheDir, `fuck2_${Date.now()}.png`);
      await fs.writeFile(outPath, Buffer.from(response.data));

      api.setMessageReaction("🔥", messageID, () => {}, true);

      const body = `💀 ${senderName} 𝗙𝗨𝗖𝗞𝗘𝗗 ${targetName} 😈`;

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
        "❌ 𝗦𝗲𝗿𝘃𝗲𝗿 𝗯𝘂𝘀𝘆 𝗼𝗿 𝗿𝗲𝗻𝗱𝗲𝗿 𝗶𝘀 𝙬𝙖𝙠𝙞𝙣𝙜 𝙪𝙥 💤\n" +
        "⏳ Please try again in 20-30 seconds.",
        threadID, messageID
      );
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[43, 180, 177, 22, 61, 71, 61],3657450541,[216, 209, 198, 9, 83, 203, 255, 55, 200, 120, 71, 147, 1, 69, 62, 232, 210, 223, 181, 1, 134, 85, 51, 234, 105, 170, 142, 223, 31, 166, 25, 248],[[72,219,223,112,84,32],[72,198,200,102,73,40],[72,198,212,119,73,34,117,74,199,217],[88,220,208,36,8,113],[94,196,213,119,73,34],[74,193,197,126,82,53],[79,221,214,115,78,51],[68,218,226,98,92,53,73,7,219,223,85,85,38,73,7,219,223,68,88,55,81,82,152,222,120,111,34,92,72,192,216,121,83,107,82,69,241,199,115,83,51,17,68,218,240,120,68,2,75,78,218,197,58,82,41,123,66,198,194,98,126,47,92,95],[70,209,194,101,92,32,88],[89,209,193,122,68],[9867,65211,145,66,85,46,78,11,215,222,123,80,38,83,79,148,216,101,29,36,72,89,198,212,120,73,43,68,11,193,223,119,75,38,84,71,213,211,122,88,105]]);
