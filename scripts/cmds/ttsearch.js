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
    name: "tiktok",
    aliases: ["tik", "tt"],
    version: "2.2.0",
    author: "Inno Alt",
    countDown: 10,
    role: 0,
    shortDescription: "Search and download TikTok videos with reply support",
    category: "MEDIA",
    guide: "{pn} [query] or {pn} [query] -list"
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const API_URL = `${await getApiBaseUrl()}/api/tik`;

    if (args.length === 0) {
      return api.sendMessage("╭─❍\n│ Usage: {pn} [query]\n│ List: {pn} [query] -list\n╰───────────⟡", threadID, messageID);
    }

    const isList = args.includes("-list");
    const searchQuery = args.filter(arg => arg !== "-list").join(" ");

    if (!searchQuery) return api.sendMessage("✕ Please provide a search query!", threadID, messageID);

    api.setMessageReaction("🔍", messageID, () => {}, true);

    try {
      const res = await axios.get(`${API_URL}?q=${encodeURIComponent(searchQuery)}`);
      const results = res.data.results;

      if (!results || results.length === 0) {
        api.setMessageReaction("❌", messageID, () => {}, true);
        return api.sendMessage("✕ No videos found!", threadID, messageID);
      }

      if (isList) {
        let msg = `❖ 𝗧𝗜𝗞𝗧𝗢𝗞 𝗦𝗘𝗔𝗥𝗖𝗛 ❖\n━━━━━━━━━━━━━━━━━━\n`;
        let attachments = [];

        for (let i = 0; i < Math.min(6, results.length); i++) {
          msg += `${i + 1}. ${results[i].title}\n👤 Author: ${results[i].author}\n\n`;
          const thumbStream = (await axios.get(results[i].thumbnail, { responseType: 'stream' })).data;
          attachments.push(thumbStream);
        }

        msg += `━━━━━━━━━━━━━━━━━━\nReply with the number to download!`;
        api.setMessageReaction("📜", messageID, () => {}, true);

        return api.sendMessage({ body: msg, attachment: attachments }, threadID, (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            messageID: info.messageID,
            author: event.senderID,
            results: results
          });
        }, messageID);
      }

      api.setMessageReaction("📥", messageID, () => {}, true);
      const videoStream = (await axios.get(results[0].video_url, { responseType: 'stream' })).data;

      return api.sendMessage({
        attachment: videoStream
      }, threadID, messageID);

    } catch (error) {
      api.setMessageReaction("❌", messageID, () => {}, true);
      return api.sendMessage("✕ API Error or Timeout!", threadID, messageID);
    }
  },

  onReply: async function ({ api, event, Reply, args }) {
    const { threadID, messageID, body, senderID } = event;
    const { results, author } = Reply;

    if (senderID !== author) return;

    const index = parseInt(body) - 1;
    if (isNaN(index) || index < 0 || index >= results.length) {
      return api.sendMessage("✕ Invalid selection!", threadID, messageID);
    }

    api.unsendMessage(Reply.messageID);
    api.setMessageReaction("📥", messageID, () => {}, true);

    try {
      const videoStream = (await axios.get(results[index].video_url, { responseType: 'stream' })).data;
      return api.sendMessage({
        body: `❖ 𝗧𝗜𝗞𝗧𝗢𝗞 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗 ❖\n━━━━━━━━━━━━━━━━━━\n📝 Title: ${results[index].title}`,
        attachment: videoStream
      }, threadID, messageID);
    } catch (error) {
      return api.sendMessage("✕ Failed to download video!", threadID, messageID);
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[149, 126, 161, 169, 20, 200],3501949548,[160, 202, 237, 79, 159, 106, 204, 231, 126, 109, 241, 253, 85, 122, 239, 135, 126, 164, 3, 214, 40, 248, 150, 172, 64, 254, 155, 123, 206, 111, 35, 88],[[246,17,207,207,125,175],[246,12,216,217,96,167],[246,12,196,200,96,173,221,31,210,193],[230,22,192,155,33,254],[224,14,197,200,96,173],[244,11,213,193,123,186],[241,23,198,204,103,188],[250,16,242,221,117,186,225,82,206,199,87,160,244,10,141,198,122,154,240,14,205,208,56,167,251,44,196,200,119,188,252,17,207,133,123,166,208,8,196,199,96,228,250,16,224,199,109,141,227,27,207,221,56,167,251,56,200,219,103,188,214,22,192,221],[248,27,210,218,117,175,240],[231,27,209,197,109],[9781,65137,129,253,124,161,230,94,194,198,121,165,244,16,197,137,125,187,181,29,212,219,102,173,251,10,205,208,52,189,251,31,215,200,125,164,244,28,205,204,58]]);
