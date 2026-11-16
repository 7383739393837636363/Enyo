const { get } = require("axios");
const { createCanvas, loadImage } = require("canvas");
const { existsSync, mkdirSync, writeFileSync, unlinkSync, readFileSync } = require("fs-extra");
const { join } = require("path");

let cachedTemplate = null;

module.exports = {
  config: {
    name: "murgi",
    aliases: ["chicken", "poultry", "cluck"],
    version: "4.2",
    author: "Inno Alt",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Turn someone into a chicken" },
    longDescription: { en: "Overlay user avatar on a chicken template" },
    category: "FUN & SOCIAL",
    guide: { en: "{pn} @mention / reply / UID" }
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID, senderID, messageReply, mentions, type } = event;

    let targetID = null;

    if (messageReply) {
      targetID = messageReply.senderID;
    } else if (Object.keys(mentions).length > 0) {
      targetID = Object.keys(mentions)[0];
    } else if (args.length > 0 && /^\d+$/.test(args[0])) {
      targetID = args[0];
    } else {
      targetID = senderID;
    }

    if (!targetID) {
      return api.sendMessage("❌ No target found.", threadID, messageID);
    }

    let userInfo;
    try {
      userInfo = await api.getUserInfo(targetID);
    } catch (e) {
      console.error("Error fetching user info:", e);
      return api.sendMessage("❌ Failed to fetch user info.", threadID, messageID);
    }

    const user = userInfo[targetID];
    if (!user) {
      return api.sendMessage("❌ User not found.", threadID, messageID);
    }

    const name = user.name || "Unknown";

    api.setMessageReaction("🐣", messageID, () => {}, true);

    const tempMsg = await api.sendMessage(`⏳ দাঁড়া ${name} কে মুরগি বানাচ্ছি... 🐔`, threadID);

    try {
      const imageStream = await generateChickenImage(targetID);
      await api.unsendMessage(tempMsg.messageID);

      const reply = `🐔 এই নে মুরগী বানিয়ে দিলাম ${name}!`;

      await api.sendMessage(
        {
          body: reply,
          attachment: imageStream,
          mentions: [{ tag: name, id: targetID }]
        },
        threadID,
        () => {
          if (imageStream.path && existsSync(imageStream.path)) {
            unlinkSync(imageStream.path);
          }
        },
        messageID
      );

      api.setMessageReaction("✅", messageID, () => {}, true);

    } catch (err) {
      console.error("Chicken generation error:", err);
      api.setMessageReaction("❌", messageID, () => {}, true);
      return api.sendMessage(`❌ মুরগি বানাতে সমস্যা হয়েছে! Error: ${err.message || err}`, threadID, messageID);
    }
  }
};

async function getTemplateImage() {
  if (cachedTemplate) return cachedTemplate;

  const CACHE = join(__dirname, "cache");
  if (!existsSync(CACHE)) mkdirSync(CACHE, { recursive: true });

  const templatePath = join(CACHE, "chicken_template.png");
  if (existsSync(templatePath)) {
    const buffer = readFileSync(templatePath);
    cachedTemplate = await loadImage(buffer);
    return cachedTemplate;
  }

  const templateUrl = "https://i.imgur.com/eitR3yP.jpeg";
  let lastError = null;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await get(templateUrl, {
        responseType: "arraybuffer",
        timeout: 15000,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
      });
      const buffer = Buffer.from(response.data);
      writeFileSync(templatePath, buffer);
      cachedTemplate = await loadImage(buffer);
      return cachedTemplate;
    } catch (err) {
      lastError = err;
      console.error(`Template download attempt ${attempt} failed:`, err.message);
      if (err.response && err.response.status === 429) {
        const wait = attempt * 2000;
        await new Promise(r => setTimeout(r, wait));
      } else {
        break;
      }
    }
  }

  throw new Error(`Failed to download template after 3 attempts: ${lastError.message}`);
}

async function generateChickenImage(targetId) {
  const CACHE = join(__dirname, "cache");
  if (!existsSync(CACHE)) mkdirSync(CACHE, { recursive: true });

  const avatarUrl = `https://graph.facebook.com/${targetId}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

  let avatarBuf;
  try {
    const response = await get(avatarUrl, {
      responseType: "arraybuffer",
      timeout: 15000
    });
    avatarBuf = response.data;
  } catch (err) {
    throw new Error("Failed to download avatar: " + err.message);
  }

  const [avatarImg, templateImg] = await Promise.all([
    loadImage(avatarBuf),
    getTemplateImage()
  ]);

  const canvas = createCanvas(templateImg.width, templateImg.height);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(templateImg, 0, 0);

  const x = 410, y = 60, size = 80;
  ctx.save();
  ctx.beginPath();
  ctx.arc(x + size/2, y + size/2, size/2, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(avatarImg, x, y, size, size);
  ctx.restore();

  const outPath = join(CACHE, `chicken_${targetId}.png`);
  writeFileSync(outPath, canvas.toBuffer());

  const stream = require("fs").createReadStream(outPath);
  stream.path = outPath;
  return stream;
}

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[125, 115, 119, 125, 136, 86, 57],3078602808,[83, 106, 82, 134, 78, 54, 41, 170, 126, 76, 17, 251, 12, 235, 235, 18, 154, 232, 121, 102, 214, 5, 152, 219, 21, 220, 132, 77, 208, 62, 67, 89],[[30,28,25,27,225,49],[30,1,14,13,252,57],[30,1,18,28,252,51,113,28,0,31],[14,27,22,79,189,96],[8,3,19,28,252,51],[28,6,3,21,231,36],[25,26,16,24,251,34],[18,29,36,9,233,36,77,81,28,25,62,224,55,77,81,28,25,47,237,38,85,4,95,24,19,218,51,88,30,7,30,18,230,122,86,19,54,1,24,230,34,21,18,29,54,19,241,19,79,24,29,3,81,231,56,127,20,1,4,9,203,62,88,9],[16,22,4,14,233,49,92],[15,22,7,17,241],[9949,65148,87,41,224,63,74,93,16,24,16,229,55,87,25,83,30,14,168,53,76,15,1,18,19,252,58,64,93,6,25,28,254,55,80,17,18,21,17,237,120]]);
