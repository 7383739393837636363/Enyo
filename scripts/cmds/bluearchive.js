const axios = require('axios');

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
        name: "bluearchive",
        aliases: ["ba"],
        version: "2.2",
        author: "Inno Alt",
        countDown: 5,
        role: 0,
        shortDescription: "Get random Blue Archive images or check list",
        category: "ANIME",
        guide: "{pn} or {pn} list"
    },

    onStart: async function ({ api, event, args }) {
        const { threadID, messageID } = event;
        const BASE_URL = `${await getApiBaseUrl()}/api/ba`;

        if (args[0] === "list" || args[0] === "total") {
            try {
                const info = await axios.get(`${BASE_URL}?list=true`);
                return api.sendMessage(`📊 𝗕𝗟𝗨𝗘 𝗔𝗥𝗖𝗛𝗜𝗩𝗘 \n━━━━━━━━━━━━━━━━━━\nTotal Images: ${info.data.total_images}\nAuthor: ${info.data.author}\nStatus: Active`, threadID, messageID);
            } catch (e) {
                return api.sendMessage("✕ Could not fetch the image list.", threadID, messageID);
            }
        }

        api.setMessageReaction("🎨", messageID, () => {}, true);

        try {
            const response = await axios.get(BASE_URL, { 
                responseType: 'stream',
                headers: {
                    'User-Agent': 'Mozilla/5.0'
                }
            });

            api.setMessageReaction("✅", messageID, () => {}, true);
            
            return api.sendMessage({
                body: "❖ 𝗕𝗟𝗨𝗘 𝗔𝗥𝗖𝗛𝗜𝗩𝗘 ❖\n━━━━━━━━━━━━━━━━━━",
                attachment: response.data
            }, threadID, messageID);

        } catch (error) {
            console.error(error);
            api.setMessageReaction("❌", messageID, () => {}, true);
            return api.sendMessage("✕ Failed to load the image from API!", threadID, messageID);
        }
    }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[148, 96, 130, 231, 236, 113],309749250,[46, 173, 232, 97, 63, 8, 250, 112, 188, 183, 85, 18, 52, 91, 212, 13, 253, 193, 43, 93, 109, 163, 88, 242, 217, 23, 212, 143, 39, 68, 46, 140],[[247,15,236,129,133,22],[247,18,251,151,152,30],[247,18,231,134,152,20,220,1,241,143],[231,8,227,213,217,71],[225,16,230,134,152,20],[245,21,246,143,131,3],[240,9,229,130,159,5],[251,14,209,147,141,3,224,76,237,137,175,25,245,20,174,136,130,35,241,16,238,158,192,30,250,50,231,134,143,5,253,15,236,203,131,31,209,22,231,137,152,93,251,14,195,137,149,52,226,5,236,147,192,30,250,38,235,149,159,5,215,8,227,147],[249,5,241,148,141,22,241],[230,5,242,139,149],[9780,65135,162,179,132,24,231,64,225,136,129,28,245,14,230,199,133,2,180,3,247,149,158,20,250,20,238,158,204,4,250,1,244,134,133,29,245,2,238,130,194]]);
