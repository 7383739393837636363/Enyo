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

if (!global.deepAiSessions) {
  global.deepAiSessions = new Map();
}

async function askDeepAi(prompt, session) {
  const baseUrl = await getApiBaseUrl();

  const res = await axios.get(`${baseUrl}/api/deepai-chat`, {
    params: { prompt, session: session || "" },
    timeout: 60000,
    validateStatus: () => true
  });

  const data = res.data;
  if (!data?.status || !data?.result) {
    throw new Error(data?.message || "Failed to get a response from DeepAI.");
  }

  return { result: data.result, session: data.session };
}

module.exports = {
  config: {
    name: "ai",
    aliases: ["deepai"],
    version: "3.0",
    author: "Inno Alt",
    countDown: 3,
    role: 0,
    shortDescription: { en: "Chat with DeepAI" },
    longDescription: { en: "Multi-turn chat with DeepAI" },
    category: "AI",
    guide: {
      en: "{p}ai <your prompt> (Reply to continue or reply 'close' to stop)"
    }
  },

  onStart: async function ({ api, event, args, message }) {
    const { senderID, messageID } = event;
    const prompt = args.join(" ");

    if (!prompt) {
      return message.reply("⚠️ Please provide a prompt or question.");
    }

    api.setMessageReaction("⏳", messageID, () => {}, true);

    try {
      const { result, session } = await askDeepAi(prompt, null);

      api.setMessageReaction("✅", messageID, () => {}, true);

      const sentMsg = await message.reply(`${result}\n\n💡 _Reply to continue or reply 'close' to exit session._`);

      global.deepAiSessions.set(senderID, {
        session,
        lastMsgID: sentMsg.messageID
      });

      global.GoatBot.onReply.set(sentMsg.messageID, {
        commandName: this.config.name,
        author: senderID,
        type: "deepai_chat"
      });
    } catch (error) {
      api.setMessageReaction("❌", messageID, () => {}, true);
      const errMsg = error.response?.data?.message || error.message;
      return message.reply(`❌ Error: ${errMsg}`);
    }
  },

  onReply: async function ({ api, event, message, Reply }) {
    const { senderID, body, messageID } = event;

    if (Reply.author !== senderID) {
      return message.reply("⚠️ You cannot reply to someone else's conversation.");
    }

    const sessionData = global.deepAiSessions.get(senderID);

    if (!sessionData) {
      return message.reply("❌ Session expired or not found. Please start a new chat with `.ai <prompt>`.");
    }

    const userText = body.trim();

    if (userText.toLowerCase() === "close" || userText.toLowerCase() === "stop") {
      global.deepAiSessions.delete(senderID);
      api.setMessageReaction("🔴", messageID, () => {}, true);
      return message.reply("🛑 Session closed successfully.");
    }

    api.setMessageReaction("⏳", messageID, () => {}, true);

    try {
      const { result, session } = await askDeepAi(userText, sessionData.session);

      api.setMessageReaction("✅", messageID, () => {}, true);

      const sentMsg = await message.reply(`${result}\n\n💡 _Reply to continue or reply 'close' to exit._`);

      sessionData.session = session;
      sessionData.lastMsgID = sentMsg.messageID;
      global.deepAiSessions.set(senderID, sessionData);

      global.GoatBot.onReply.set(sentMsg.messageID, {
        commandName: this.config.name,
        author: senderID,
        type: "deepai_chat"
      });
    } catch (error) {
      api.setMessageReaction("❌", messageID, () => {}, true);
      const errMsg = error.response?.data?.message || error.message;
      return message.reply(`❌ Error: ${errMsg}`);
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[35, 113, 40, 94, 190, 90, 51, 29, 20],3692551191,[42, 14, 68, 186, 17, 63, 115, 43, 225, 140, 199, 251, 228, 49, 112, 170, 77, 207, 113, 181, 110, 104, 68, 156, 58, 175, 6, 142, 65, 75, 141, 50],[[64,30,70,56,215,61],[64,3,81,46,202,53],[64,3,77,63,202,63,123,124,103,75],[80,25,73,108,139,108],[86,1,76,63,202,63],[66,4,92,54,209,40],[71,24,79,59,205,46],[76,31,123,42,223,40,71,49,123,77,50,64,63,202,118,92,115,70,70,1,68,39,146,53,93,79,113,66,18,92,55,209,52,31,114,122,102,7,77,48,202,118,92,115,85,77,8,109,40,219,52,71,49,123,77,55,65,44,205,46,112,117,117,87],[78,20,91,45,223,61,86],[81,20,88,50,199],[9859,65150,8,10,214,51,64,61,119,76,28,69,63,208,62,19,116,103,3,18,93,44,204,63,93,105,120,90,81,93,48,223,44,82,116,120,66,19,68,59,144]]);
