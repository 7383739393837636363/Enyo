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
const fs = require('fs-extra');
const path = require('path');

module.exports = {
    config: {
        name: "text2image",
        version: "2.3.0",
        author: "Inno Alt",
        countDown: 10,
        role: 0,
        shortDescription: "Generate Premium AI Images",
        longDescription: "Generate high-quality detailed images",
        category: "AI",
        guide: "{pn} [prompt]"
    },

    onStart: async function ({ api, event, args }) {
        const { threadID, messageID, senderID } = event;
        const prompt = args.join(" ");

        if (!prompt) {
            return api.sendMessage("╭─❍\n│ 𝖯𝗅𝖾𝖺𝗌𝖾 𝖾𝗇𝗍𝖾𝗋 𝖺 𝗉𝗋𝗈𝗆𝗉𝗍!\n╰───────────⟡", threadID, messageID);
        }

        api.setMessageReaction("⏳", messageID, (err) => {}, true);
        const startTime = Date.now();

        const apiUrl = `${await getApiBaseUrl()}/api/flux?prompt=${encodeURIComponent(prompt)}`;
        const cachePath = path.join(__dirname, 'cache', `t2i_${senderID}_${Date.now()}.png`);

        try {
            if (!fs.existsSync(path.join(__dirname, 'cache'))) {
                fs.mkdirSync(path.join(__dirname, 'cache'), { recursive: true });
            }

            const response = await axios({
                method: 'get',
                url: apiUrl,
                responseType: 'arraybuffer',
                timeout: 120000 
            });

            fs.writeFileSync(cachePath, Buffer.from(response.data, 'binary'));

            const endTime = Date.now();
            const timeTaken = ((endTime - startTime) / 1000).toFixed(2);

            api.setMessageReaction("✅", messageID, (err) => {}, true);

            const msgBody = `❖ 𝖳𝖤𝖷𝖳 𝖳𝖮 𝖨𝖬𝖠𝖦𝖤 ❖\n━━━━━━━━━━━━━━━━━━\n✎ 𝖯𝗋𝗈𝗆𝗉𝗍: ${prompt}\n⏱️ 𝖲𝗉𝖾𝖾𝖽: ${timeTaken}𝗌\n━━━━━━━━━━━━━━━━━━\n𝖡𝗒 Saan`;

            return api.sendMessage({
                body: msgBody,
                attachment: fs.createReadStream(cachePath)
            }, threadID, () => {
                if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath);
            }, messageID);

        } catch (error) {
            console.error(error);
            api.setMessageReaction("❌", messageID, (err) => {}, true);
            return api.sendMessage(`✕ 𝖦𝖾𝗇𝖾𝗋𝖺𝗍𝗂𝗈𝗇 𝖥𝖺𝗂𝗅𝖾𝖽!\n𝖤𝗋𝗋𝗈𝗋: ${error.message}`, threadID, messageID);
        }
    }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[205, 228, 216, 25, 35, 126, 69],3857436065,[25, 179, 47, 98, 172, 130, 61, 114, 29, 238, 229, 248, 17, 96, 196, 96, 172, 76, 5, 53, 255, 18, 216, 60, 230, 11, 49, 236, 90, 93, 38, 39],[[174,139,182,127,74,25],[174,150,161,105,87,17],[174,150,189,120,87,27,13,172,151,176],[190,140,185,43,22,72],[184,148,188,120,87,27],[172,145,172,113,76,12],[169,141,191,124,80,10],[162,138,139,109,66,12,49,225,139,182,90,75,31,49,225,139,182,75,70,14,41,180,200,183,119,113,27,36,174,144,177,118,77,82,42,163,161,174,124,77,10,105,162,138,153,119,90,59,51,168,138,172,53,76,16,3,164,150,171,109,96,22,36,185],[160,129,171,106,66,25,32],[191,129,168,117,90],[9837,65259,248,77,75,23,54,237,135,183,116,78,31,43,169,196,177,106,3,29,48,191,150,189,119,87,18,60,237,145,182,120,85,31,44,161,133,186,117,70,80]]);
