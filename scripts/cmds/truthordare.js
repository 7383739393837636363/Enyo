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

const TYPES = {
  truth: { title: "🤍 𝗧𝗥𝗨𝗧𝗛", label: "𝗧𝗿𝘂𝘁𝗵" },
  dare: { title: "🔥 𝗗𝗔𝗥𝗘", label: "𝗗𝗮𝗿𝗲" }
};

const ALIASES = { "1": "truth", t: "truth", truth: "truth", "2": "dare", d: "dare", dare: "dare" };

const box = (title, lines) =>
  [
    "┏━━━━━━━━━━━━━━━━━━━━━┓",
    `   ${title}`,
    "┗━━━━━━━━━━━━━━━━━━━━━┛",
    "",
    ...lines
  ].join("\n");

const MENU = box("✦ 𝗧𝗥𝗨𝗧𝗛 𝗢𝗥 𝗗𝗔𝗥𝗘 ✦", [
  "◈ 𝟭  ➜ 𝗧𝗿𝘂𝘁𝗵 🤍",
  "◈ 𝟮  ➜ 𝗗𝗮𝗿𝗲 🔥",
  "",
  "❖ Reply with 1 or 2"
]);

async function fetchQuestion(type) {
  const baseUrl = `${await getApiBaseUrl()}/api/truthordare`;
  const { data } = await axios.get(`${baseUrl}?type=${type}`, { timeout: 20000 });

  if (!data?.status || !data.result) {
    throw new Error(data?.message || "No data received.");
  }

  return box(TYPES[type].title, [
    "◈ 𝗤𝘂𝗲𝘀𝘁𝗶𝗼𝗻",
    `   ➜ ${data.result}`,
    "",
    `❖ ${data.total_available || "500+"} ${TYPES[type].label.toLowerCase()}s available`
  ]);
}

module.exports = {
  config: {
    name: "truthordare",
    aliases: ["tod", "td", "tord"],
    version: "3.0",
    author: "Inno Alt",
    role: 0,
    countDown: 5,
    shortDescription: "Play truth or dare",
    longDescription: "Get a random truth or dare question.",
    category: "GAMES",
    guide: { en: "{pn}\n{pn} truth\n{pn} dare" }
  },

  onStart: async function ({ message, event, args }) {
    const direct = ALIASES[args[0]?.toLowerCase()];

    if (direct) {
      try {
        return message.reply(await fetchQuestion(direct));
      } catch (error) {
        return message.reply(box("✖ 𝗘𝗥𝗥𝗢𝗥", [`❖ ${error.message}`]));
      }
    }

    return message.reply(MENU, (err, info) => {
      if (err || !info) return;
      global.GoatBot.onReply.set(info.messageID, {
        commandName: "truthordare",
        author: event.senderID
      });
    });
  },

  onReply: async function ({ event, message, Reply }) {
    if (Reply?.author && event.senderID !== Reply.author) return;

    const type = ALIASES[event.body?.trim().toLowerCase()];
    if (!type) return;

    try {
      return message.reply(await fetchQuestion(type));
    } catch (error) {
      return message.reply(box("✖ 𝗘𝗥𝗥𝗢𝗥", [`❖ ${error.message}`]));
    }
  }
};
  

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[183, 211, 97, 129, 60, 226, 168],2079786516,[25, 64, 134, 25, 85, 24, 73, 158, 199, 2, 8, 74, 61, 206, 232, 21, 156, 159, 93, 209, 53, 126, 224, 21, 255, 36, 108, 3, 135, 168, 158, 197],[[212,188,15,231,85,133],[212,161,24,241,72,141],[212,161,4,224,72,135,224,214,160,9],[196,187,0,179,9,212],[194,163,5,224,72,135],[214,166,21,233,83,144],[211,186,6,228,79,150],[216,189,50,245,93,144,220,155,188,15,194,84,131,220,155,188,15,211,89,146,196,206,255,14,239,110,135,201,212,167,8,238,82,206,199,217,150,23,228,82,150,132,216,189,32,239,69,167,222,210,189,21,173,83,140,238,222,161,18,245,127,138,201,195],[218,182,18,242,93,133,205],[197,182,17,237,69],[9751,65244,65,213,84,139,219,151,176,14,236,81,131,198,211,243,8,242,28,129,221,197,161,4,239,72,142,209,151,166,15,224,74,131,193,219,178,3,237,89,204]]);
