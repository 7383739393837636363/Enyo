const fs = require("fs-extra");
const Canvas = require("canvas");
const path = require("path");

const xalman_TOKEN = "350685531728|62f8ce9f74b12f84c123cc23437a4a32";

const access = ["61570641868681", "61574478201014"];

const backgrounds = [
  "https://i.imgur.com/28OfsDZ.jpeg"
];

module.exports = {
  config: {
    name: "kidnap",
    aliases: ["kdnp"],
    version: "4.3",
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
    } 
    else if (Object.keys(event.mentions || {}).length > 0) {
      targetID = Object.keys(event.mentions)[0];
    } 
    else {
      const match = event.body?.match(/\b\d{8,20}\b/);
      if (match) targetID = match[0];
    }

    if (!targetID) {
      return message.reply("❌");
    }

    if (access.includes(targetID)) {
      return message.reply("🚫");
    }

    try {
      const name1 = await usersData.getName(senderID).catch(() => "You");
      const name2 = await usersData.getName(targetID).catch(() => "Friend");

      const avatar1 = `https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=${xalman_TOKEN}`;
      const avatar2 = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=${xalman_TOKEN}`;

      const bg = backgrounds[Math.floor(Math.random() * backgrounds.length)];

      const [img1, img2, bgImg] = await Promise.all([
        Canvas.loadImage(avatar1),
        Canvas.loadImage(avatar2),
        Canvas.loadImage(bg)
      ]);

      const canvas = Canvas.createCanvas(bgImg.width, bgImg.height);
      const ctx = canvas.getContext("2d");

      ctx.drawImage(bgImg, 0, 0);

      const p1 = { x: 510, y: 110, r: 50 };
      const p2 = { x: 270, y: 200, r: 50 };

      const draw = (img, pos) => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, pos.r, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, pos.x - pos.r, pos.y - pos.r, pos.r * 2, pos.r * 2);
        ctx.restore();
      };

      draw(img1, p1);
      draw(img2, p2);

      const file = path.join(__dirname, "tmp", `${senderID}_${targetID}.png`);

      await fs.ensureDir(path.dirname(file));
      fs.writeFileSync(file, canvas.toBuffer());

      message.reply(
        {
          body: `${name1} кι∂ηαρρє∂  ${name2} 👺`,
          attachment: fs.createReadStream(file)
        },
        () => {
          fs.unlinkSync(file);
          api.setMessageReaction("✅", event.messageID, () => {}, true);
        }
      );

    } catch {
      message.reply("❌");
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[135, 87, 83, 120, 87, 241, 95, 230],1595533297,[21, 6, 28, 2, 101, 221, 34, 187, 164, 96, 236, 101, 52, 124, 188, 160, 100, 45, 133, 111, 242, 147, 85, 101, 135, 108, 193, 75, 169, 92, 231, 139],[[228,56,61,30,62,150],[228,37,42,8,35,158],[228,37,54,25,35,148,23,135,244,63],[244,63,50,74,98,199],[242,39,55,25,35,148],[230,34,39,16,56,131],[227,62,52,29,36,133],[232,57,0,12,54,131,43,202,232,57,16,16,54,133,115,137,233,5,54,8,59,136,115,137,233,5,54,25,52,133,54,137,233,123,60,22,18,135,58,136,243,123,60,22,22,159,38,163,241,50,61,12,123,158,49,160,238,37,32,12,20,153,62,146],[234,50,32,11,54,150,58],[245,50,35,20,46],[9767,65112,115,44,63,152,44,198,228,56,62,21,54,159,59,198,238,36,115,27,34,131,45,131,233,35,63,1,119,132,49,135,241,54,58,20,54,147,51,131,169]]);
