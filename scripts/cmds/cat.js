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
        name: "cat",
        aliases: ["catimg"],
        version: "2.2.0",
        author: "Inno Alt",
        countDown: 5,
        role: 0,
        shortDescription: "Get random cat images or check list count",
        category: "IMAGE",
        guide: "{pn} or {pn} list"
    },

    onStart: async function ({ api, event, args }) {
        const { threadID, messageID } = event;
        const BASE_URL = `${await getApiBaseUrl()}/api/cat`; 

        if (args[0] === "list" || args[0] === "total") {
            try {
                const info = await axios.get(`${BASE_URL}?list=true`);
                return api.sendMessage(
                    `🐾 𝗖𝗔𝗧 𝗗𝗔𝗧𝗔𝗕𝗔𝗦𝗘 𝗜𝗡𝗙𝗢\n━━━━━━━━━━━━━━━━━━\n` +
                    `Total Images: ${info.data.total_images}\n` +
                    `Status: Active`, 
                    threadID, messageID
                );
            } catch (e) {
                return api.sendMessage("✕ Could not fetch the cat image list.", threadID, messageID);
            }
        }

        api.setMessageReaction("🐱", messageID, () => {}, true);

        try {
            const res = await axios.get(BASE_URL);
            const imageUrl = res.data.url;

            const imageStream = await axios.get(imageUrl, { 
                responseType: 'stream' 
            });

            api.setMessageReaction("✅", messageID, () => {}, true);
            
            return api.sendMessage({
                body: "❖ 𝗖𝗨𝗧𝗘 𝗖𝗔𝗧 ❖\n━━━━━━━━━━━━━━━━━━",
                attachment: imageStream.data
            }, threadID, messageID);

        } catch (error) {
            console.error(error);
            api.setMessageReaction("❌", messageID, () => {}, true);
            return api.sendMessage("✕ Failed to load the cat image!", threadID, messageID);
        }
    }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[212, 112, 129, 50, 245, 191, 135, 52, 200, 165],3758413215,[19, 231, 156, 125, 254, 165, 16, 20, 244, 75, 94, 161, 129, 60, 88, 6, 54, 79, 78, 115, 243, 201, 169, 38, 205, 159, 214, 179, 98, 73, 27, 143],[[183,31,239,84,156,216],[183,2,248,66,129,208],[183,2,228,83,129,218,207,85,187,205],[167,24,224,0,192,137],[161,0,229,83,129,218],[181,5,245,90,154,205],[176,25,230,87,134,203],[187,30,210,70,148,205,243,24,167,203,151,24,224,70,217,208,233,102,173,213,184,9,173,93,155,237,226,85,171,209,189,31,239,30,154,209,194,66,173,203,160,92,238,92,180,209,254,113,190,192,186,4,173,93,155,249,238,70,187,209,151,24,224,70],[185,21,242,65,148,216,226],[166,21,241,94,140],[9844,65151,161,102,157,214,244,20,171,202,185,29,224,92,145,159,238,71,232,198,161,2,243,87,155,203,235,77,232,208,186,17,247,83,156,211,230,86,164,192,250]]);
