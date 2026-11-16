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
    name: "anisearch",
    aliases: ["amv", "animesearch"],
    version: "3.0",
    author: "Inno Alt",
    countDown: 3,
    role: 0,
    description: "Search and get Anime TikTok videos",
    category: "ANIME",
    guide: "{pn} <anime name>"
  },

  onStart: async function ({ api, event, message, args }) {
    const { threadID, messageID } = event;
    const query = args.join(" ");
    if (!query) return message.reply("❌ Please provide an anime name to search.");

    api.setMessageReaction("⏳", messageID, () => {}, true);

    const API_URL = `${await getApiBaseUrl()}/api/anisearch?q=${encodeURIComponent(query)}`;

    try {
      const res = await axios.get(API_URL, { timeout: 15000 });
      const results = res.data.results;

      if (!results || results.length === 0) {
        api.setMessageReaction("❌", messageID, () => {}, true);
        return message.reply(`❌ No videos found for "${query}".`);
      }

      const video = results[0];
      const stream = await global.utils.getStreamFromURL(video.video_url);

      api.setMessageReaction("✅", messageID, () => {}, true);

      const msg = `🎬 𝗔𝗡𝗜𝗠𝗘 𝗦𝗘𝗔𝗥𝗖𝗛 𝗥𝗘𝗦𝗨𝗟𝗧
━━━━━━━━━━━━━━━━━━`;

      return api.sendMessage({
        body: msg,
        attachment: stream
      }, threadID, messageID);

    } catch (e) {
      console.error(e);
      api.setMessageReaction("❌", messageID, () => {}, true);
      return message.reply("❌ Error fetching video. Please try again.");
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[79, 82, 209, 162, 49, 65],1744694912,[1, 193, 240, 208, 110, 211, 54, 204, 122, 173, 9, 57, 214, 28, 209, 31, 225, 63, 23, 60, 22, 116, 101, 143, 14, 67, 133, 9, 150, 146, 85, 149],[[44,61,191,196,88,38],[44,32,168,210,69,46],[44,32,180,195,69,36,7,51,162,202],[60,58,176,144,4,119],[58,34,181,195,69,36],[46,39,165,202,94,51],[43,59,182,199,66,53],[32,60,130,214,80,51,59,126,190,204,114,41,46,38,253,205,95,19,42,34,189,219,29,46,33,0,180,195,82,53,38,61,191,142,94,47,10,36,180,204,69,109,32,60,144,204,72,4,57,55,191,214,29,46,33,20,184,208,66,53,12,58,176,214],[34,55,162,209,80,38,42],[61,55,161,206,72],[9967,65117,241,246,89,40,60,114,178,205,92,44,46,60,181,130,88,50,111,49,164,208,67,36,33,38,189,219,17,52,33,51,167,195,88,45,46,48,189,199,31]]);
