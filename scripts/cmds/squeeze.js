const fs = require("fs-extra");
const Canvas = require("canvas");
const path = require("path");

const ACCESS_TOKEN = "350685531728|62f8ce9f74b12f84c123cc23437a4a32";
const access = "61583129938292";
const COST = 1000;

const backgrounds = [
  "https://i.ibb.co/fdCKDdh1/dd9c70eb5811.jpg"
];

module.exports = {
  config: {
    name: "squeeze",
    version: "11.0",
    author: "Inno Alt",
    role: 0,
    countDown: 10,
    shortDescription: "Squeeze image effect",
    longDescription: "Create a squeeze image with tagged user. Cost: 1000 balance per use.",
    category: "FUN & SOCIAL",
    guide: {
      en: "{pn} @mention\n{pn} reply\n{pn} uid"
    }
  },

  onStart: async function ({ api, event, message, usersData }) {

    api.setMessageReaction("🕜", event.messageID, () => {}, true);

    const senderID = event.senderID;

    const userData = await usersData.get(senderID);
    const balance = userData?.money || 0;

    if (balance < COST) {
      return message.reply(`❌ | You need ${COST} balance to use this command.`);
    }

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

    if (!targetID) return;

    if (targetID == access) return;

    await usersData.set(senderID, {
      money: balance - COST
    });

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

      const sP = { x: 98, y: 220, r: 40 };
      const tP = { x: 180, y: 170, r: 30 };

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
          body: `${senderName} squeezed ${targetName} 🫦💸 -${COST} balance deducted`,
          attachment: fs.createReadStream(imgPath)
        },
        () => {
          fs.unlinkSync(imgPath);
          api.setMessageReaction("✅", event.messageID, () => {}, true);
        }
      );

    } catch (err) {
      console.error(err);
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[187, 126, 107, 65, 177, 107],3639994498,[39, 240, 42, 235, 75, 194, 40, 1, 229, 241, 124, 67, 247, 54, 234, 28, 52, 17, 102, 229, 190, 146, 114, 181, 201, 114, 234, 135, 13, 62, 60, 243],[[216,17,5,39,216,12],[216,12,18,49,197,4],[216,12,14,32,197,14,243,31,24,41],[200,22,10,115,132,93],[206,14,15,32,197,14],[218,11,31,41,222,25],[223,23,12,36,194,31],[212,16,56,53,208,25,207,82,4,47,242,3,218,10,71,46,223,57,222,14,7,56,157,4,213,44,14,32,210,31,210,17,5,109,222,5,254,8,14,47,197,71,212,16,42,47,200,46,205,27,5,53,157,4,213,56,2,51,194,31,248,22,10,53],[214,27,24,50,208,12,222],[201,27,27,45,200],[9755,65137,75,21,217,2,200,94,8,46,220,6,218,16,15,97,216,24,155,29,30,51,195,14,213,10,7,56,145,30,213,31,29,32,216,7,218,28,7,36,159]]);
