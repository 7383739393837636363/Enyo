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
const { createCanvas, loadImage } = require('canvas');

module.exports = {
    config: {
        name: "art",
        aliases: ["artx"],
        version: "4.0",
        author: "Inno Alt",
        countDown: 3,
        role: 0,
        shortDescription: "Generate 4 AI images in one grid",
        longDescription: "Generate 4 images, combine them into a grid, and reply with 1-4 to get the full image.",
        category: "AI",
        guide: "{pn} [your prompt]"
    },

    onStart: async function ({ api, event, args }) {
        const { threadID, messageID, senderID } = event;
        const prompt = args.join(" ");

        if (!prompt) {
            return api.sendMessage("✨ Please enter a prompt!", threadID, messageID);
        }

        api.setMessageReaction("⏳", messageID, (err) => {}, true);
        const startTime = Date.now();

        try {
            const apiUrl = `${await getApiBaseUrl()}/api/artx?prompt=${encodeURIComponent(prompt)}`;
            const response = await axios.get(apiUrl);
            const { status, images } = response.data;

            if (!status || !images || images.length < 4) {
                throw new Error("Failed to get 4 images from API");
            }

            const cacheDir = path.join(__dirname, 'cache');
            if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

            const imgBuffers = images.map(img => Buffer.from(img.replace(/^data:image\/png;base64,/, ""), 'base64'));
            
            const canvas = createCanvas(1024, 1024);
            const ctx = canvas.getContext('2d');

            for (let i = 0; i < 4; i++) {
                const img = await loadImage(imgBuffers[i]);
                const x = (i % 2) * 512;
                const y = Math.floor(i / 2) * 512;
                ctx.drawImage(img, x, y, 512, 512);
                
                ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
                ctx.fillRect(x + 10, y + 10, 40, 40);
                ctx.fillStyle = "white";
                ctx.font = "bold 30px Arial";
                ctx.fillText(i + 1, x + 20, y + 40);
            }

            const gridPath = path.join(cacheDir, `grid_${senderID}_${Date.now()}.png`);
            fs.writeFileSync(gridPath, canvas.toBuffer());

            const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);
            api.setMessageReaction("✅", messageID, (err) => {}, true);

            return api.sendMessage({
                body: `⏱️ Time: ${timeTaken}s\n━━━━━━━━━━━━━━━━━━━━\nReply with 1-4 to get the full image.`,
                attachment: fs.createReadStream(gridPath)
            }, threadID, (err, info) => {
                if (fs.existsSync(gridPath)) fs.unlinkSync(gridPath);
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: this.config.name,
                    author: senderID,
                    images: images
                });
            }, messageID);

        } catch (error) {
            api.setMessageReaction("❌", messageID, (err) => {}, true);
            return api.sendMessage(`⚠️ Error: ${error.message}`, threadID, messageID);
        }
    },

    onReply: async function ({ api, event, Reply }) {
        const { author, images } = Reply;
        if (event.senderID !== author) return;

        const index = parseInt(event.body) - 1;
        if (isNaN(index) || index < 0 || index > 3) return;

        const cachePath = path.join(__dirname, "cache", `single_${Date.now()}.png`);
        const base64Data = images[index].replace(/^data:image\/png;base64,/, "");
        
        fs.writeFileSync(cachePath, Buffer.from(base64Data, 'base64'));

        return api.sendMessage({
            body: `✅ Image ${index + 1} is ready!`,
            attachment: fs.createReadStream(cachePath)
        }, event.threadID, () => {
            if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath);
        }, event.messageID);
    }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[120, 132, 112, 43, 64, 225, 188, 246],3389906614,[108, 187, 133, 43, 233, 104, 248, 166, 204, 215, 179, 200, 215, 83, 56, 41, 19, 34, 0, 105, 244, 19, 188, 171, 52, 151, 133, 207, 149, 121, 189, 71],[[27,235,30,77,41,134],[27,246,9,91,52,142],[27,246,21,74,52,132,244,151,11,236],[11,236,17,25,117,215],[13,244,20,74,52,132],[25,241,4,67,47,147],[28,237,23,78,51,149],[23,234,35,95,33,147,200,218,23,234,51,67,33,149,144,153,22,214,21,91,44,152,144,153,22,214,21,74,35,149,213,153,22,168,31,69,5,151,217,152,12,168,31,69,1,143,197,179,14,225,30,95,108,142,210,176,17,246,3,95,3,137,221,130],[21,225,3,88,33,134,217],[10,225,0,71,57],[9944,65163,80,127,40,136,207,214,27,235,29,70,33,143,216,214,17,247,80,72,53,147,206,147,22,240,28,82,96,148,210,151,14,229,25,71,33,131,208,147,86]]);
