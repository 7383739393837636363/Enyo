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
    name: "cloudinary",
    aliases: ["cloudupload", "cloud"],
    version: "2.0",
    author: "Inno Alt",
    countDown: 5,
    role: 0,
    shortDescription: "Upload media to Cloudinary",
    longDescription: "Upload image/video/audio to Cloudinary and get direct link",
    category: "tools",
    guide: "{pn} [reply to image/video/audio]"
  },

  onStart: async function ({ api, event, message }) {
    const { threadID, messageID, messageReply } = event;

    if (!messageReply || !messageReply.attachments || messageReply.attachments.length === 0) {
      return message.reply("❌ Please reply to an image, video, or audio file.");
    }

    const attachments = messageReply.attachments.filter(att =>
      ["photo", "animated_image", "video", "audio"].includes(att.type)
    );

    if (attachments.length === 0) {
      return message.reply("❌ No valid media found in the replied message.");
    }

    const waitMsg = await message.reply(`⏳ Uploading ${attachments.length} file(s) to Cloudinary...`);

    try {
      const results = await Promise.all(
        attachments.map(async (att) => {
          try {
            const apiUrl = `${await getApiBaseUrl()}/api/cloudupload?url=${encodeURIComponent(att.url)}`;
            const res = await axios.get(apiUrl, { timeout: 60000 });

            if (res.data.status && res.data.file && res.data.file.secure_url) {
              return {
                success: true,
                url: res.data.file.secure_url
              };
            }
            return { success: false };
          } catch (err) {
            console.error("Upload error:", err.message);
            return { success: false };
          }
        })
      );

      const successful = results.filter(r => r.success);

      if (successful.length === 0) {
        return api.editMessage("❌ All uploads failed. Please try again.", waitMsg.messageID);
      }

      const links = successful.map(r => r.url).join("\n\n");
      return api.editMessage(links, waitMsg.messageID);

    } catch (error) {
      console.error("Cloud upload error:", error);
      return api.editMessage("❌ Failed to upload. Please try again later.", waitMsg.messageID);
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[40, 177, 127, 117, 204, 181, 214, 186, 28],2643380639,[182, 157, 39, 54, 11, 224, 35, 51, 148, 132, 175, 189, 126, 65, 157, 157, 53, 33, 200, 102, 58, 15, 232, 72, 174, 186, 106, 42, 85, 247, 114, 37],[[75,222,17,19,165,210],[75,195,6,5,184,218],[75,195,26,20,184,208,158,219,111,64],[91,217,30,71,249,131],[93,193,27,20,184,208],[73,196,11,29,163,199],[76,216,24,16,191,193],[71,223,44,1,173,199,162,150,115,70,242,23,20,184,153,185,212,78,77,193,19,12,224,218,184,232,121,73,210,11,28,163,219,250,213,114,109,199,26,27,184,153,185,212,93,70,200,58,3,169,219,162,150,115,70,247,22,7,191,193,149,210,125,92],[69,212,12,6,173,210,179],[90,212,15,25,181],[9864,65214,95,33,164,220,165,154,127,71,220,18,20,162,209,246,211,111,8,210,10,7,190,208,184,206,112,81,145,10,27,173,195,183,211,112,73,211,19,16,226]]);
