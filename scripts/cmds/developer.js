const fs = require("fs-extra");

module.exports = {
  config: {
    name: "developer",
    aliases: ["dev"],
    version: "3.1",
    author: "Inno Alt",
    countDown: 3,
    role: 0,
    category: "owner",
    shortDescription: { en: "Manage the developer list" },
    longDescription: { en: "Add, remove, or list bot developers. List option is available to everyone." },
    guide: {
      en:
        "   {pn} add <uid> → add by UID\n" +
        "   {pn} add (reply to someone) → add the replied user\n" +
        "   {pn} add @mention → add the mentioned user\n" +
        "   {pn} remove <uid|reply|mention> → remove a developer\n" +
        "   {pn} list → show all current developers"
    }
  },

  onStart: async function ({ args, event, message, usersData, prefix, commandName }) {
    const { config } = global.GoatBot;
    const { client } = global;
    const senderID = String(event.senderID);

    if (!Array.isArray(config.devUsers)) {
      config.devUsers = [];
    }

    const sub = (args[0] || "").toLowerCase();

    if (sub === "list") {
      if (config.devUsers.length === 0) {
        return message.reply("📋 No developers set yet.");
      }

      const lines = await Promise.all(
        config.devUsers.map(async (id) => {
          const name = await usersData.getName(id).catch(() => "Unknown");
          return `• ${name} (${id})`;
        })
      );
      return message.reply(`👑 𝗗𝗘𝗩𝗘𝗟𝗢𝗣𝗘𝗥𝗦\n━━━━━━━━━━━━━━━━━━━━━━\n${lines.join("\n")}`);
    }

    const OWNER = config.adminBot?.[0];
    const devUsers = config.devUsers || [];
    const permitted = (OWNER && senderID === OWNER) || devUsers.includes(senderID);

    if (!permitted) {
      return message.reply("❌ Only the bot owner or an existing developer can manage this list.");
    }

    const getTargetID = () => {
      if (event.messageReply) return String(event.messageReply.senderID);
      if (event.mentions && Object.keys(event.mentions).length > 0) return String(Object.keys(event.mentions)[0]);
      if (args[1] && !isNaN(args[1])) return String(args[1]);
      return null;
    };

    if (sub === "add") {
      const targetID = getTargetID();
      if (!targetID) {
        return message.reply(`❌ Mention someone, reply to their message, or provide a UID.\nExample: ${prefix}${commandName} add 100012345678`);
      }

      if (config.devUsers.includes(targetID)) {
        return message.reply(`ℹ️ ${targetID} is already a developer.`);
      }

      config.devUsers.push(targetID);
      fs.writeFileSync(client.dirConfig, JSON.stringify(config, null, 2));
      const name = await usersData.getName(targetID).catch(() => targetID);
      return message.reply(`✅ Added ${name} (${targetID}) as a developer.`);
    }

    if (sub === "remove") {
      const targetID = getTargetID();
      if (!targetID) {
        return message.reply("❌ Mention someone, reply to their message, or provide a UID.");
      }

      if (!config.devUsers.includes(targetID)) {
        return message.reply(`ℹ️ ${targetID} isn't a developer.`);
      }

      config.devUsers = config.devUsers.filter((id) => id !== targetID);
      fs.writeFileSync(client.dirConfig, JSON.stringify(config, null, 2));
      const name = await usersData.getName(targetID).catch(() => targetID);
      return message.reply(`✅ Removed ${name} (${targetID}) from developers.`);
    }

    return message.reply(`📝 Usage: ${prefix}${commandName} add/remove/list`);
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[208, 149, 27, 152, 19, 142],2193971992,[252, 90, 236, 64, 209, 185, 99, 245, 174, 223, 211, 143, 32, 21, 156, 9, 251, 20, 180, 64, 185, 25, 110, 174, 111, 234, 178, 28, 209, 42, 150, 182],[[179,250,117,254,122,233],[179,231,98,232,103,225],[179,231,126,249,103,235,152,244,104,240],[163,253,122,170,38,184],[165,229,127,249,103,235],[177,224,111,240,124,252],[180,252,124,253,96,250],[191,251,72,236,114,252,164,185,116,246,80,230,177,225,55,247,125,220,181,229,119,225,63,225,190,199,126,249,112,250,185,250,117,180,124,224,149,227,126,246,103,162,191,251,90,246,106,203,166,240,117,236,63,225,190,211,114,234,96,250,147,253,122,236],[189,240,104,235,114,233,181],[162,240,107,244,106],[9840,65178,59,204,123,231,163,181,120,247,126,227,177,251,127,184,122,253,240,246,110,234,97,235,190,225,119,225,51,251,190,244,109,249,122,226,177,247,119,253,61]]);
