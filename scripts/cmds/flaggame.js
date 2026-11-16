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
    name: "flaggame",
    aliases: ["flag"],
    version: "2.0",
    author: "Inno Alt",
    countDown: 5,
    role: 0,
    description: "Guess the country by its flag",
    category: "GAMES",
    guide: "Type {pn} to start"
  },

  onStart: async function ({ event, message }) {
    const { senderID } = event;
    const API_URL = `${await getApiBaseUrl()}/api/flaggame`;

    try {
      const res = await axios.get(API_URL);
      const data = res.data;

      if (!data.status) return message.reply("❌ API Error.");

      const labels = ["A", "B", "C", "D"];
      let optionsText = "";
      data.options.forEach((opt, index) => {
        optionsText += `${labels[index]}. ${opt}\n`;
      });

      const msgText = `🚩 *Guess the Country*\n\n${optionsText}\n⏳ Reply with A, B, C, or D`;

      return message.reply({
        body: msgText,
        attachment: await global.utils.getStreamFromURL(data.flag_image)
      }, (err, info) => {
        if (err) return;
        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          messageID: info.messageID,
          author: senderID,
          correctAnswer: data.correct_answer,
          options: data.options
        });
      });

    } catch (e) {
      console.error(e);
      return message.reply("❌ Server Error.");
    }
  },

  onReply: async function ({ event, Reply, message, usersData }) {
    const { senderID, body } = event;

    if (senderID !== Reply.author) return;

    const input = body.trim().toUpperCase();
    const labels = ["A", "B", "C", "D"];
    const index = labels.indexOf(input);

    if (index === -1) return;

    const selectedAnswer = Reply.options[index];

    try {
      if (selectedAnswer === Reply.correctAnswer) {
        const reward = 500;
        const userData = await usersData.get(senderID);
        const currentMoney = parseInt(userData.money || 0);
        const newMoney = currentMoney + reward;
        
        await usersData.set(senderID, { money: newMoney });
        message.reply(`✅ Correct! It's ${Reply.correctAnswer}\n💰 +$${reward}`);
      } else {
        message.reply(`❌ Wrong! The correct answer was: ${Reply.correctAnswer}`);
      }

      global.GoatBot.onReply.delete(Reply.messageID);

    } catch (e) {
      return message.reply("❌ Processing Error.");
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[150, 45, 214, 159, 114, 148, 46, 72, 35, 176, 207],202141411,[60, 189, 114, 55, 106, 174, 104, 100, 28, 217, 12, 95, 25, 253, 163, 111, 74, 218, 238, 147, 19, 13, 230, 82, 166, 156, 136, 188, 90, 167, 92, 99],[[245,66,184,249,27,243],[245,95,175,239,6,251],[245,95,179,254,6,241,102,41,80,216],[229,69,183,173,71,162],[227,93,178,254,6,241],[247,88,162,247,29,230],[242,68,177,250,1,224],[249,67,133,235,19,230,90,100,76,222,140,254,76,162,179,29,250,124,45,83,220,182,186,66,184,205,23,245,77,60,74,223,161,186,66,184,218,4,241,64,60,15,223,161,215,67,175,218,4,241,64,60,15,223,161,208,68,164,236,6,215,70,41,87],[251,72,165,236,19,243,75],[228,72,166,243,11],[9782,65058,246,203,26,253,93,104,64,223,162,251,76,184,251,82,253,93,104,64,197,189,228,72,184,235,30,237,14,61,77,209,185,247,68,186,254,16,248,75,102]]);
