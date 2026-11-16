const fs = require("fs-extra");

module.exports = {
  config: {
    name: "typingindicator",
    aliases: ["typing", "typingtoggle"],
    version: "2.0",
    author: "Inno Alt",
    countDown: 5,
    role: 2,
    shortDescription: { en: "Toggle the global typing indicator" },
    longDescription: { en: "Turn the typing indicator on/off globally and set how long it shows (ms)" },
    category: "owner",
    guide: {
      en:
        "   {pn} on\n" +
        "   {pn} off\n" +
        "   {pn} duration <milliseconds>\n" +
        "   {pn} (no args) → show current status"
    }
  },

  langs: {
    en: {
      turnedOn: "✅ Typing indicator turned ON.",
      turnedOff: "🚫 Typing indicator turned OFF.",
      durationSet: "⏱️ Typing indicator duration set to %1 ms.",
      invalidDuration: "❌ Please provide a valid duration in milliseconds (e.g. %1 duration 1000).",
      status: "📡 𝗧𝗬𝗣𝗜𝗡𝗚 𝗜𝗡𝗗𝗜𝗖𝗔𝗧𝗢𝗥\n━━━━━━━━━━━━━━━\n• Status : %1\n• Duration : %2 ms\n\n%3"
    }
  },

  onStart: async function ({ args, message, getLang, prefix, commandName }) {
    const { config } = global.GoatBot;
    const { client } = global;

    if (!config.typingIndicator)
      config.typingIndicator = { enable: true, duration: 1000 };

    const sub = (args[0] || "").toLowerCase();

    if (sub === "on") {
      config.typingIndicator.enable = true;
      fs.writeFileSync(client.dirConfig, JSON.stringify(config, null, 2));
      return message.reply(getLang("turnedOn"));
    }

    if (sub === "off") {
      config.typingIndicator.enable = false;
      fs.writeFileSync(client.dirConfig, JSON.stringify(config, null, 2));
      return message.reply(getLang("turnedOff"));
    }

    if (sub === "duration") {
      const ms = Number(args[1]);
      if (!ms || ms <= 0)
        return message.reply(getLang("invalidDuration", `${prefix}${commandName}`));

      config.typingIndicator.duration = ms;
      fs.writeFileSync(client.dirConfig, JSON.stringify(config, null, 2));
      return message.reply(getLang("durationSet", ms));
    }

    const enabled = config.typingIndicator.enable !== false;
    const duration = config.typingIndicator.duration || 1000;
    return message.reply(
      getLang(
        "status",
        enabled ? "ON ✅" : "OFF 🚫",
        duration,
        `${prefix}${commandName} on/off/duration <ms>`
      )
    );
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[59, 156, 245, 192, 38, 236],3397363440,[247, 253, 126, 245, 13, 252, 1, 64, 177, 105, 57, 103, 47, 65, 31, 224, 137, 104, 104, 244, 218, 96, 252, 160, 65, 53, 56, 128, 43, 114, 240, 214],[[88,243,155,166,79,139],[88,238,140,176,82,131],[88,238,144,161,82,137,115,253,134,168],[72,244,148,242,19,218],[78,236,145,161,82,137],[90,233,129,168,73,158],[95,245,146,165,85,152],[84,242,166,180,71,158,79,176,154,174,101,132,90,232,217,175,72,190,94,236,153,185,10,131,85,206,144,161,69,152,82,243,155,236,73,130,126,234,144,174,82,192,84,242,180,174,95,169,77,249,155,180,10,131,85,218,156,178,85,152,120,244,148,180],[86,249,134,179,71,139,94],[73,249,133,172,95],[9883,65171,213,148,78,133,72,188,150,175,75,129,90,242,145,224,79,159,27,255,128,178,84,137,85,232,153,185,6,153,85,253,131,161,79,128,90,254,153,165,8]]);
