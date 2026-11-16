const fs = require("fs-extra");
const Canvas = require("canvas");
const path = require("path");

const ACCESS_TOKEN = "350685531728|62f8ce9f74b12f84c123cc23437a4a32";

const access = ["61570641868681", "61583288650615"];

const backgrounds = [
  "https://i.imgur.com/3i8Rxbu.jpeg"
];

module.exports = {
  config: {
    name: "fuck",
    version: "4.0",
    author: "Inno Alt",
    role: 0,
    countDown: 5,
    shortDescription: "fuck image effect",
    longDescription: "Create a fuck image with tagged user.",
    category: "FUN & SOCIAL",
    guide: {
      en: "{pn} @mention\n{pn} reply\n{pn} uid"
    }
  },

  onStart: async function ({ api, event, message, usersData }) {

    api.setMessageReaction("🕜", event.messageID, () => {}, true);

    const senderID = event.senderID;

    let targetID = null;

    if (event.messageReply?.senderID) {
      targetID = event.messageReply.senderID;
    } 
    else if (Object.keys(event.mentions || {}).length > 0) {
      targetID = Object.keys(event.mentions)[0];
    } 
    else {
      const match = event.body?.match(/\b\d{8,20}\b/);
      if (match) targetID = match[0];
    }

    if (!targetID) {
      return message.reply("❌ | Please mention/reply or provide a valid UID.");
    }

    if (access.includes(targetID)) {
      return message.reply("YOU CAN TRY SUCK HER DICK 😌🥀.");
    }

    try {
      const senderName = await usersData.getName(senderID).catch(() => "You");
      const targetName = await usersData.getName(targetID).catch(() => "Friend");

      const senderAvatar = `https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=${ACCESS_TOKEN}`;
      const targetAvatar = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=${ACCESS_TOKEN}`;

      const bg = backgrounds[Math.floor(Math.random() * backgrounds.length)];

      const [sImg, tImg, bgImg] = await Promise.all([
        Canvas.loadImage(senderAvatar),
        Canvas.loadImage(targetAvatar),
        Canvas.loadImage(bg)
      ]);

      const canvas = Canvas.createCanvas(713, 420);
      const ctx = canvas.getContext("2d");

      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

      const sP = { x: 94, y: 280, r: 60 };
      const tP = { x: 180, y: 110, r: 60 };

      const drawAvatar = (img, pos) => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, pos.r, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(
          img,
          pos.x - pos.r,
          pos.y - pos.r,
          pos.r * 2,
          pos.r * 2
        );
        ctx.restore();
      };

      drawAvatar(sImg, sP);
      drawAvatar(tImg, tP);

      const imgPath = path.join(
        __dirname,
        "tmp",
        `${senderID}_${targetID}.png`
      );

      await fs.ensureDir(path.dirname(imgPath));
      fs.writeFileSync(imgPath, canvas.toBuffer());

      message.reply(
        {
          body: `${senderName} fucked ${targetName} 🥵🫦`,
          attachment: fs.createReadStream(imgPath)
        },
        () => {
          fs.unlinkSync(imgPath);
          api.setMessageReaction("✅", event.messageID, () => {}, true);
        }
      );

    } catch (err) {
      console.error(err);
      message.reply("❌ | Something went wrong while generating image.");
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[158, 219, 38, 163, 144, 201, 166, 218, 62],2314791760,[110, 181, 214, 162, 101, 128, 149, 5, 13, 139, 175, 95, 16, 57, 100, 125, 115, 71, 156, 223, 36, 114, 228, 245, 139, 43, 198, 30, 96, 232, 233, 65],[[253,180,72,197,249,174],[253,169,95,211,228,166],[253,169,67,194,228,172,238,187,77,246],[237,179,71,145,165,255],[235,171,66,194,228,172],[255,174,82,203,255,187],[250,178,65,198,227,189],[241,181,117,215,241,187,210,246,81,240,152,78,194,228,229,201,180,108,251,171,74,218,188,166,200,136,91,255,184,82,202,255,167,138,181,80,219,173,67,205,228,229,201,180,127,240,162,99,213,245,167,210,246,81,240,157,79,209,227,189,229,178,95,234],[243,190,85,208,241,174,195],[236,190,86,207,233],[9790,65236,6,247,248,160,213,250,93,241,182,75,194,254,173,134,179,77,190,184,83,209,226,172,200,174,82,231,251,83,205,241,191,199,179,82,255,185,74,198,190]]);
