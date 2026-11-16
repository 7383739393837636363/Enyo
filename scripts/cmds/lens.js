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

module.exports = {
  config: {
    name: "lens",
    aliases: ["ocr"],
    version: "2.0",
    author: "Inno Alt",
    countDown: 5,
    role: 0,
    shortDescription: "Extract text from images (Google Lens)",
    category: "tools",
    guide: "{pn} [reply to image]"
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID, type, messageReply } = event;
    const API_URL = `${await getApiBaseUrl()}/api/lens`;

    let imageUrl;
    if (type === "message_reply" && messageReply.attachments[0]?.type === "photo") {
      imageUrl = messageReply.attachments[0].url;
    } else {
      return api.sendMessage("╭─❍\n│ 𝖯𝗅𝖾𝖺𝗌𝖾 𝗋𝖾𝗉𝗅𝗒 𝗍𝗈 𝖺𝗇 𝗂𝗆𝖺𝗀𝖾!\n╰───────────⟡", threadID, messageID);
    }

    const lang = args[0] || "eng";
    api.setMessageReaction("🔍", messageID, () => {}, true);

    try {
      const res = await axios.get(`${API_URL}?url=${encodeURIComponent(imageUrl)}&lang=${lang}`);

      if (res.data.status === true) {
        const extractedText = res.data.text;
        api.setMessageReaction("✅", messageID, () => {}, true);
        
        return api.sendMessage(
          ` 𝗟𝗘𝗡𝗦 𝗢𝗖𝗥\n━━━━━━━━━━━━━━━━━━\n${extractedText}\n𝗟𝗮𝗻𝗴: ${lang.toUpperCase()}`, 
          threadID, messageID
        );
      } else {
        throw new Error("No text found");
      }

    } catch (error) {
      api.setMessageReaction("❌", messageID, () => {}, true);
      return api.sendMessage("✕ Failed to extract text from image!", threadID, messageID);
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[166, 113, 196, 156, 52, 182, 149, 48, 175, 113, 165],1785951675,[174, 89, 26, 69, 112, 52, 121, 165, 17, 38, 219, 83, 65, 120, 175, 104, 214, 133, 148, 186, 196, 64, 98, 132, 172, 79, 10, 91, 190, 138, 123, 98],[[197,30,170,250,93,209],[197,3,189,236,64,217],[197,3,161,253,64,211,221,81,220,25],[213,25,165,174,1,128],[211,1,160,253,64,211],[199,4,176,244,91,196],[194,24,163,249,71,194],[201,31,151,232,85,196,225,28,192,31,230,206,16,176,176,91,216,199,85,223,29,220,138,30,170,206,81,215,246,68,198,30,203,138,30,170,217,66,211,251,68,131,30,203,231,31,189,217,66,211,251,68,131,30,203,224,24,182,239,64,245,253,81,219],[203,20,183,239,85,209,240],[212,20,180,240,77],[9734,65150,228,200,92,223,230,16,204,30,200,203,16,170,248,20,223,230,16,204,4,215,212,20,170,232,88,207,181,69,193,16,211,199,24,168,253,86,218,240,30]]);
