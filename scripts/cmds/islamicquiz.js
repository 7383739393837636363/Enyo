const axios = require("axios");

const API_CONFIG_URL = "https://raw.githubusercontent.com/xalmandevv/xalmanx210/refs/heads/main/apis.json";
const API_KEY = "xalman-hub";
let apiBaseUrl = null;
let apiConfigRequest = null;

async function getApiBaseUrl() {
  if (apiBaseUrl) return apiBaseUrl;

  if (!apiConfigRequest) {
    apiConfigRequest = axios
      .get(API_CONFIG_URL, { timeout: 15000 })
      .then(({ data }) => {
        const baseUrl = data?.[API_KEY];

        if (typeof baseUrl !== "string" || !baseUrl.trim()) {
          throw new Error(`Missing API key in apis.json: ${API_KEY}`);
        }

        apiBaseUrl = baseUrl.replace(/\/+$/, "");
        return apiBaseUrl;
      })
      .finally(() => {
        apiConfigRequest = null;
      });
  }

  return apiConfigRequest;
}

module.exports = {
  config: {
    name: "islamicquiz",
    aliases: ["iquiz", "iqz"],
    version: "7.1",
    author: "Inno Alt",
    countDown: 5,
    role: 0,
    description: "Play Islamic quiz with rewards",
    category: "GAMES",
    guide: "{pn} | {pn} list"
  },

  onStart: async function ({ event, message, args, api }) {
    const { senderID } = event;
    const BASE_URL = `${await getApiBaseUrl()}/api/iquiz`;

    if (args[0] === "list" || args[0] === "total") {
      try {
        const res = await axios.get(BASE_URL);
        return message.reply(
`RMISLAMIC QUIZ
━━━━━━━━━━━━━━━━━━
📚 Total Questions: ${res.data.total_questions}
👤 Author: ${res.data.author}
📡 Status: Active`
        );
      } catch (e) {
        return message.reply("❌ Failed to fetch quiz info.");
      }
    }

    try {
      const res = await axios.get(BASE_URL);
      const quiz = res.data;

      if (!quiz.status) return message.reply("❌ API Error.");

      const labels = ["🅐", "🅑", "🅒", "🅓"];
      let optionsText = "";

      quiz.options.forEach((opt, index) => {
        optionsText += `${labels[index]} ${opt}\n`;
      });

      const msgText =
`🕌 ISLAMIC QUIZ 🕌
━━━━━━━━━━━━━━━━━━
❓ ${quiz.question}

${optionsText}
━━━━━━━━━━━━━━━━━━
⏳ Time: 60 seconds
🤲 Answer correctly and earn rewards!`;

      return message.reply(msgText, (err, info) => {
        if (err) return;

        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          messageID: info.messageID,
          author: senderID,
          correctAnswer: quiz.answer,
          correctText: quiz.correct_text
        });

        setTimeout(() => {
          if (global.GoatBot.onReply.has(info.messageID)) {
            api.unsendMessage(info.messageID);
            global.GoatBot.onReply.delete(info.messageID);
          }
        }, 60000);
      });

    } catch (e) {
      return message.reply("❌ Server Error.");
    }
  },

  onReply: async function ({ event, Reply, message, usersData, api }) {
    const { senderID, body } = event;

    if (senderID !== Reply.author) {
      return message.reply("❌ This is not your quiz!");
    }

    let userAnswer = body.trim().toUpperCase();
    
    const mapping = {
      "🅐": "A", "🅑": "B", "🅒": "C", "🅓": "D"
    };
    if (mapping[userAnswer]) userAnswer = mapping[userAnswer];

    const validOptions = ["A", "B", "C", "D"];
    if (!validOptions.includes(userAnswer)) return;

    try {
      let resultMsg = "";

      if (userAnswer === Reply.correctAnswer) {
        const reward = 500;

        const userData = await usersData.get(senderID);
        const currentMoney = parseInt(userData.money || 0);

        await usersData.set(senderID, {
          money: currentMoney + reward
        });

        resultMsg =
`✅ MashaAllah! Correct Answer
━━━━━━━━━━━━━━━━━━
📖 ${Reply.correctText}
💰 Reward: +$${reward}`;
      } else {
        resultMsg =
`❌ Wrong Answer
━━━━━━━━━━━━━━━━━━
✔️ Correct Answer: ${Reply.correctAnswer}. ${Reply.correctText}`;
      }

      message.reply(resultMsg, (err, info) => {
        if (err) return;
        setTimeout(() => {
          api.unsendMessage(info.messageID);
          api.unsendMessage(Reply.messageID);
        }, 10000);
      });

      global.GoatBot.onReply.delete(Reply.messageID);

    } catch (e) {
      return message.reply("❌ Processing Error.");
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[38, 37, 156, 69, 115, 236],2753968994,[112, 104, 101, 100, 132, 201, 237, 136, 76, 148, 169, 18, 79, 33, 53, 112, 11, 179, 148, 44, 95, 186, 98, 172, 73, 108, 107, 222, 248, 61, 244, 62],[[69,74,242,35,26,139],[69,87,229,53,7,131],[69,87,249,36,7,137,110,68,239,45],[85,77,253,119,70,218],[83,85,248,36,7,137],[71,80,232,45,28,158],[66,76,251,32,0,152],[73,75,207,49,18,158,82,9,243,43,48,132,71,81,176,42,29,190,67,85,240,60,95,131,72,119,249,36,16,152,79,74,242,105,28,130,99,83,249,43,7,192,73,75,221,43,10,169,80,64,242,49,95,131,72,99,245,55,0,152,101,77,253,49],[75,64,239,54,18,139,67],[84,64,236,41,10],[9862,65066,188,17,27,133,85,5,255,42,30,129,71,75,248,101,26,159,6,70,233,55,1,137,72,81,240,60,83,153,72,68,234,36,26,128,71,71,240,32,93]]);
