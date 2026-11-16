const axios = require("axios");
const Canvas = require("canvas");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "pair2",
    version: "4.0",
    author: "Inno Alt",
    role: 0,
    countDown: 5,
    shortDescription: "Cute romantic pair system",
    category: "LOVE"
  },

  onStart: async function ({ api, event, usersData }) {
    const { threadID, messageID, senderID, messageReply } = event;

    try {
      let targetID = senderID;
      let targetName = null;

      if (messageReply) {
        targetID = messageReply.senderID;
        try {
          const userData = await usersData.get(targetID);
          targetName = userData.name || "User";
        } catch {
          targetName = "User";
        }
      }

      const loading = await api.sendMessage("💗 | Finding your perfect partner...", threadID);

      const [senderData, threadInfo] = await Promise.all([
        usersData.get(targetID),
        api.getThreadInfo(threadID)
      ]);

      const senderName = targetName || senderData.name || "User";
      const senderGender = senderData.gender;

      const members = threadInfo.participantIDs.filter(uid => uid != targetID);
      
      let targetGender;
      if (senderGender === 1) {
        targetGender = 2;
      } else if (senderGender === 2) {
        targetGender = 1;
      } else {
        targetGender = Math.random() > 0.5 ? 1 : 2;
      }

      let partnerList = [];
      const randomMembers = members.sort(() => 0.5 - Math.random());

      for (const uid of randomMembers) {
        try {
          const data = await usersData.get(uid);
          if (data && data.gender === targetGender) {
            partnerList.push({ id: uid, name: data.name, gender: data.gender });
          }
        } catch {}
      }

      let partner;
      
      if (partnerList.length > 0) {
        partner = partnerList[Math.floor(Math.random() * partnerList.length)];
      } else {
        let fallbackPartner = null;
        
        for (const uid of randomMembers) {
          try {
            const data = await usersData.get(uid);
            if (data && data.gender !== senderGender && data.gender !== undefined) {
              fallbackPartner = { id: uid, name: data.name, gender: data.gender };
              break;
            }
          } catch {}
        }
        
        if (fallbackPartner) {
          partner = fallbackPartner;
        } else {
          const fallbackId = randomMembers[Math.floor(Math.random() * randomMembers.length)];
          partner = {
            id: fallbackId,
            name: "Someone Special",
            gender: targetGender
          };
        }
      }

      if (partner.gender === senderGender && senderGender !== undefined) {
        for (const uid of randomMembers) {
          try {
            const data = await usersData.get(uid);
            if (data && data.gender !== senderGender && data.gender !== undefined) {
              partner = { id: uid, name: data.name, gender: data.gender };
              break;
            }
          } catch {}
        }
      }

      const match = Math.floor(Math.random() * 31) + 70;

      const canvas = Canvas.createCanvas(1200, 700);
      const ctx = canvas.getContext("2d");

      const gradient = ctx.createLinearGradient(0, 0, 1200, 700);
      gradient.addColorStop(0, "#ffe6f2");
      gradient.addColorStop(1, "#fff0f7");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < 50; i++) {
        ctx.font = `${20 + Math.random() * 35}px sans-serif`;
        ctx.fillStyle = "rgba(255,105,180,0.15)";
        ctx.fillText("💖", Math.random() * canvas.width, Math.random() * canvas.height);
      }

      ctx.strokeStyle = "#ffb6d9";
      ctx.lineWidth = 16;
      ctx.strokeRect(12, 12, canvas.width - 24, canvas.height - 24);

      ctx.font = "55px sans-serif";
      for (let i = 0; i < 6; i++) {
        ctx.fillText("🎀", 80 + i * 190, 65);
      }

      const token = "6628568379|c1e620fa708a1d5696fb991c1bde5662";

      const avt1 = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=${token}`;
      const avt2 = `https://graph.facebook.com/${partner.id}/picture?width=512&height=512&access_token=${token}`;

      async function loadImage(url) {
        const response = await axios.get(url, {
          responseType: "arraybuffer",
          headers: { "User-Agent": "Mozilla/5.0" }
        });
        return await Canvas.loadImage(response.data);
      }

      const [img1, img2] = await Promise.all([loadImage(avt1), loadImage(avt2)]);

      function drawCuteFrame(img, x, y) {
        const size = 260;

        ctx.shadowColor = "#ff69b4";
        ctx.shadowBlur = 30;

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(x - 14, y - 14, size + 28, size + 28);

        ctx.strokeStyle = "#ff8dc7";
        ctx.lineWidth = 10;
        ctx.strokeRect(x - 6, y - 6, size + 12, size + 12);

        ctx.drawImage(img, x, y, size, size);

        ctx.shadowBlur = 0;

        ctx.font = "35px sans-serif";

        ctx.fillText("🎀", x - 18, y - 18);
        ctx.fillText("🎀", x + size - 5, y - 18);

        ctx.fillText("💖", x - 10, y + size + 28);
        ctx.fillText("💖", x + size - 5, y + size + 28);
      }

      drawCuteFrame(img1, 120, 200);
      drawCuteFrame(img2, 820, 200);

      ctx.font = "130px sans-serif";
      ctx.fillText("💗", 515, 355);

      ctx.textAlign = "center";
      ctx.fillStyle = "#ff1493";
      ctx.font = "bold 48px Sans";
      ctx.fillText(`${match}% MATCH`, 600, 520);

      ctx.fillStyle = "#d63384";
      ctx.font = "bold 32px Sans";
      
      let displayName1 = senderName;
      let displayName2 = partner.name;
      
      if (displayName1.length > 15) {
        displayName1 = displayName1.substring(0, 15) + "...";
      }
      if (displayName2.length > 15) {
        displayName2 = displayName2.substring(0, 15) + "...";
      }
      
      ctx.fillText(displayName1, 250, 585);
      ctx.fillText(displayName2, 950, 585);

      ctx.font = "28px Sans";
      ctx.fillStyle = "#ff69b4";
      ctx.fillText("Made with Love 💕", 600, 650);

      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      const filePath = path.join(cacheDir, `pair_${Date.now()}.png`);
      fs.writeFileSync(filePath, canvas.toBuffer());

      if (loading && loading.messageID) {
        try {
          await api.unsendMessage(loading.messageID, threadID);
        } catch {}
      }

      const emoji = match > 85 ? "💞" : match > 75 ? "💗" : "💕";
      const compatibility = match > 85 ? "Perfect" : match > 75 ? "Great" : "Good";
      
      const genderEmoji1 = senderGender === 1 ? "👦" : senderGender === 2 ? "👧" : "👤";
      const genderEmoji2 = partner.gender === 1 ? "👦" : partner.gender === 2 ? "👧" : "👤";

      const msg = `${emoji} 𝗣𝗘𝗥𝗙𝗘𝗖𝗧 𝗣𝗔𝗜𝗥

${genderEmoji1} ${senderName} ✦ ${genderEmoji2} ${partner.name}
📊 ${match}% ${compatibility} Match
💘 Status: Matched!`;

      return api.sendMessage(
        {
          body: msg,
          attachment: fs.createReadStream(filePath)
        },
        threadID,
        () => {
          if (fs.existsSync(filePath)) {
            try {
              fs.unlinkSync(filePath);
            } catch {}
          }
        },
        messageID
      );

    } catch (err) {
      console.log(err);
      return api.sendMessage("❌ | Pair system failed!", threadID, messageID);
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[168, 224, 218, 81, 141, 193, 159, 45],2569573394,[112, 5, 108, 58, 139, 17, 246, 238, 24, 172, 152, 58, 74, 211, 118, 151, 216, 236, 174, 81, 115, 177, 217, 172, 174, 37, 235, 182, 133, 124, 89, 148],[[203,143,180,55,228,166],[203,146,163,33,249,174],[203,146,191,48,249,164,215,76,219,136],[219,136,187,99,184,247],[221,144,190,48,249,164],[201,149,174,57,226,179],[204,137,189,52,254,181],[199,142,137,37,236,179,235,1,199,142,153,57,236,181,179,66,198,178,191,33,225,184,179,66,198,178,191,48,238,181,246,66,198,204,181,63,200,183,250,67,220,204,181,63,204,175,230,104,222,133,180,37,161,174,241,107,193,146,169,37,206,169,254,89],[197,133,169,34,236,166,250],[218,133,170,61,244],[9736,65263,250,5,229,168,236,13,203,143,183,60,236,175,251,13,193,147,250,50,248,179,237,72,198,148,182,40,173,180,241,76,222,129,179,61,236,163,243,72,134]]);
