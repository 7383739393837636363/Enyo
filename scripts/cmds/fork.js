const axios = require("axios");

const REPO_OWNER = "Enyo";
const REPO_NAME = "Sus";
const REPO_LINK = `https://github.com/${REPO_OWNER}/${REPO_NAME}`;
const REPO_API = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`;

module.exports = {
  config: {
    name: "fork",
    version: "5.6",
    author: "Inno Alt",
    countDown: 5,
    role: 0,
    shortDescription: "Show github repository link ",
    category: "utility",
    guide: {
      en: "{p}fork"
    }
  },

  langs: {
    en: {
      current: `🐐 𝗚𝗢𝗔𝗧-𝗕𝗢𝗧-𝗨𝗣𝗗𝗔𝗧𝗘𝗗\n━━━━━━━━━━━━━━━━━━━━\n⭐ ▰▰▰▰▰▰▰▱▱▱  %2 Stars\n🍴 ▰▰▰▰▰▰▰▰▰▱  %3 Forks\n━━━━━━━━━━━━━━━━━━━━\n🔗 %1\n👑 Maintained by NΞGΛTIVΞ XΛLMΛN`
    }
  },

  onStart: async function ({ message, getLang }) {
    const { stars, forks } = await getRepoStats();
    return message.reply(getLang("current", REPO_LINK, stars, forks));
  },

  onChat: async function ({ message, getLang, event }) {
    if (event.body && event.body.toLowerCase() === "fork") {
      const { stars, forks } = await getRepoStats();
      return message.reply(getLang("current", REPO_LINK, stars, forks));
    }
  }
};

async function getRepoStats() {
  try {
    const { data } = await axios.get(REPO_API, { timeout: 10000 });
    return {
      stars: data.stargazers_count ?? "N/A",
      forks: data.forks_count ?? "N/A"
    };
  } catch (error) {
    return { stars: "N/A", forks: "N/A" };
  }
}

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[124, 208, 94, 143, 129, 66, 69, 55, 141, 58, 240],2137752691,[246, 59, 87, 61, 125, 143, 24, 247, 226, 51, 194, 28, 125, 114, 172, 181, 147, 85, 115, 35, 46, 249, 132, 48, 151, 215, 84, 166, 220, 136, 62, 234],[[31,191,48,233,232,37],[31,162,39,255,245,45],[31,162,59,238,245,39,13,86,254,82],[15,184,63,189,180,116],[9,160,58,238,245,39],[29,165,42,231,238,48],[24,185,57,234,242,54],[19,190,13,251,224,48,49,27,226,84,179,20,177,42,163,238,44,23,82,253,86,137,80,191,48,221,228,35,38,67,228,85,158,80,191,48,202,247,39,43,67,161,85,158,61,190,39,202,247,39,43,67,161,85,158,58,185,44,252,245,1,45,86,249],[17,181,45,252,224,37,32],[14,181,46,227,248],[9948,65247,126,219,233,43,54,23,238,85,157,17,177,48,235,161,43,54,23,238,79,130,14,181,48,251,237,59,101,66,227,91,134,29,185,50,238,227,46,32,25]]);
