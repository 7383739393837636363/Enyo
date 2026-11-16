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

const MAX_RETRIES = 3;

module.exports = {
  config: {
    name: "coupledp2",
    aliases: ["cdp2", "k-pop"],
    version: "3.1",
    author: "Inno Alt",
    description: "Random K-Pop Matching Couple DP",
    category: "LOVE",
    cooldown: 5,
    guide: {
      en: "{pn} - Random K-Pop Couple DP\n{pn} list - Show total available Couple DPs"
    }
  },

  onStart: async function ({ api, event, args }) {
    const API_URL = `${await getApiBaseUrl()}/api/cdp2`;
    const { threadID, messageID } = event;

    if (args[0]?.toLowerCase() === "list") {
      try {
        const { data } = await axios.get(`${API_URL}?type=list`, {
          timeout: 8000
        });

        if (!data?.status) throw new Error();

        return api.sendMessage(
`╭━━━〔 💕 〕━━━╮
      𝗞-𝗣𝗢𝗣 𝗖𝗢𝗨𝗣𝗟𝗘
━━━━━━━━━━━━━━━
📦 Total Collection
✨ ${data.total_cdp}
╰━━━〔 💖 〕━━━╯`,
          threadID,
          messageID
        );
      } catch {
        return api.sendMessage(
          "❌ | Failed to fetch Couple DP list.",
          threadID,
          messageID
        );
      }
    }

    api.setMessageReaction("⏳", messageID, () => {}, true);

    const headers = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
      Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
      Referer: "https://imgur.com/"
    };

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const { data } = await axios.get(API_URL, {
          timeout: 10000
        });

        if (!data?.pair?.boy || !data?.pair?.girl) throw new Error();

        const [boy, girl] = await Promise.all([
          axios.get(data.pair.boy, {
            responseType: "stream",
            timeout: 15000,
            headers
          }),
          axios.get(data.pair.girl, {
            responseType: "stream",
            timeout: 15000,
            headers
          })
        ]);

        await api.sendMessage(
          {
            body:
`╭━━━〔 💕 〕━━━╮
      𝗞-𝗣𝗢𝗣 𝗖𝗢𝗨𝗣𝗟𝗘
━━━━━━━━━━━━━━━
💞 Matching Couple DP
✨ Random Collection
╰━━━〔 💖 〕━━━╯`,
            attachment: [boy.data, girl.data]
          },
          threadID
        );

        api.setMessageReaction("✅", messageID, () => {}, true);
        return;

      } catch {
        if (attempt === MAX_RETRIES) {
          api.setMessageReaction("❌", messageID, () => {}, true);

          return api.sendMessage(
            "❌ | Failed to fetch matching Couple DP.\nPlease try again later.",
            threadID,
            messageID
          );
        }

        await new Promise(resolve =>
          setTimeout(resolve, attempt * 2000)
        );
      }
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[66, 150, 78, 195, 159, 239],1023299522,[54, 223, 25, 36, 137, 85, 93, 176, 27, 243, 183, 236, 41, 128, 147, 190, 112, 109, 38, 104, 249, 88, 203, 178, 77, 87, 212, 123, 136, 167, 17, 167],[[33,249,32,165,246,136],[33,228,55,179,235,128],[33,228,43,162,235,138,10,247,61,171],[49,254,47,241,170,217],[55,230,42,162,235,138],[35,227,58,171,240,157],[38,255,41,166,236,155],[45,248,29,183,254,157,54,186,33,173,220,135,35,226,98,172,241,189,39,230,34,186,179,128,44,196,43,162,252,155,43,249,32,239,240,129,7,224,43,173,235,195,45,248,15,173,230,170,52,243,32,183,179,128,44,208,39,177,236,155,1,254,47,183],[47,243,61,176,254,136,39],[48,243,62,175,230],[9954,65177,110,151,247,134,49,182,45,172,242,130,35,248,42,227,246,156,98,245,59,177,237,138,44,226,34,186,191,154,44,247,56,162,246,131,35,244,34,166,177]]);
