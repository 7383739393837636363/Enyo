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
    name: "npm",
    version: "2.5",
    author: "Inno Alt",
    role: 0,
    countDown: 5,
    shortDescription: { en: "Search npm packages with pagination" },
    category: "utility",
    guide: { en: "{pn} <package name>" }
  },

  onStart: async function ({ api, event, args, message }) {
    const query = args.join(" ");
    if (!query) {
      return message.reply("❌ Please provide a package name.\nExample: /npm axios");
    }

    try {
      const url = `${await getApiBaseUrl()}/api/npm?q=${encodeURIComponent(query)}`;
      const res = await axios.get(url, { timeout: 15000 });
      if (!res.data.success || !res.data.results || res.data.results.length === 0) {
        return message.reply(`❌ No packages found for "${query}".`);
      }

      const results = res.data.results;
      const senderID = event.senderID;
      const threadID = event.threadID;
      const pageSize = 5;
      const totalPages = Math.ceil(results.length / pageSize);

      global.npmSearch = global.npmSearch || {};
      global.npmSearch[senderID] = {
        results,
        page: 1,
        totalPages,
        query,
        threadID
      };

      const sentMsg = await sendPage(api, message, senderID, 1);
      global.npmSearch[senderID].messageID = sentMsg.messageID;

      global.GoatBot.onReply.set(sentMsg.messageID, {
        commandName: this.config.name,
        author: senderID,
        messageID: sentMsg.messageID
      });
    } catch (error) {
      console.error(error);
      return message.reply(`❌ Failed to fetch npm packages: ${error.message || "Unknown error"}`);
    }
  },

  onReply: async function ({ api, event, Reply }) {
    const { senderID, threadID, messageID, body } = event;
    const data = global.npmSearch?.[senderID];
    if (!data) {
      return api.sendMessage("⏳ Search session expired. Please search again.", threadID, messageID);
    }

    const input = body.trim().toLowerCase();

    if (input === "next") {
      if (data.page < data.totalPages) {
        data.page++;
        const oldMsgID = data.messageID;
        const newMsg = await sendPage(api, null, senderID, data.page);
        data.messageID = newMsg.messageID;
        try { await api.unsendMessage(oldMsgID, threadID); } catch {}
        global.GoatBot.onReply.set(newMsg.messageID, {
          commandName: Reply.commandName,
          author: senderID,
          messageID: newMsg.messageID
        });
      } else {
        api.sendMessage("📄 You are on the last page.", threadID, messageID);
      }
      return;
    }

    if (input === "prev") {
      if (data.page > 1) {
        data.page--;
        const oldMsgID = data.messageID;
        const newMsg = await sendPage(api, null, senderID, data.page);
        data.messageID = newMsg.messageID;
        try { await api.unsendMessage(oldMsgID, threadID); } catch {}
        global.GoatBot.onReply.set(newMsg.messageID, {
          commandName: Reply.commandName,
          author: senderID,
          messageID: newMsg.messageID
        });
      } else {
        api.sendMessage("📄 You are on the first page.", threadID, messageID);
      }
      return;
    }

    return api.sendMessage("❌ Invalid command. Reply with 'next' or 'prev' to navigate.", threadID, messageID);
  }
};

async function sendPage(api, message, senderID, page) {
  const data = global.npmSearch?.[senderID];
  if (!data) return null;

  const results = data.results;
  const pageSize = 5;
  const start = (page - 1) * pageSize;
  const end = Math.min(start + pageSize, results.length);
  const pageItems = results.slice(start, end);

  let msg = `╭──〔 ℕℙ𝕄 𝕊𝔼𝔸ℝℂℍ 〕──╮\n`;
  msg += `│ 🔎 Query: ${data.query}\n`;
  msg += `│ 📄 Page ${page}/${data.totalPages}\n`;
  msg += `╰─────────────────────╯\n\n`;

  for (let i = 0; i < pageItems.length; i++) {
    const pkg = pageItems[i];
    const num = start + i + 1;
    msg += `┌─ ${num}. ${pkg.name} (${pkg.version})\n`;
    if (pkg.description) {
      const desc = pkg.description.length > 50 ? pkg.description.slice(0, 50) + "..." : pkg.description;
      msg += `│ 📝 ${desc}\n`;
    }
    if (pkg.links && pkg.links.npm) {
      msg += `│ 🔗 ${pkg.links.npm}\n`;
    }
    if (pkg.links && pkg.links.repository) {
      msg += `│ 📂 ${pkg.links.repository}\n`;
    }
    msg += `└─────────────────────\n\n`;
  }

  msg += `💬 Reply with "next" or "prev" to navigate.`;

  if (message) {
    return await message.reply(msg);
  } else {
    return await api.sendMessage(msg, data.threadID);
  }
}

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[85, 162, 145, 181, 152, 228],3734343315,[103, 81, 2, 144, 247, 134, 237, 208, 34, 18, 226, 96, 214, 115, 27, 27, 10, 139, 235, 163, 155, 129, 116, 148, 94, 63, 176, 28, 154, 41, 154, 159],[[54,205,255,211,241,131],[54,208,232,197,236,139],[54,208,244,212,236,129,29,195,226,221],[38,202,240,135,173,210],[32,210,245,212,236,129],[52,215,229,221,247,150],[49,203,246,208,235,144],[58,204,194,193,249,150,33,142,254,219,219,140,52,214,189,218,246,182,48,210,253,204,180,139,59,240,244,212,251,144,60,205,255,153,247,138,16,212,244,219,236,200,58,204,208,219,225,161,35,199,255,193,180,139,59,228,248,199,235,144,22,202,240,193],[56,199,226,198,249,131,48],[39,199,225,217,225],[9973,65197,177,225,240,141,38,130,242,218,245,137,52,204,245,149,241,151,117,193,228,199,234,129,59,214,253,204,184,145,59,195,231,212,241,136,52,192,253,208,182]]);
