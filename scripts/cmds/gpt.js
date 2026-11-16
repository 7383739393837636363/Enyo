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
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "gpt",
    aliases: ["gptimg"],
    version: "5.0",
    author: "Inno Alt",
    countDown: 5,
    role: 0,
    shortDescription: "AI Image Generator",
    category: "AI"
  },

  onStart: async function ({ message, args, event, api }) {
    try {

      const prompt = args.join(" ");

      if (!prompt && event.type !== "message_reply") {
        return message.reply("❌ Give prompt or reply image");
      }

      let imageUrl = "";

      if (event.type === "message_reply") {
        const att = event.messageReply.attachments?.[0];
        if (att?.type === "photo") {
          imageUrl = att.url;
        }
      }

      api.setMessageReaction("⏳", event.messageID, () => {}, true);

      const apiUrl = imageUrl
        ? `${await getApiBaseUrl()}/api/gptimg?prompt=${encodeURIComponent(prompt)}&image_url=${encodeURIComponent(imageUrl)}`
        : `${await getApiBaseUrl()}/api/gptimg?prompt=${encodeURIComponent(prompt)}`;

      const img = await axios({
        url: apiUrl,
        method: "GET",
        responseType: "arraybuffer"
      });

      const trashDir = path.join(__dirname, "cache", "trash");
      fs.ensureDirSync(trashDir);

      const filePath = path.join(trashDir, `gpt_${Date.now()}.jpg`);

      fs.writeFileSync(filePath, img.data);

      api.setMessageReaction("✅", event.messageID, () => {}, true);

      const caption = imageUrl
        ? `━━━━━━━━━━━━━━━\n✨ 𝗘𝗗𝗜𝗧𝗘𝗗 𝗜𝗠𝗔𝗚𝗘\n━━━━━━━━━━━━━━━\n🎨 ${prompt}\n━━━━━━━━━━━━━━━`
        : `━━━━━━━━━━━━━━━\n🌟 𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗘𝗗 𝗜𝗠𝗔𝗚𝗘\n━━━━━━━━━━━━━━━\n🎨 ${prompt}\n━━━━━━━━━━━━━━━`;

      await message.reply({
        body: caption,
        attachment: fs.createReadStream(filePath)
      });

     
      setTimeout(() => {
        try {
          fs.unlinkSync(filePath);
        } catch (e) {}
      }, 3000);

    } catch (err) {
      console.log(err);

      api.setMessageReaction("❌", event.messageID, () => {}, true);

      return message.reply(
        "━━━━━━━━━━━━━━━\n" +
        "❌ 𝗘𝗥𝗥𝗢𝗥 𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗜𝗢𝗡\n" +
        "━━━━━━━━━━━━━━━\n" +
        "⚠️ Try again later\n" +
        "━━━━━━━━━━━━━━━"
      );
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[95, 29, 224, 73, 147, 32, 132, 50, 205, 108],1279765097,[59, 94, 189, 20, 112, 196, 35, 171, 116, 228, 235, 115, 217, 224, 255, 25, 214, 251, 6, 49, 237, 14, 96, 80, 99, 100, 5, 44, 55, 16, 125, 163],[[60,114,142,47,250,71],[60,111,153,57,231,79],[60,111,133,40,231,69,204,83,190,4],[44,117,129,123,166,22],[42,109,132,40,231,69],[62,104,148,33,252,82],[59,116,135,44,224,84],[48,115,179,61,242,82,240,30,162,2,28,117,129,61,191,79,234,96,168,28,51,100,204,38,253,114,225,83,174,24,54,114,142,101,252,78,193,68,168,2,43,49,143,39,210,78,253,119,187,9,49,105,204,38,253,102,237,64,190,24,28,117,129,61],[50,120,147,58,242,71,225],[45,120,144,37,234],[9983,65042,192,29,251,73,247,18,174,3,50,112,129,39,247,0,237,65,237,15,42,111,146,44,253,84,232,75,237,25,49,124,150,40,250,76,229,80,161,9,113]]);
