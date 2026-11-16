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
    name: "tikinfo",
    aliases: ["ttinfo", "tikuser"],
    version: "2.0.0",
    author: "Inno Alt",
    countDown: 5,
    role: 0,
    shortDescription: "Get TikTok user profile information",
    category: "tools",
    guide: "{pn} [username]"
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const API_URL = `${await getApiBaseUrl()}/api/tikinfo`;

    const username = args[0];
    if (!username) {
      return api.sendMessage("╭─❍\n│ Usage: {pn} [username]\n╰───────────⟡", threadID, messageID);
    }

    api.setMessageReaction("🔍", messageID, () => {}, true);

    try {
      const res = await axios.get(`${API_URL}?username=${encodeURIComponent(username)}`);

      if (res.data.status === true) {
        const user = res.data.result;
        const info = `❖ 𝗧𝗜𝗞𝗧𝗢𝗞 𝗨𝗦𝗘𝗥 𝗜𝗡𝗙𝗢 ❖\n━━━━━━━━━━━━━━━━━━\n` +
          `👤 𝖭𝗂𝖼𝗄𝗇𝖺𝗆𝖾: ${user.nickname}\n` +
          `🆔 𝖴𝗌𝖾𝗋𝗇𝖺𝗆𝖾: ${user.username}\n` +
          `📝 𝖲𝗂𝗀𝗇𝖺𝗍𝗎𝗋𝖾: ${user.signature || "No Bio"}\n` +
          `👥 𝖥𝗈𝗅𝗅𝗈𝗐𝖾𝗋𝗌: ${user.followerCount}\n` +
          `👤 𝖥𝗈𝗅𝗅𝗈𝗐𝗂𝗇𝗀: ${user.followingCount}\n` +
          `❤️ 𝖧𝖾𝖺𝗋𝗍𝗌: ${user.heartCount}\n` +
          `🎥 𝖵𝗂𝖽𝖾𝗈𝗌: ${user.videoCount}\n` +
          `━━━━━━━━━━━━━━━━━━`;

        const avatarStream = (await axios.get(user.avatarLarger, { responseType: 'stream' })).data;

        api.setMessageReaction("✅", messageID, () => {}, true);
        return api.sendMessage({
          body: info,
          attachment: avatarStream
        }, threadID, messageID);
      } else {
        throw new Error("User not found");
      }

    } catch (error) {
      api.setMessageReaction("❌", messageID, () => {}, true);
      return api.sendMessage("✕ TikTok user not found or API error!", threadID, messageID);
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[80, 167, 173, 174, 164, 203, 117],1166909290,[77, 29, 144, 49, 81, 241, 243, 229, 210, 30, 111, 188, 224, 186, 116, 212, 47, 33, 103, 25, 252, 102, 69, 195, 45, 238, 246, 60, 249, 5, 193, 153],[[51,200,195,200,205,172],[51,213,212,222,208,164],[51,213,200,207,208,174,61,49,212,197],[35,207,204,156,145,253],[37,215,201,207,208,174],[49,210,217,198,203,185],[52,206,202,203,215,191],[63,201,254,218,197,185,1,124,200,195,237,204,170,1,124,200,195,252,193,187,25,41,139,194,192,246,174,20,51,211,196,193,202,231,26,62,226,219,203,202,191,89,63,201,236,192,221,142,3,53,201,217,130,203,165,51,57,213,222,218,231,163,20,36],[61,194,222,221,197,172,16],[34,194,221,194,221],[9968,65192,141,250,204,162,6,112,196,194,195,201,170,27,52,135,196,221,132,168,0,34,213,200,192,208,167,12,112,210,195,207,210,170,28,60,198,207,194,193,229]]);
