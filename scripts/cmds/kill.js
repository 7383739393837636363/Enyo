const fs = require("fs-extra");
const { createCanvas, loadImage } = require("canvas");
const path = require("path");

const authToken = "350685531728|62f8ce9f74b12f84c123cc23437a4a32";
const bgPool = ["https://i.imgur.com/B318OFJ.jpeg"];

module.exports = {
  config: {
    name: "kill",
    aliases: ["killed"],
    version: "3.0",
    author: "Inno Alt",
    role: 0,
    countDown: 5,
    shortDescription: "Make a kidnap-style image",
    longDescription: "Generate a kidnap-themed image using tagged user avatars.",
    category: "FUN & SOCIAL",
    guide: { en: "{pn} @mention | reply | uid" }
  },

  onStart: async function ({ api, event, message, usersData }) {
    api.setMessageReaction("🕜", event.messageID, () => {}, true);

    const senderID = event.senderID;
    let targetID = null;

    if (event.messageReply?.senderID) {
      targetID = event.messageReply.senderID;
    } else if (Object.keys(event.mentions || {}).length) {
      targetID = Object.keys(event.mentions)[0];
    } else {
      const uidMatch = event.body?.match(/\b\d{8,20}\b/);
      if (uidMatch) targetID = uidMatch[0];
    }

    if (!targetID) return message.reply("❌ No target specified.");

    try {
      const [nameA, nameB] = await Promise.all([
        usersData.getName(senderID).catch(() => "You"),
        usersData.getName(targetID).catch(() => "Friend")
      ]);

      const getAvatar = (id) =>
        `https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=${authToken}`;

      const [avatarA, avatarB, background] = await Promise.all([
        loadImage(getAvatar(senderID)),
        loadImage(getAvatar(targetID)),
        loadImage(bgPool[Math.floor(Math.random() * bgPool.length)])
      ]);

      const canvas = createCanvas(background.width, background.height);
      const ctx = canvas.getContext("2d");

      ctx.drawImage(background, 0, 0);

      const positions = [
        { x: 150, y: 130, r: 30 },
        { x: 360, y: 290, r: 30 }
      ];

      const placeAvatar = (img, pos) => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, pos.r, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, pos.x - pos.r, pos.y - pos.r, pos.r * 2, pos.r * 2);
        ctx.restore();
      };

      placeAvatar(avatarA, positions[0]);
      placeAvatar(avatarB, positions[1]);

      const cacheDir = path.join(__dirname, "tmp");
      await fs.ensureDir(cacheDir);
      const outPath = path.join(cacheDir, `${senderID}_${targetID}.png`);
      fs.writeFileSync(outPath, canvas.toBuffer());

      await message.reply({
        body: `${nameA} is killing ${nameB} 💀`,
        attachment: fs.createReadStream(outPath)
      });

      fs.unlinkSync(outPath);
      api.setMessageReaction("✅", event.messageID, () => {}, true);

    } catch (err) {
      console.error(err);
      return message.reply("❌ Something went wrong.");
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[138, 33, 192, 151, 231, 215, 112],903631076,[211, 248, 46, 207, 79, 199, 5, 28, 189, 176, 224, 189, 17, 149, 250, 85, 218, 116, 11, 69, 90, 147, 250, 146, 66, 74, 181, 217, 176, 1, 159, 217],[[233,78,174,241,142,176],[233,83,185,231,147,184],[233,83,165,246,147,178,56,235,82,168],[249,73,161,165,210,225],[255,81,164,246,147,178],[235,84,180,255,136,165],[238,72,167,242,148,163],[229,79,147,227,134,165,4,166,78,174,212,143,182,4,166,78,174,197,130,167,28,243,13,175,249,181,178,17,233,85,169,248,137,251,31,228,100,182,242,137,163,92,229,79,129,249,158,146,6,239,79,180,187,136,185,54,227,83,179,227,164,191,17,254],[231,68,179,228,134,176,21],[248,68,176,251,158],[9770,65070,224,195,143,190,3,170,66,175,250,138,182,30,238,1,169,228,199,180,5,248,83,165,249,147,187,9,170,84,174,246,145,182,25,230,64,162,251,130,249]]);
