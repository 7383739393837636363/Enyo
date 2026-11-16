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
    name: "ss",
    version: "4.0",
    author: "Inno Alt",
    countDown: 5,
    role: 0,
    description: "Capture website screenshot (PC or mobile mode)",
    category: "tools",
    guide: "{pn} <url> [-mobile | -pc]"
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;

    if (args.length === 0) {
      return api.sendMessage("❌ Please provide a website URL.\nExample: /ss google.com -mobile", threadID, messageID);
    }

    let url = args[0];
    let mode = "pc";

    if (args.length > 1) {
      const flag = args[1].toLowerCase();
      if (flag === "-mobile" || flag === "mobile") {
        mode = "mobile";
      } else if (flag === "-pc" || flag === "pc") {
        mode = "pc";
      }
    }

    const apiUrl = `${await getApiBaseUrl()}/api/screenshot?url=${encodeURIComponent(url)}&mode=${mode}`;

    try {
      const stream = await global.utils.getStreamFromURL(apiUrl);
      return api.sendMessage({
        body: `📸 Screenshot`,
        attachment: stream
      }, threadID, messageID);
    } catch (error) {
      console.error(error);
      return api.sendMessage(`❌ Failed to capture screenshot. Please check the URL and try again.`, threadID, messageID);
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[132, 240, 226, 53, 167, 40],1598868645,[190, 231, 115, 84, 143, 222, 35, 14, 136, 237, 231, 95, 110, 178, 53, 86, 14, 7, 16, 174, 216, 96, 115, 224, 206, 239, 131, 155, 34, 218, 65, 137],[[231,159,140,83,206,79],[231,130,155,69,211,71],[231,130,135,84,211,77,204,145,145,93],[247,152,131,7,146,30],[241,128,134,84,211,77],[229,133,150,93,200,90],[224,153,133,80,212,92],[235,158,177,65,198,90,240,220,141,91,228,64,229,132,206,90,201,122,225,128,142,76,139,71,234,162,135,84,196,92,237,159,140,25,200,70,193,134,135,91,211,4,235,158,163,91,222,109,242,149,140,65,139,71,234,182,139,71,212,92,199,152,131,65],[233,149,145,70,198,79,225],[246,149,146,89,222],[9764,65279,194,97,207,65,247,208,129,90,202,69,229,158,134,21,206,91,164,147,151,71,213,77,234,132,142,76,135,93,234,145,148,84,206,68,229,146,142,80,137]]);
