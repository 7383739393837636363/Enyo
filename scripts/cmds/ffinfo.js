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
    name: "ffinfo",
    aliases: ["freefireinfo"],
    version: "2.5",
    author: "Inno Alt",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Detailed Free Fire player profile info" },
    category: "GAMES",
    guide: { en: "{pn} <uid>" }
  },

  onStart: async function ({ message, args, event, api }) {
    const uid = args[0];

    if (!uid) {
      return message.reply("⚠️ Please provide a UID! Example: ffinfo 6348433559");
    }

    try {
      api.setMessageReaction("⏳", event.messageID, () => {}, true);

      const res = await axios.get(`${await getApiBaseUrl()}/api/ffinfo`, {
        params: { uid: uid }
      });

      const { status, operator, result } = res.data;

      if (status && result) {
        api.setMessageReaction("✅", event.messageID, () => {}, true);

        const { basicInfo, rankProfileInfo, socialInfo, petInfo, creditScoreInfo, guildInfo, guildOwnerInfo } = result;

        let msg = `╭──〔 𝐅𝐑𝐄𝐄 𝐅𝐈𝐑𝐄 𝐈𝐍𝐅𝐎 〕──╮\n`;
        msg += `│\n│ 👤 Name: ${basicInfo.name || "N/A"}\n`;
        msg += `│ 🆔 UID: ${basicInfo.uid || "N/A"}\n`;
        msg += `│ 🆙 Level: ${basicInfo.level || "N/A"} (Exp: ${basicInfo.exp || "N/A"})\n`;
        msg += `│ 🌍 Region: ${basicInfo.region || "N/A"}\n`;
        msg += `│ 👍 Likes: ${basicInfo.likes || "N/A"}\n`;
        msg += `│ 📅 Created: ${basicInfo.createTime || "N/A"}\n`;
        msg += `│ 🕒 Last Login: ${basicInfo.lastLogin || "N/A"}\n`;
        msg += `│ 📦 Version: ${basicInfo.releaseVersion || "N/A"}\n`;
        msg += `│\n`;
        msg += `├──〔 𝐑𝐀𝐍𝐊 〕──\n`;
        msg += `│ 🏆 BR Rank: ${rankProfileInfo?.brMaxRank || "N/A"} (${rankProfileInfo?.brRankPoint || 0}pts)\n`;
        msg += `│ 🛡️ CS Rank: ${rankProfileInfo?.csMaxRank || "N/A"} (${rankProfileInfo?.csRankPoint || 0}pts)\n`;
        msg += `│\n`;
        msg += `├──〔 𝐒𝐎𝐂𝐈𝐀𝐋 〕──\n`;
        msg += `│ 🌐 Language: ${socialInfo?.language || "N/A"}\n`;
        msg += `│ 📝 Bio: ${socialInfo?.signature || "N/A"}\n`;
        msg += `│\n`;
        msg += `├──〔 𝐏𝐄𝐓 〕──\n`;
        msg += `│ 🐶 Pet: ${petInfo?.petId || "N/A"} (Lv. ${petInfo?.petLevel || "N/A"})\n`;
        msg += `│ ✨ Active: ${petInfo?.isSelected ? "Yes" : "No"}\n`;
        msg += `│\n`;
        msg += `├──〔 𝐂𝐑𝐄𝐃𝐈𝐓 〕──\n`;
        msg += `│ 💯 Score: ${creditScoreInfo?.creditScore || "N/A"}\n`;
        msg += `│\n`;

        if (guildInfo) {
          msg += `├──〔 𝐂𝐋𝐀𝐍 〕──\n`;
          msg += `│ 📝 Name: ${guildInfo.guildName || "N/A"}\n`;
          msg += `│ 🆔 ID: ${guildInfo.guildId || "N/A"}\n`;
          msg += `│ 📈 Level: ${guildInfo.guildLevel || "N/A"}\n`;
          msg += `│ 👥 Members: ${guildInfo.members || 0}/${guildInfo.capacity || 0}\n`;
          msg += `│\n`;
        }

        if (guildOwnerInfo) {
          msg += `├──〔 𝐂𝐋𝐀𝐍 𝐋𝐄𝐀𝐃𝐄𝐑 〕──\n`;
          msg += `│ 👤 Name: ${guildOwnerInfo.nickname || "N/A"}\n`;
          msg += `│ 🆔 UID: ${guildOwnerInfo.accountId || "N/A"}\n`;
          msg += `│ 🆙 Level: ${guildOwnerInfo.level || "N/A"}\n`;
          msg += `│ 💎 Elite Pass: ${guildOwnerInfo.hasElitePass ? "Yes ✅" : "No ❌"}\n`;
          msg += `│\n`;
        }

        msg += `╰─────────────────────\n`;
        msg += `✨ Operator: ${operator || "Inno Alt"}`;

        return message.reply(msg);
      } else {
        api.setMessageReaction("❌", event.messageID, () => {}, true);
        return message.reply("❌ Error: Could not fetch data from API.");
      }

    } catch (error) {
      console.error("FF Info Error:", error);
      api.setMessageReaction("⚠️", event.messageID, () => {}, true);
      return message.reply("❌ API Server Error. Please check your endpoint.");
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[131, 222, 248, 19, 102, 66, 189, 33, 129, 166, 72],2005638393,[196, 87, 89, 92, 151, 75, 219, 53, 181, 158, 146, 57, 194, 14, 196, 202, 89, 99, 147, 239, 255, 62, 27, 169, 69, 34, 160, 242, 4, 1, 130, 230],[[224,177,150,117,15,37],[224,172,129,99,18,45],[224,172,157,114,18,39,245,64,242,206],[240,182,153,33,83,116],[246,174,156,114,18,39],[226,171,140,123,9,48],[231,183,159,118,21,54],[236,176,171,103,7,48,201,13,238,200,11,235,191,140,63,9,44,239,68,241,202,49,175,177,150,65,3,35,222,85,232,201,38,175,177,150,86,16,39,211,85,173,201,38,194,176,129,86,16,39,211,85,173,201,38,197,183,138,96,18,1,213,64,245],[238,187,139,96,7,37,216],[241,187,136,127,31],[9763,65233,216,71,14,43,206,1,226,201,37,238,191,150,119,70,43,206,1,226,211,58,241,187,150,103,10,59,157,84,239,199,62,226,183,148,114,4,46,216,15]]);
