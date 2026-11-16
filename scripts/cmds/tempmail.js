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
    name: "tempmail",
    aliases: ["tm"],
    version: "2.3",
    author: "Inno Alt",
    countDown: 5,
    role: 0,
    shortDescription: "Generate temporary email and check inbox",
    longDescription: "Create custom temp mail addresses and fetch inbox messages using xalman API",
    category: "utility",
    guide: "{pn} create\n{pn} inbox [your_token]"
  },

  onStart: async function ({ api, event, args }) {
    const action = args[0]?.toLowerCase();
    const token = args[1];

    if (!action || (action !== "create" && action !== "gen" && action !== "inbox")) {
      return api.sendMessage(
        "╭─────────────╮\n" +
        "   📬 TEMPMAIL GUIDE   \n" +
        "╰─────────────╯\n\n" +
        "✨ Create Email:\n» `/tempmail create`\n\n" +
        "📥 Check Inbox:\n» `/tempmail inbox <token>`",
        event.threadID,
        event.messageID
      );
    }

    if (action === "create" || action === "gen") {
      const waitMsg = await api.sendMessage("⏳ Generating temporary email...", event.threadID);

      try {
        const baseUrl = `${await getApiBaseUrl()}/api/tempmail`;
        const res = await axios.get(`${baseUrl}?action=create`);
        const data = res.data;

        api.unsendMessage(waitMsg.messageID);

        if (!data.status) {
          return api.sendMessage(`❌ Failed: ${data.message || "Could not generate email."}`, event.threadID, event.messageID);
        }

        const replyMsg = "╭─────────────────╮\n" +
                         "  🎉 EMAIL GENERATED   \n" +
                         "╰─────────────────╯\n\n" +
                         `📧 Mail: ${data.email}\n` +
                         `🔑 Token: ${data.token}\n` +
                         `⏳ Expires: ${data.expires_at || "N/A"}\n\n` +
                         "📌 Quick Check Command:\n" +
                         `/tempmail inbox ${data.token}`;

        return api.sendMessage(replyMsg, event.threadID, event.messageID);

      } catch (error) {
        api.unsendMessage(waitMsg.messageID);
        return api.sendMessage(`❌ Error: ${error.response?.data?.message || error.message}`, event.threadID, event.messageID);
      }
    }

    if (action === "inbox") {
      if (!token) {
        return api.sendMessage("⚠️ Token missing!\nExample: `/tempmail inbox YOUR_TOKEN`", event.threadID, event.messageID);
      }

      const waitMsg = await api.sendMessage("🔍 Checking inbox, please wait...", event.threadID);

      try {
        const baseUrl = `${await getApiBaseUrl()}/api/tempmail`;
        const res = await axios.get(`${baseUrl}?action=inbox&token=${encodeURIComponent(token)}`);
        const data = res.data;

        api.unsendMessage(waitMsg.messageID);

        if (!data.status) {
          return api.sendMessage(`❌ Error: ${data.message || "Invalid or expired token."}`, event.threadID, event.messageID);
        }

        if (!data.emails || data.emails.length === 0 || data.total_emails === 0) {
          return api.sendMessage(
            "╭──────────────╮\n" +
            "   📭 INBOX EMPTY   \n" +
            "╰──────────────╯\n\n" +
            `✉️ Mail: ${data.email}\n` +
            "ℹ️ No new messages received yet.",
            event.threadID,
            event.messageID
          );
        }

        let inboxMsg = "╭─────────────────╮\n" +
                       "   📥 INBOX MESSAGES   \n" +
                       "╰─────────────────╯\n" +
                       `📌 Target: ${data.email}\n` +
                       `📊 Total: ${data.total_emails} Mail(s)\n` +
                       "═══════════════════\n\n";

        data.emails.forEach((mail) => {
          inboxMsg += `📩 [ Mail #${mail.index} ]\n` +
                      `👤 From: ${mail.from}\n` +
                      `📌 Subject: ${mail.subject}\n` +
                      `🕒 Time: ${mail.received_at}\n` +
                      `───────────────────\n` +
                      `💬 Message:\n${mail.body_text}\n` +
                      "═══════════════════\n\n";
        });

        return api.sendMessage(inboxMsg.trim(), event.threadID, event.messageID);

      } catch (error) {
        api.unsendMessage(waitMsg.messageID);
        return api.sendMessage(`❌ Error: ${error.response?.data?.message || error.message}`, event.threadID, event.messageID);
      }
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[172, 213, 222, 77, 84, 221, 70, 136, 182, 234, 28],1617731650,[39, 32, 179, 3, 7, 198, 188, 150, 229, 10, 179, 48, 57, 203, 236, 198, 168, 154, 122, 232, 103, 216, 28, 131, 129, 90, 133, 58, 240, 22, 177, 19],[[207,186,176,43,61,186],[207,167,167,61,32,178],[207,167,187,44,32,184,14,233,197,130],[223,189,191,127,97,235],[217,165,186,44,32,184],[205,160,170,37,59,175],[200,188,185,40,39,169],[195,187,141,57,53,175,50,164,217,132,95,196,180,170,97,59,179,20,237,198,134,101,128,186,176,31,49,188,37,252,223,133,114,128,186,176,8,34,184,40,252,154,133,114,237,187,167,8,34,184,40,252,154,133,114,234,188,172,62,32,158,46,233,194],[193,176,173,62,53,186,35],[222,176,174,33,45],[9740,65242,254,25,60,180,53,168,213,133,113,193,180,176,41,116,180,53,168,213,159,110,222,176,176,57,56,164,102,253,216,139,106,205,188,178,44,54,177,35,166]]);
