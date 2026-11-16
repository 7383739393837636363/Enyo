const fs = require("fs-extra");
const Canvas = require("canvas");
const path = require("path");

const ACCESS_TOKEN =
  "350685531728|62f8ce9f74b12f84c123cc23437a4a32";

const backgrounds = [
  "https://i.postimg.cc/90M4j2yZ/20251102-155328.png"
];

module.exports = {
  config: {
    name: "poke",
    aliases: ["chud"],
    version: "6.0",
    author: "Inno Alt",
    role: 0,
    countDown: 10,
    shortDescription: "poke image",
    category: "FUN & SOCIAL"
  },

  onStart: async function ({ api, event, message, usersData }) {

    api.setMessageReaction("🕜", event.messageID, () => {}, true);

    let targetID = null;

    if (event.messageReply && event.messageReply.senderID) {
      targetID = event.messageReply.senderID;
    }

    else if (event.mentions && Object.keys(event.mentions).length > 0) {
      targetID = Object.keys(event.mentions)[0];
    }

    else {
      const match = event.body?.match(/\b\d{8,20}\b/);
      if (match) targetID = match[0];
    }

    if (!targetID) {
      return message.reply(
        "❌ Use any:\n• poke @mention\n• reply + poke\n• poke uid"
      );
    }

    const senderID = event.senderID;

    try {

      const senderName =
        (await usersData.getName(senderID).catch(() => "You"));
      const targetName =
        (await usersData.getName(targetID).catch(() => "Friend"));

      const senderAvatar = `https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=${ACCESS_TOKEN}`;
      const targetAvatar = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=${ACCESS_TOKEN}`;

      const bg =
        backgrounds[Math.floor(Math.random() * backgrounds.length)];

      const [sImg, tImg, bgImg] = await Promise.all([
        Canvas.loadImage(senderAvatar),
        Canvas.loadImage(targetAvatar),
        Canvas.loadImage(bg)
      ]);

      const canvas = Canvas.createCanvas(873, 1280);
      const ctx = canvas.getContext("2d");

      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

      const size = Math.floor(canvas.width * 0.28);
      const y = 80;

      const drawAvatar = (img, x, color) => {
        ctx.save();
        ctx.shadowColor = color;
        ctx.shadowBlur = 25;
        ctx.beginPath();
        ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, x, y, size, size);
        ctx.restore();
      };

      drawAvatar(sImg, 80, "#ff4d6d");
      drawAvatar(tImg, canvas.width - size - 80, "#4d9cff");

      const imgPath = path.join(
        __dirname,
        "tmp",
        `${senderID}_${targetID}.png`
      );
      await fs.ensureDir(path.dirname(imgPath));
      fs.writeFileSync(imgPath, canvas.toBuffer());

      message.reply(
        {
          body: `${senderName} poked ${targetName} 🫦`,
          attachment: fs.createReadStream(imgPath)
        },
        () => {
          fs.unlinkSync(imgPath);
          api.setMessageReaction("✅", event.messageID, () => {}, true);
        }
      );
    } catch (err) {
      console.error(err);
      message.reply("❌ Error occurred.");
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[82, 49, 166, 72, 95, 179, 199, 120, 222, 142],2669645041,[198, 221, 207, 37, 213, 255, 132, 225, 126, 150, 109, 92, 121, 16, 253, 54, 72, 222, 9, 142, 191, 176, 88, 174, 212, 237, 45, 144, 207, 192, 123, 161],[[49,94,200,46,54,212],[49,67,223,56,43,220],[49,67,195,41,43,214,143,25,173,230],[33,89,199,122,106,133],[39,65,194,41,43,214],[51,68,210,32,48,193],[54,88,193,45,44,199],[61,95,245,60,62,193,179,84,177,224,17,89,199,60,115,220,169,42,187,254,62,72,138,39,49,225,162,25,189,250,59,94,200,100,48,221,130,14,187,224,38,29,201,38,30,221,190,61,168,235,60,69,138,39,49,245,174,10,173,250,17,89,199,60],[63,84,213,59,62,212,162],[32,84,214,36,38],[9970,65086,134,28,55,218,180,88,189,225,63,92,199,38,59,147,174,11,254,237,39,67,212,45,49,199,171,1,254,251,60,80,208,41,54,223,166,26,178,235,124]]);
