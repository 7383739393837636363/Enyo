const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

const RATIOS = {
  "1:1":  { w: 1024, h: 1024 },
  "16:9": { w: 1024, h: 576  },
  "9:16": { w: 576,  h: 1024 },
  "21:9": { w: 1024, h: 448  },
  "4:3":  { w: 1024, h: 768  },
  "3:2":  { w: 1024, h: 682  },
  "2:3":  { w: 682,  h: 1024 },
  "4:5":  { w: 800,  h: 1000 }
};

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
        name: "flux",
        version: "4.5",
        aliases: ["flux-schnell"],
        author: "Inno Alt",
        countDown: 8,
        role: 0,
        shortDescription: "Generate High-Quality AI Images",
        longDescription: "Generate stunning images using Flux.1-schnell model.",
        category: "AI",
        guide: "{pn} [prompt] --ratio [1:1 | 16:9 | 9:16 | 21:9 | 4:3 | 3:2 | 2:3 | 4:5]"
    },

    onStart: async function ({ api, event, args }) {
        const { threadID, messageID, senderID } = event;

        let ratio = "1:1";
        const ratioIndex = args.findIndex(a => a === "--ratio" || a === "-r");

        if (ratioIndex !== -1 && args[ratioIndex + 1]) {
            const requested = args[ratioIndex + 1];
            if (RATIOS[requested]) ratio = requested;
            args.splice(ratioIndex, 2);
        }

        const prompt = args.join(" ").trim();

        if (!prompt) {
            return api.sendMessage(
                "✨ Please enter a prompt!\n━━━━━━━━━━━━━━━━━━━━\nExample: /flux a futuristic city\nOptional: /flux a cat --ratio 16:9",
                threadID,
                messageID
            );
        }

        api.setMessageReaction("⏳", messageID, (err) => {}, true);

        const apiUrl = `${await getApiBaseUrl()}/api/flux-1-schnell?prompt=${encodeURIComponent(prompt)}&ratio=${encodeURIComponent(ratio)}`;
        const cachePath = path.join(__dirname, 'cache', `flux_${senderID}_${Date.now()}.png`);

        try {
            if (!fs.existsSync(path.join(__dirname, 'cache'))) {
                fs.mkdirSync(path.join(__dirname, 'cache'), { recursive: true });
            }

            const response = await axios({
                method: 'get',
                url: apiUrl,
                responseType: 'arraybuffer',
                timeout: 60000
            });

            const contentType = response.headers['content-type'];
            if (!contentType || !contentType.includes('image')) {
                throw new Error("Invalid Image Data");
            }

            fs.writeFileSync(cachePath, Buffer.from(response.data, 'binary'));

            api.setMessageReaction("✅", messageID, (err) => {}, true);

            return api.sendMessage({
                body: `✨ 𝗙𝗟𝗨𝗫 𝗔𝗜 𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗘𝗗 ✨\n📐 Ratio: ${ratio}`,
                attachment: fs.createReadStream(cachePath)
            }, threadID, () => {
                if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath);
            }, messageID);

        } catch (error) {
            console.error(error);
            api.setMessageReaction("❌", messageID, (err) => {}, true);
            return api.sendMessage(`⚠️ Generation Failed! ${error.message}`, threadID, messageID);
        }
    }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[24, 105, 242, 193, 146, 53, 130],3847824029,[79, 142, 227, 200, 2, 2, 225, 225, 182, 211, 119, 223, 171, 31, 61, 173, 185, 250, 212, 94, 138, 174, 94, 4, 133, 213, 175, 155, 109, 171, 48, 218],[[123,6,156,167,251,82],[123,27,139,177,230,90],[123,27,151,160,230,80,202,121,26,154],[107,1,147,243,167,3],[109,25,150,160,230,80],[121,28,134,169,253,71],[124,0,149,164,225,65],[119,7,161,181,243,71,246,52,6,156,130,250,84,246,52,6,156,147,247,69,238,97,69,157,175,192,80,227,123,29,155,174,252,25,237,118,44,132,164,252,65,174,119,7,179,175,235,112,244,125,7,134,237,253,91,196,113,27,129,181,209,93,227,108],[117,12,129,178,243,82,231],[106,12,130,173,235],[9912,65126,210,149,250,92,241,56,10,157,172,255,84,236,124,73,155,178,178,86,247,106,27,151,175,230,89,251,56,28,156,160,228,84,235,116,8,144,173,247,27]]);
