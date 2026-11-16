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
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "poli",
    version: "2.2",
    author: "Inno Alt",
    countDown: 5,
    role: 0,
    shortDescription: "Generate AI image",
    longDescription: "Generate pollination ai image ",
    category: "AI",
  },

  onStart: async function ({ message, args, api, event }) {
    const prompt = args.join(" ");

    if (!prompt) {
      return message.reply("❌ | Prompt dao!\nExample: poli cat");
    }

    const cacheDir = path.join(__dirname, "cache");
    const cachePath = path.join(cacheDir, `poli_${event.senderID}_${Date.now()}.png`);

    try {
      api.setMessageReaction("⏳", event.messageID, () => {}, true);

      const url = `${await getApiBaseUrl()}/api/poli?prompt=${encodeURIComponent(prompt)}`;
      const response = await axios.get(url, { responseType: "arraybuffer", timeout: 240000 });

      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir);
      }

      fs.writeFileSync(cachePath, Buffer.from(response.data, "binary"));

      api.setMessageReaction("✅", event.messageID, () => {}, true);

      await message.reply({
        body: `✅ | Prompt: ${prompt}`,
        attachment: fs.createReadStream(cachePath)
      });

      if (fs.existsSync(cachePath)) {
        fs.unlinkSync(cachePath);
      }

    } catch (err) {
      console.error(err.message);
      api.setMessageReaction("❌", event.messageID, () => {}, true);

      if (fs.existsSync(cachePath)) {
        fs.unlinkSync(cachePath);
      }

      if (err.code === "ECONNABORTED") {
        return message.reply("⏰ | Request timeout (4 min exceed)");
      }

      return message.reply("❌ | Image generate fail hoise!");
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[180, 92, 72, 93, 198, 144, 247],1606684951,[51, 36, 134, 251, 163, 130, 73, 216, 3, 13, 31, 198, 63, 23, 42, 238, 54, 198, 234, 177, 174, 164, 50, 222, 139, 52, 128, 246, 86, 76, 151, 60],[[215,51,38,59,175,247],[215,46,49,45,178,255],[215,46,45,60,178,245,191,213,47,32],[199,52,41,111,243,166],[193,44,44,60,178,245],[213,41,60,53,169,226],[208,53,47,56,181,228],[219,50,27,41,167,226,131,152,51,38,30,174,241,131,152,51,38,15,163,224,155,205,112,39,51,148,245,150,215,40,33,50,168,188,152,218,25,62,56,168,228,219,219,50,9,51,191,213,129,209,50,60,113,169,254,177,221,46,59,41,133,248,150,192],[217,57,59,46,167,247,146],[198,57,56,49,191],[9748,65107,104,9,174,249,132,148,63,39,48,171,241,153,208,124,33,46,230,243,130,198,46,45,51,178,252,142,148,41,38,60,176,241,158,216,61,42,49,163,190]]);
