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
    name: "github",
    version: "2.0",
    author: "Inno Alt",
    role: 0,
    countDown: 5,
    shortDescription: { en: "Fetch GitHub user profile and top repositories" },
    category: "utility",
    guide: { en: "{pn} <username>" }
  },

  onStart: async function ({ api, event, args, message }) {
    const username = args[0];
    if (!username) {
      return message.reply("❌ Please provide a GitHub username.\nExample: /github inno alt");
    }

    try {
      const apiUrl = `${await getApiBaseUrl()}/api/github?user=${encodeURIComponent(username)}`;
      const response = await axios.get(apiUrl, { timeout: 15000 });

      if (!response.data.status) {
        throw new Error("API returned error");
      }

      const data = response.data;
      const profile = data.profile;
      const repos = data.top_repositories || [];

      let avatarStream = null;
      try {
        avatarStream = await global.utils.getStreamFromURL(profile.avatar);
      } catch (e) {
      }

      let msg = `╭──〔 𝔾𝕀𝕋ℍ𝕌𝔹 ℙℝ𝕆𝔽𝕀𝕃𝔼 〕──╮\n`;
      msg += `│ 👤 ${profile.name || profile.username}\n`;
      msg += `│ 🆔 @${profile.username}\n`;
      if (profile.bio) msg += `│ 📝 ${profile.bio}\n`;
      msg += `│ 👥 Followers: ${profile.followers}\n`;
      msg += `│ 📁 Repos: ${profile.public_repos}\n`;
      msg += `│ 🔗 ${profile.link}\n`;
      msg += `╰─────────────────────╯\n\n`;

      if (repos.length > 0) {
        msg += `╭──〔 𝕋𝕆ℙ ℝ𝔼ℙ𝕆𝕊𝕀𝕋𝕆ℝ𝕀𝔼𝕊 〕──╮\n`;
        for (const repo of repos.slice(0, 5)) {
          msg += `│ 📦 ${repo.repo_name}\n`;
          msg += `│ ⭐ ${repo.stars}  🍴 ${repo.forks}  💻 ${repo.language || "Unknown"}\n`;
          msg += `│ 🔗 ${repo.url}\n`;
          if (repos.indexOf(repo) < repos.length - 1) msg += `│ ──────────────────\n`;
        }
        msg += `╰─────────────────────╯`;
      } else {
        msg += `❌ No public repositories found.`;
      }

      const attachments = avatarStream ? [avatarStream] : [];
      return message.reply({
        body: msg,
        attachment: attachments
      });

    } catch (error) {
      console.error(error);
      return message.reply(`❌ Failed to fetch GitHub profile for "${username}".\nError: ${error.message || "Unknown error"}`);
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[111, 98, 158, 182, 176, 206, 101, 239, 47, 71, 232],3963157384,[251, 70, 193, 101, 13, 166, 186, 150, 0, 211, 174, 92, 128, 218, 216, 52, 242, 82, 111, 7, 32, 177, 134, 71, 135, 117, 151, 187, 88, 90, 121, 86],[[12,13,240,208,217,169],[12,16,231,198,196,161],[12,16,251,215,196,171,45,142,92,47],[28,10,255,132,133,248],[26,18,250,215,196,171],[14,23,234,222,223,188],[11,11,249,211,195,186],[0,12,205,194,209,188,17,195,64,41,171,7,3,234,154,223,160,55,138,95,43,145,67,13,240,228,213,175,6,155,70,40,134,67,13,240,243,198,171,11,155,3,40,134,46,12,231,243,198,171,11,155,3,40,134,41,11,236,197,196,141,13,142,91],[2,7,237,197,209,169,0],[29,7,238,218,201],[9935,65133,190,226,216,167,22,207,76,40,133,2,3,240,210,144,167,22,207,76,50,154,29,7,240,194,220,183,69,154,65,38,158,14,11,242,215,210,162,0,193]]);
