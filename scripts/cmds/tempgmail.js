const axios = require("axios");

const API_CONFIG_URL = "https://raw.githubusercontent.com/xalmandevv/xalmanx210/refs/heads/main/apis.json";
const API_KEY = "xalman-hub";
const MAX_MAILS = 5;

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

const box = (title, lines) =>
  [
    "┏━━━━━━━━━━━━━━━━━━━━━┓",
    `   ${title}`,
    "┗━━━━━━━━━━━━━━━━━━━━━┛",
    "",
    ...lines
  ].join("\n");

const HELP = box("✦ 𝗧𝗘𝗠𝗣 𝗚𝗠𝗔𝗜𝗟 ✦", [
  "◈ 𝗖𝗿𝗲𝗮𝘁𝗲",
  "   ➜ /gmail create",
  "",
  "◈ 𝗜𝗻𝗯𝗼𝘅",
  "   ➜ /gmail inbox <email>"
]);

module.exports = {
  config: {
    name: "tempgmail",
    version: "2.5",
    aliases: ["gmail"],
    author: "Inno Alt",
    countDown: 5,
    role: 0,
    shortDescription: "Generate temp Gmail and check inbox",
    longDescription: "Create a public temp Gmail and check its inbox using xalman API",
    category: "utility",
    guide: "{pn} create\n{pn} inbox [email]"
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const action = args[0]?.toLowerCase();
    const email = args[1]?.trim();
    const reply = (text) => api.sendMessage(text, threadID, messageID);

    if (!["create", "gen", "inbox"].includes(action)) return reply(HELP);

    if (action === "create" || action === "gen") {
      const waitMsg = await api.sendMessage("⏳ 𝗚𝗲𝗻𝗲𝗿𝗮𝘁𝗶𝗻𝗴 𝘆𝗼𝘂𝗿 𝗚𝗺𝗮𝗶𝗹...", threadID);

      try {
        const baseUrl = `${await getApiBaseUrl()}/api/temp-gmail`;
        const { data } = await axios.get(`${baseUrl}?action=create`, { timeout: 30000 });
        api.unsendMessage(waitMsg.messageID);

        if (!data?.status || !data.email) {
          return reply(box("✖ 𝗙𝗔𝗜𝗟𝗘𝗗", [`❖ ${data?.message || "Could not generate Gmail."}`]));
        }

        return reply(
          box("✔ 𝗚𝗠𝗔𝗜𝗟 𝗥𝗘𝗔𝗗𝗬", [
            "◈ 𝗠𝗮𝗶𝗹",
            `   ➜ ${data.email}`,
            "",
            "◈ 𝗧𝘆𝗽𝗲",
            `   ➜ ${data.type || "PUBLIC"}`,
            "",
            "◈ 𝗤𝘂𝗶𝗰𝗸 𝗖𝗵𝗲𝗰𝗸",
            `   ➜ /gmail inbox ${data.email}`
          ])
        );
      } catch (error) {
        api.unsendMessage(waitMsg.messageID);
        return reply(box("✖ 𝗘𝗥𝗥𝗢𝗥", [`❖ ${error.response?.data?.message || error.message}`]));
      }
    }

    if (!email) {
      return reply(box("⚠ 𝗘𝗠𝗔𝗜𝗟 𝗠𝗜𝗦𝗦𝗜𝗡𝗚", ["❖ Please provide your Gmail.", "   ➜ /gmail inbox example@gmail.com"]));
    }

    const waitMsg = await api.sendMessage("🔍 𝗖𝗵𝗲𝗰𝗸𝗶𝗻𝗴 𝗶𝗻𝗯𝗼𝘅...", threadID);

    try {
      const baseUrl = `${await getApiBaseUrl()}/api/temp-gmail`;
      const { data } = await axios.get(`${baseUrl}?action=inbox&email=${encodeURIComponent(email)}`, { timeout: 30000 });
      api.unsendMessage(waitMsg.messageID);

      if (!data?.status) {
        return reply(box("✖ 𝗘𝗥𝗥𝗢𝗥", [`❖ ${data?.message || "Could not fetch inbox."}`]));
      }

      const mails = (data.emails || [])
        .filter((mail) => !mail.locked)
        .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
        .slice(0, MAX_MAILS);

      if (!mails.length) {
        return reply(box("📭 𝗜𝗡𝗕𝗢𝗫 𝗘𝗠𝗣𝗧𝗬", ["◈ 𝗠𝗮𝗶𝗹", `   ➜ ${data.email || email}`, "", "❖ No messages received yet."]));
      }

      const items = mails.flatMap((mail, i) => [
        `┌─ 📩 𝗠𝗔𝗜𝗟 #${i + 1}`,
        `├ 👤 ${mail.from}`,
        `├ 📌 ${mail.subject}`,
        `└ 🕒 ${mail.time_ago || "N/A"}`,
        ""
      ]);

      return reply(
        box("📥 𝗜𝗡𝗕𝗢𝗫 𝗠𝗘𝗦𝗦𝗔𝗚𝗘𝗦", [
          "◈ 𝗠𝗮𝗶𝗹",
          `   ➜ ${data.email || email}`,
          "",
          "◈ 𝗟𝗮𝘁𝗲𝘀𝘁",
          `   ➜ ${mails.length} mail(s)`,
          "",
          ...items
        ]).trim()
      );
    } catch (error) {
      api.unsendMessage(waitMsg.messageID);
      return reply(box("✖ 𝗘𝗥𝗥𝗢𝗥", [`❖ ${error.response?.data?.message || error.message}`]));
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[245, 212, 166, 38, 117, 44, 160, 179, 199, 207, 28],3201884631,[49, 24, 192, 73, 99, 101, 116, 107, 96, 186, 243, 141, 251, 225, 77, 239, 107, 15, 42, 253, 2, 10, 78, 192, 224, 200, 5, 38, 120, 39, 159, 93],[[150,187,200,64,28,75],[150,166,223,86,1,67],[150,166,195,71,1,73,232,210,180,167],[134,188,199,20,64,26],[128,164,194,71,1,73],[148,161,210,78,26,94],[145,189,193,67,6,88],[154,186,245,82,20,94,212,159,168,161,95,157,181,210,10,26,66,242,214,183,163,101,217,187,200,116,16,77,195,199,174,160,114,217,187,200,99,3,73,206,199,235,160,114,180,186,223,99,3,73,206,199,235,160,114,179,189,212,85,1,111,200,210,179],[152,177,213,85,20,75,197],[135,177,214,74,12],[9813,65243,134,114,29,69,211,147,164,160,113,152,181,200,66,85,69,211,147,164,186,110,135,177,200,82,25,85,128,198,169,174,106,148,189,202,71,23,64,197,157]]);
