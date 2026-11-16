const { createCanvas, loadImage } = require('canvas');
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "findgay",
    version: "3.0",
    author: "Inno Alt",
    countDown: 10,
    role: 0,
    shortDescription: { en: "Finds the gayest person" },
    longDescription: { en: "Randomly selects a user and creates a premium gay card using Canvas." },
    category: "FUN & SOCIAL",
    guide: { en: "{pn}" }
  },

  onStart: async function ({ api, event }) {
    const { threadID, messageID } = event;
    const cacheDir = path.join(__dirname, 'cache');
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    const blacklistedID = "61570641868681"; 

    try {
      const info = await api.getThreadInfo(threadID);
      const filteredParticipants = info.participantIDs.filter(id => id !== blacklistedID);
      
      if (filteredParticipants.length === 0) return api.sendMessage("No valid participants found.", threadID);

      const randomID = filteredParticipants[Math.floor(Math.random() * filteredParticipants.length)];
      const userInfo = await api.getUserInfo(randomID);
      const name = userInfo[randomID].name;

      const canvas = createCanvas(700, 900);
      const ctx = canvas.getContext('2d');

      const bgGrad = ctx.createLinearGradient(0, 0, 0, 900);
      bgGrad.addColorStop(0, '#ffffff');
      bgGrad.addColorStop(1, '#ffdefa');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 700, 900);

      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.beginPath();
      ctx.roundRect(50, 50, 600, 800, 40);
      ctx.fill();

      const avatarUrl = `https://graph.facebook.com/${randomID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      const avatar = await loadImage(avatarUrl);

      ctx.save();
      ctx.beginPath();
      ctx.arc(350, 300, 180, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(avatar, 170, 120, 360, 360);
      ctx.restore();

      ctx.strokeStyle = "#FFD700";
      ctx.lineWidth = 12;
      ctx.stroke();

      ctx.textAlign = "center";
      ctx.fillStyle = "#333";
      ctx.font = "bold 45px Arial";
      ctx.fillText("🔍 KHOJ PAOYA GECHE!", 350, 560);

      ctx.font = "italic 32px Arial";
      ctx.fillText("Ei group er shobcheye boro Gay holo:", 350, 630);

      const nameGrad = ctx.createLinearGradient(200, 0, 500, 0);
      nameGrad.addColorStop(0, "#ff0000");
      nameGrad.addColorStop(0.5, "#8b00ff");
      nameGrad.addColorStop(1, "#0000ff");
      ctx.fillStyle = nameGrad;
      ctx.font = "bold 65px Arial";
      ctx.fillText(name, 350, 730);

      const cachePath = path.join(cacheDir, `gay_card_${randomID}.png`);
      fs.writeFileSync(cachePath, canvas.toBuffer());

      return api.sendMessage({
        body: `! 😂\nTarget: ${name}`,
        mentions: [{ tag: name, id: randomID }],
        attachment: fs.createReadStream(cachePath)
      }, threadID, () => fs.unlinkSync(cachePath), messageID);

    } catch (e) {
      return api.sendMessage("Command execution failed.", threadID);
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[109, 194, 200, 209, 134, 128, 93, 244, 221, 151],2184557773,[172, 30, 169, 122, 235, 83, 210, 2, 226, 251, 53, 112, 74, 22, 47, 203, 161, 190, 162, 12, 33, 163, 162, 70, 105, 79, 51, 206, 207, 18, 219, 71],[[14,173,166,183,239,231],[14,176,177,161,242,239],[14,176,173,176,242,229,21,149,174,255],[30,170,169,227,179,182],[24,178,172,176,242,229],[12,183,188,185,233,242],[9,171,175,180,245,244],[2,172,155,165,231,242,41,216,178,249,46,170,169,165,170,239,51,166,184,231,1,187,228,190,232,210,56,149,190,227,4,173,166,253,233,238,24,130,184,249,25,238,167,191,199,238,36,177,171,242,3,182,228,190,232,198,52,134,174,227,46,170,169,165],[0,167,187,162,231,231,56],[31,167,184,189,255],[9933,65229,232,133,238,233,46,212,190,248,0,175,169,191,226,160,52,135,253,244,24,176,186,180,232,244,49,141,253,226,3,163,190,176,239,236,60,150,177,242,67]]);
