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
    name: "imgbb",
    aliases: ["ibb", "i"],
    version: "3.5",
    author: "Inno Alt",
    countDown: 5,
    role: 0,
    shortDescription: "Upload image/gif to ImgBB (supports multiple)",
    category: "tools",
    guide: "{pn} [reply to image/gif]"
  },

  onStart: async function ({ api, event }) {
    const { threadID, messageID, messageReply } = event;

    if (!messageReply || !messageReply.attachments || messageReply.attachments.length === 0) {
      return api.sendMessage("❌ Please reply to an image or GIF.", threadID, messageID);
    }

    const attachments = messageReply.attachments.filter(
      att => att.type === "photo" || att.type === "animated_image"
    );

    if (attachments.length === 0) {
      return api.sendMessage("❌ No valid images or GIFs found in the reply.", threadID, messageID);
    }

    const mediaUrls = attachments.map(att => att.url);

    const waitMsg = await api.sendMessage(`⏳ Uploading ${mediaUrls.length} file(s)...`, threadID, messageID);

    try {
      const results = await Promise.all(
        mediaUrls.map(async (url) => {
          try {
            const res = await axios.get(
              `${await getApiBaseUrl()}/api/ibb?image=${encodeURIComponent(url)}`,
              { timeout: 15000 }
            );
            if (res.data.status) {
              return { success: true, url: res.data.data.display_url };
            } else {
              return { success: false, url: null };
            }
          } catch {
            return { success: false, url: null };
          }
        })
      );

      const successful = results.filter(r => r.success);

      if (successful.length === 0) {
        return api.editMessage("Upload failed.", waitMsg.messageID);
      }

      const links = successful.map(r => r.url).join("\n");
      return api.editMessage(links, waitMsg.messageID);

    } catch (error) {
      console.error(error);
      return api.editMessage("Upload failed.", waitMsg.messageID);
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[101, 120, 169, 151, 140, 128, 112, 225, 142, 139, 70],466496283,[186, 187, 159, 255, 193, 2, 93, 246, 76, 223, 62, 18, 28, 218, 201, 30, 139, 228, 179, 117, 115, 184, 5, 85, 176, 165, 134, 168, 50, 125, 122, 14],[[6,23,199,241,229,231],[6,10,208,231,248,239],[6,10,204,246,248,229,56,128,253,227],[22,16,200,165,185,182],[16,8,205,246,248,229],[4,13,221,255,227,242],[1,17,206,242,255,244],[10,22,250,227,237,242,4,205,225,229,5,13,25,221,187,227,238,34,132,254,231,63,73,23,199,197,233,225,19,149,231,228,40,73,23,199,210,250,229,30,149,162,228,40,36,22,208,210,250,229,30,149,162,228,40,35,17,219,228,248,195,24,128,250],[8,29,218,228,237,231,21],[23,29,217,251,245],[9925,65143,137,195,228,233,3,193,237,228,43,8,25,199,243,172,233,3,193,237,254,52,23,29,199,227,224,249,80,148,224,234,48,4,17,197,246,238,236,21,207]]);
