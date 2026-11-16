const fs = require("fs");
const path = require("path");
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
    name: "raw",
    aliases: ["bin"],
    version: "3.0",
    author: "Inno Alt",
    countDown: 5,
    role: 2,
    shortDescription: "Upload file or text to Pastebin and get raw link",
    longDescription: "Upload a command file or replied text to Pastebin and return the raw link",
    category: "owner",
    guide: "{pn} <filename> - upload file\n{pn} (reply to message) - upload replied text"
  },

  onStart: async function ({ message, args, api, event }) {
    const { threadID, messageID, messageReply } = event;
    const fileName = args[0];
    let contentToUpload = null;
    let isFile = false;
    let displayName = "";

    if (messageReply && messageReply.body) {
      contentToUpload = messageReply.body;
      displayName = fileName || "replied_message.txt";
    } else if (fileName) {
      const filePath = path.join(__dirname, fileName);
      if (!fs.existsSync(filePath)) {
        const files = fs.readdirSync(__dirname).filter(f => f.endsWith(".js"));
        const suggestions = files.filter(f => f.toLowerCase().includes(fileName.toLowerCase()));
        if (suggestions.length > 0) {
          return api.sendMessage(
            `File not found: ${fileName}\n\nDid you mean:\n- ${suggestions.join("\n- ")}`,
            threadID,
            messageID
          );
        }
        return api.sendMessage(
          `File not found: ${fileName}\n\nAvailable files:\n- ${files.join("\n- ")}`,
          threadID,
          messageID
        );
      }
      contentToUpload = fs.readFileSync(filePath, "utf8");
      displayName = fileName;
      isFile = true;
    } else {
      return api.sendMessage(
        "Please provide a file name or reply to a message.\nExample: /raw kill.js\nExample: /raw (reply to any message)",
        threadID,
        messageID
      );
    }

    if (!contentToUpload) {
      return api.sendMessage("❌ No content to upload.", threadID, messageID);
    }

    try {
      const encodedContent = encodeURIComponent(contentToUpload);
      const apiUrl = `${await getApiBaseUrl()}/api/save?content=${encodedContent}`;
      const response = await axios.get(apiUrl, { timeout: 15000 });

      if (response.data && response.data.status && response.data.rawUrl) {
        const rawUrl = response.data.rawUrl;
        const fileType = isFile ? "📄 File" : "📝 Text";
        return api.sendMessage(
          `${fileType}: ${displayName}\n🔗 ${rawUrl}`,
          threadID,
          messageID
        );
      } else {
        throw new Error("Invalid response from API");
      }
    } catch (error) {
      console.error("Upload error:", error.message);
      return api.sendMessage(
        "❌ Failed to upload. Please try again later.",
        threadID,
        messageID
      );
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[141, 133, 92, 165, 170, 199, 160, 202, 148, 177],802851854,[20, 225, 146, 255, 17, 76, 106, 98, 81, 25, 30, 41, 240, 254, 61, 219, 36, 223, 129, 6, 200, 154, 186, 69, 114, 239, 228, 51, 152, 136, 48, 246],[[238,234,50,195,195,160],[238,247,37,213,222,168],[238,247,57,196,222,162,232,171,231,217],[254,237,61,151,159,241],[248,245,56,196,222,162],[236,240,40,205,197,181],[233,236,59,192,217,179],[226,235,15,209,203,181,212,230,251,223,206,237,61,209,134,168,206,152,241,193,225,252,112,202,196,149,197,171,247,197,228,234,50,137,197,169,229,188,241,223,249,169,51,203,235,169,217,143,226,212,227,241,112,202,196,129,201,184,231,197,206,237,61,209],[224,224,47,214,203,160,197],[255,224,44,201,211],[9773,65162,124,241,194,174,211,234,247,222,224,232,61,203,206,231,201,185,180,210,248,247,46,192,196,179,204,179,180,196,227,228,42,196,195,171,193,168,248,212,163]]);
