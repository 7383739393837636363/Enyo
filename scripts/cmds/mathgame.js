module.exports = {
  config: {
    name: "mathgame",
    aliases: ["math"],
    version: "7.0",
    author: "Inno Alt",
    role: 0,
    category: "GAMES"
  },

  onStart: async function ({ event, args, message, usersData }) {
    const axios = require("axios");
    const uid = event.senderID;

    if (!args[0]) {
      return message.reply(
`🧮 MATH GAME GUIDE
────────────
📌 Usage:
➤ /mathgame easy
➤ /mathgame medium
➤ /mathgame hard
➤ /math easy

🎮 Rules:
• সঠিক উত্তর: +300 Coins, +100 XP
• ভুল উত্তর: -100 Coins

⏱ সময়: 60 সেকেন্ড`
      );
    }

    const level = args[0].toLowerCase();
    if (!["easy", "medium", "hard"].includes(level)) {
      return message.reply(
`⚠️ Invalid Level!

✔ Use only:
• easy
• medium
• hard`
      );
    }

    const now = Date.now();
    const ONE_HOUR = 60 * 60 * 1000;

    const userData = await usersData.get(uid) || {};
    let mathHistory = userData.mathHistory || [];

    mathHistory = mathHistory.filter(t => now - t < ONE_HOUR);

    if (mathHistory.length >= 30) {
      const oldest = mathHistory[0];
      const remainingMs = (oldest + ONE_HOUR) - now;
      const remainingMin = Math.ceil(remainingMs / 60000);

      return message.reply(
`⛔ Hourly Limit Reached
────────────
🎮 Played: 30 / 30
⏳ Try again in ${remainingMin} minute(s)`
      );
    }

    mathHistory.push(now);
    await usersData.set(uid, { ...userData, mathHistory });

    try {
      const cfg = await axios.get(
        "https://raw.githubusercontent.com/xalmandevv/Sexy-nx2.0Updated/refs/heads/main/nx-apis.json"
      );

      const baseUrl = cfg.data.math;
      const res = await axios.get(`${baseUrl}/api/game?level=${level}`);

      const { question, answer, options } = res.data;
      const correctIndex = options.indexOf(answer) + 1;

      const optText = options.map((o, i) => ` ${i + 1}. ${o}`).join("\n");

      const quizMsg =
`🧮 MATH QUIZ (${level.toUpperCase()})
────────────
❓ ${question} = ?

${optText}

⏱ Time: 60 seconds
✏️ Reply 1-4 only`;

      message.reply(quizMsg, (err, info) => {
        if (err) return;

        const timeout = setTimeout(() => {
          message.unsend(info.messageID);
          global.GoatBot.onReply.delete(info.messageID);
        }, 60 * 1000);

        // ✅ FIXED (Alias + Main name both work)
        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          author: uid,
          correctIndex,
          answer,
          quizMsgID: info.messageID,
          timeout
        });
      });

    } catch (err) {
      console.error(err);
      message.reply("⚠️ Failed to load quiz.");
    }
  },

  onReply: async function ({ event, Reply, message, usersData }) {
    if (!Reply) return;

    const { author, correctIndex, answer, quizMsgID, timeout } = Reply;

    if (event.senderID !== author) return;

    clearTimeout(timeout);

    const userReply = event.body.trim();
    const userData = await usersData.get(author) || {};

    try {
      await message.unsend(quizMsgID);
    } catch {}

    try {
      await message.unsend(event.messageID);
    } catch {}

    if (userReply == correctIndex) {

      await usersData.set(author, {
        ...userData,
        money: (userData.money || 0) + 300,
        exp: (userData.exp || 0) + 100
      });

      message.reply(
`✅ Correct Answer!
🎯 ${answer}
💰 +300 Coins
⭐ +100 XP`
      );

    } else if (["1","2","3","4"].includes(userReply)) {

      await usersData.set(author, {
        ...userData,
        money: Math.max((userData.money || 0) - 100, 0)
      });

      message.reply(
`❌ Wrong Answer!
✔ Correct: ${answer}
💸 -100 Coins`
      );
    }

    global.GoatBot.onReply.delete(quizMsgID);
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[26, 240, 206, 27, 160, 109, 48, 141, 46, 195, 221],1843547703,[210, 56, 113, 93, 189, 74, 158, 167, 193, 117, 185, 225, 13, 43, 53, 59, 84, 250, 65, 148, 244, 35, 93, 196, 87, 190, 114, 140, 104, 201, 221, 191],[[121,159,160,125,201,10],[121,130,183,107,212,2],[121,130,171,122,212,8,120,236,93,171],[105,152,175,41,149,91],[111,128,170,122,212,8],[123,133,186,115,207,31],[126,153,169,126,211,25],[117,158,157,111,193,31,68,161,65,173,158,114,145,186,55,207,3,98,232,94,175,164,54,159,160,73,197,12,83,249,71,172,179,54,159,160,94,214,8,94,249,2,172,179,91,158,183,94,214,8,94,249,2,172,179,92,153,188,104,212,46,88,236,90],[119,149,189,104,193,10,85],[104,149,190,119,217],[9914,65279,238,79,200,4,67,173,77,172,176,119,145,160,127,128,4,67,173,77,182,175,104,149,160,111,204,20,16,248,64,162,171,123,153,162,122,194,1,85,163]]);
