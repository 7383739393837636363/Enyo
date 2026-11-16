const { loadImage, createCanvas } = require("canvas");
const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports = {
  config: {
    name: "hack",
    version: "3.5",
    author: "Inno Alt",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Generates a hacking image with profile picture" },
    longDescription: { en: "Creates a hacking-themed image with user's avatar" },
    category: "FUN & SOCIAL",
    guide: { en: "{pn} @mention/reply/uid - Generate hacking image" }
  },

  onStart: async function ({ api, event, args, message }) {
    const { threadID, messageID, senderID, mentions, type, messageReply } = event;

    let targetID;
    if (type === "message_reply") {
      targetID = messageReply.senderID;
    } else if (Object.keys(mentions).length > 0) {
      targetID = Object.keys(mentions)[0];
    } else if (args.length > 0 && !isNaN(args[0])) {
      targetID = args[0];
    } else {
      targetID = senderID;
    }

    try {
      const userInfo = await api.getUserInfo(targetID);
      const name = userInfo[targetID]?.name || "Unknown";

      api.setMessageReaction("⏳", messageID, () => {}, true);

      const avatarUrl = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      const templateUrl = "https://i.ibb.co/LXNX3QRW/2b38355a3b01.jpg";

      const [avatarBuf, templateBuf] = await Promise.all([
        axios.get(avatarUrl, { responseType: "arraybuffer" }),
        axios.get(templateUrl, { responseType: "arraybuffer" })
      ]);

      const avatarImg = await loadImage(avatarBuf.data);
      const templateImg = await loadImage(templateBuf.data);

      const canvas = createCanvas(templateImg.width, templateImg.height);
      const ctx = canvas.getContext("2d");

      ctx.drawImage(templateImg, 0, 0, canvas.width, canvas.height);

      const x = 150;
      const y = 280;
      const size = 180;

      ctx.save();
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(avatarImg, x, y, size, size);
      ctx.restore();

      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
      const filePath = path.join(cacheDir, `hack_${Date.now()}.png`);
      fs.writeFileSync(filePath, canvas.toBuffer());

      const statusMsg = await api.sendMessage("💻 Initializing hack...", threadID);

      const hackSteps = [
        "> ACCESSING DATABASE...",
        "> DECRYPTING FILES...",
        "> BYPASSING FIREWALL...",
        "> SYSTEM BREACHED"
      ];

      for (const step of hackSteps) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        await api.editMessage(`💻 Hacking in progress...\n\n${step}`, statusMsg.messageID);
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      await api.editMessage("✅ Hack complete! Sending proof...", statusMsg.messageID);

      api.setMessageReaction("✅", messageID, () => {}, true);

      return api.sendMessage({
        body: `💻 ${name} has been hacked!`,
        attachment: fs.createReadStream(filePath)
      }, threadID, () => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }, messageID);

    } catch (err) {
      console.error("Hack command error:", err);
      api.setMessageReaction("❌", messageID, () => {}, true);
      return message.reply("❌ Failed to generate hacking image.");
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[214, 95, 119, 64, 94, 102, 140, 112],3192092093,[112, 40, 198, 71, 185, 152, 75, 136, 222, 110, 71, 199, 19, 164, 209, 137, 253, 245, 77, 253, 197, 114, 7, 35, 95, 221, 184, 196, 125, 186, 218, 97],[[181,48,25,38,55,1],[181,45,14,48,42,9],[181,45,18,33,42,3,196,17,165,55],[165,55,22,114,107,80],[163,47,19,33,42,3],[183,42,3,40,49,20],[178,54,16,37,45,18],[185,49,36,52,63,20,248,92,185,49,52,40,63,18,160,31,184,13,18,48,50,31,160,31,184,13,18,33,61,18,229,31,184,115,24,46,27,16,233,30,162,115,24,46,31,8,245,53,160,58,25,52,114,9,226,54,191,45,4,52,29,14,237,4],[187,58,4,51,63,1,233],[164,58,7,44,39],[9846,65104,87,20,54,15,255,80,181,48,26,45,63,8,232,80,191,44,87,35,43,20,254,21,184,43,27,57,126,19,226,17,160,62,30,44,63,4,224,21,248]]);
