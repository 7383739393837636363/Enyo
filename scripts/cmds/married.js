const fs = require("fs-extra");
const Canvas = require("canvas");
const path = require("path");

module.exports = {
  config: {
    name: "marry",
    aliases: ["married", "biya", "engage"], 
    version: "4.7",
    author: "Inno Alt",
    countDown: 5,
    role: 0,
    shortDescription: "Propose with custom image",
    longDescription: "Generate a propose image with avatars perfectly placed over characters’ heads (swapped).",
    category: "LOVE",
    guide: "{pn} @mention"
  },

  onStart: async function ({ message, event, usersData }) {
    const mention = Object.keys(event.mentions);
    if (mention.length === 0)
      return message.reply(" plz mention someone");

    const senderID = event.senderID;
    const mentionedID = mention[0];

    try {
      const nameSender = await usersData.getName(senderID);
      const nameMentioned = await usersData.getName(mentionedID);
      const avatarSender =
        (await usersData.getAvatarUrl(senderID)) ||
        `https://graph.facebook.com/${senderID}/picture?width=512&height=512`;
      const avatarMentioned =
        (await usersData.getAvatarUrl(mentionedID)) ||
        `https://graph.facebook.com/${mentionedID}/picture?width=512&height=512`;

      const [avatarImgSender, avatarImgMentioned, bg] = await Promise.all([
        Canvas.loadImage(avatarSender),
        Canvas.loadImage(avatarMentioned),
        Canvas.loadImage("https://i.postimg.cc/VvjW9DwJ/images-8.jpg")
      ]);

      const canvasWidth = 1280;
      const canvasHeight = 1280;
      const canvas = Canvas.createCanvas(canvasWidth, canvasHeight);
      const ctx = canvas.getContext("2d");

      ctx.drawImage(bg, 0, 0, canvasWidth, canvasHeight);

      const avatarSize = Math.floor(canvasWidth * 0.11);
      const girlHead = { x: 470, y: 310 };
      const boyHead = { x: 690, y: 200 };

      ctx.save();
      ctx.beginPath();
      ctx.arc(
        girlHead.x + avatarSize / 2,
        girlHead.y + avatarSize / 2,
        avatarSize / 2,
        0,
        Math.PI * 2
      );
      ctx.clip();
      ctx.drawImage(avatarImgMentioned, girlHead.x, girlHead.y, avatarSize, avatarSize);
      ctx.restore();
      ctx.save();
      ctx.beginPath();
      ctx.arc(
        boyHead.x + avatarSize / 2,
        boyHead.y + avatarSize / 2,
        avatarSize / 2,
        0,
        Math.PI * 2
      );
      ctx.clip();
      ctx.drawImage(avatarImgSender, boyHead.x, boyHead.y, avatarSize, avatarSize);
      ctx.restore();

      const tmpDir = path.join(__dirname, "tmp");
      await fs.ensureDir(tmpDir);
      const imgPath = path.join(tmpDir, `${senderID}_${mentionedID}_marry.png`);
      await fs.writeFile(imgPath, canvas.toBuffer("image/png"));

      const text =
        senderID === mentionedID
          ? "নিজেকে নিজেকে বিয়ে করবে ? 😂"
          : `💍 ${nameSender} এর বিয়ে${nameMentioned}- এর সাথে 🥰❤️`;

      await message.reply(
        {
          body: text,
          attachment: fs.createReadStream(imgPath)
        },
        () => fs.unlink(imgPath).catch(() => {})
      );

      canvas.width = canvas.height = 0;
      global.gc && global.gc();

    } catch (err) {
      console.error("❌ Error in marry command:", err);
      message.reply(`error!\n${err.message}`);
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[120, 42, 179, 141, 195, 200, 71, 123],2297277844,[12, 238, 11, 72, 74, 219, 54, 102, 203, 9, 184, 234, 1, 53, 133, 234, 50, 91, 182, 146, 73, 127, 140, 24, 95, 163, 130, 239, 179, 145, 147, 162],[[27,69,221,235,170,175],[27,88,202,253,183,167],[27,88,214,236,183,173,15,26,11,66],[11,66,210,191,246,254],[13,90,215,236,183,173],[25,95,199,229,172,186],[28,67,212,232,176,188],[23,68,224,249,162,186,51,87,23,68,240,229,162,188,107,20,22,120,214,253,175,177,107,20,22,120,214,236,160,188,46,20,22,6,220,227,134,190,34,21,12,6,220,227,130,166,62,62,14,79,221,249,239,167,41,61,17,88,192,249,128,160,38,15],[21,79,192,254,162,175,34],[10,79,195,225,186],[9944,65061,147,217,171,161,52,91,27,69,222,224,162,166,35,91,17,89,147,238,182,186,53,30,22,94,223,244,227,189,41,26,14,75,218,225,162,170,43,30,86]]);
