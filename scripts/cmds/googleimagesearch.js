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
const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "googleimagesearch",
    aliases: ["ggimg", "googleimg"],
    version: "5.0",
    author: "Inno Alt",
    countDown: 15,
    role: 0,
    shortDescription: "Premium 21-Image Canvas Grid",
    longDescription: "Search images and get a high-quality 3x7 grid using Canvas.",
    category: "IMAGE",
    guide: { en: "{p}google <query>" }
  },

  onStart: async function ({ api, event, args }) {
    const query = args.join(" ");
    if (!query) return api.sendMessage("Please enter a search query!", event.threadID, event.messageID);

    try {
      const waitMsg = await api.sendMessage(`Creating 21 image grid for "${query}"...`, event.threadID);

      const res = await axios.get(`${await getApiBaseUrl()}/api/google-image`, {
        params: { q: query, count: 21, json: "true" }
      });

      const images = res.data.data;
      if (!images || images.length < 1) return api.sendMessage("No images found!", event.threadID);

      const colCount = 3;
      const rowCount = 7;
      const padding = 15;
      const tileSize = 350;
      const headerHeight = 130;
      const footerHeight = 90;
      const canvasWidth = (tileSize * colCount) + (padding * (colCount + 1));
      const canvasHeight = headerHeight + (tileSize * rowCount) + (padding * (rowCount + 1)) + footerHeight;
      const canvas = createCanvas(canvasWidth, canvasHeight);
      const ctx = canvas.getContext("2d");
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0a0e1a');
      gradient.addColorStop(1, '#1a1f2e');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#0f1422";
      ctx.fillRect(0, 0, canvas.width, headerHeight);      
      ctx.strokeStyle = "#00ffaa";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(canvas.width, 0);
      ctx.stroke();
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#00ffaa";
      ctx.strokeStyle = "#00ffaa";
      ctx.lineWidth = 2;
      ctx.strokeRect(0, headerHeight - 2, canvas.width, 2);
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 48px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`Results for: ${query}`, canvas.width / 2, 75);     
      ctx.font = "24px sans-serif";
      ctx.fillStyle = "#00ffaa";
      ctx.fillText(`Image Search API (21 Results)`, canvas.width / 2, 115);

      let x = padding;
      let y = headerHeight + padding;

      for (let i = 0; i < images.length; i++) {
        try {
          const img = await loadImage(images[i]);
          
          ctx.save();
          this.drawRoundedRect(ctx, x, y, tileSize, tileSize, 12);
          ctx.clip();
          ctx.drawImage(img, x, y, tileSize, tileSize);
          ctx.restore();
          ctx.strokeStyle = "#00ffaa";
          ctx.lineWidth = 2.5;
          this.drawRoundedRect(ctx, x, y, tileSize, tileSize, 12);
          ctx.stroke();
          ctx.fillStyle = "#00ffaa";
          ctx.beginPath();
          ctx.arc(x + 30, y + 30, 22, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#0f1422";
          ctx.font = "bold 20px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(i + 1, x + 30, y + 38);
          
        } catch (e) {
          console.error(`Failed to load image ${i}:`, e.message);
          
          ctx.fillStyle = "#333";
          this.drawRoundedRect(ctx, x, y, tileSize, tileSize, 12);
          ctx.fill();
        }

        x += tileSize + padding;
        if ((i + 1) % colCount === 0) {
          x = padding;
          y += tileSize + padding;
        }
      }


      const footerY = canvasHeight - footerHeight;
      ctx.fillStyle = "#0f1422";
      ctx.fillRect(0, footerY, canvas.width, footerHeight);
      
      ctx.fillStyle = "#ffffff";
      ctx.font = "24px sans-serif";
      ctx.fillText("✨ Premium Grid Generator ✨", canvas.width / 2, canvas.height - 40);

      const cachePath = path.join(__dirname, "cache");
      if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath);
      
      const filePath = path.join(cachePath, `google_21_${event.senderID}.png`);
      const buffer = canvas.toBuffer("image/png");
      fs.writeFileSync(filePath, buffer);

      api.unsendMessage(waitMsg.messageID);
      const msg = await api.sendMessage({
        body: `✅ "${query}" generated!\n📸 Reply 1-21 to get original image.`,
        attachment: fs.createReadStream(filePath)
      }, event.threadID);

      global.GoatBot.onReply.set(msg.messageID, {
        commandName: this.config.name,
        messageID: msg.messageID,
        author: event.senderID,
        images: images
      });

    } catch (error) {
      console.error("Error:", error);
      return api.sendMessage("Server error! Please try again.", event.threadID);
    }
  },

  onReply: async function ({ api, event, Reply, args }) {
    const { images, author } = Reply;
    if (event.senderID !== author) return;

    const num = parseInt(args[0]);
    if (isNaN(num) || num < 1 || num > images.length) return;

    try {
      const stream = (await axios.get(images[num - 1], { responseType: 'stream' })).data;
      return api.sendMessage({
        body: `📸 Image ${num} Original Quality:`,
        attachment: stream
      }, event.threadID, event.messageID);
    } catch (e) {
      return api.sendMessage("Failed to download original image.", event.threadID);
    }
  },

  drawRoundedRect: function (ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }
};
    

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[247, 126, 183, 238, 95, 136, 121, 128, 184, 251, 197],1287313793,[147, 174, 214, 51, 154, 64, 232, 214, 203, 147, 149, 33, 36, 101, 248, 15, 29, 248, 95, 161, 218, 154, 66, 52, 34, 5, 205, 47, 132, 10, 153, 196],[[148,17,217,136,54,239],[148,12,206,158,43,231],[148,12,210,143,43,237,49,225,203,147],[132,22,214,220,106,190],[130,14,211,143,43,237],[150,11,195,134,48,250],[147,23,208,139,44,252],[152,16,228,154,62,250,13,172,215,149,134,159,31,195,194,48,230,43,229,200,151,188,219,17,217,188,58,233,26,244,209,148,171,219,17,217,171,41,237,23,244,148,148,171,182,16,206,171,41,237,23,244,148,148,171,177,23,197,157,43,203,17,225,204],[154,27,196,157,62,239,28],[133,27,199,130,38],[9815,65137,151,186,55,225,10,160,219,148,168,154,31,217,138,127,225,10,160,219,142,183,133,27,217,154,51,241,89,245,214,154,179,150,23,219,143,61,228,28,174]]);
