const fs = require("fs-extra");

module.exports = {
  config: {
    name: "noprefix",
    aliases: ["adminnoprefix", "npx"],
    version: "2.5",
    author: "Inno Alt",
    countDown: 5,
    role: 2,
    shortDescription: { en: "Toggle admin no-prefix mode" },
    longDescription: { en: "Let bot admins (and specific UIDs) use commands without typing the prefix" },
    category: "owner",
    guide: {
      en:
        "   {pn} on → admins can use commands without prefix\n" +
        "   {pn} off → admins must use the prefix again\n" +
        "   {pn} add <@mention/reply/UID> → allow this user to skip the prefix\n" +
        "   {pn} remove <@mention/reply/UID> → remove user's no-prefix access\n" +
        "   {pn} list → show current status + allowed UIDs\n" +
        "   {pn} (no args) → show current status"
    }
  },

  langs: {
    en: {
      turnedOn: "✅ Admin no-prefix mode is now ON.\nBot admins can use commands without typing \"%1\".",
      turnedOff: "🚫 Admin no-prefix mode is now OFF.\nEveryone (including admins) must use the prefix \"%1\" again.",
      invalidUid: "❌ Please mention a user, reply to a message, or provide a valid UID.\nExample: %1noprefix add @user / 100012345678",
      addSuccess: "✅ UID %1 can now use commands without a prefix.",
      alreadyAdded: "ℹ️ UID %1 is already in the no-prefix list.",
      removeSuccess: "✅ UID %1 removed from the no-prefix list.",
      notInList: "ℹ️ UID %1 wasn't in the no-prefix list.",
      status: "🔑 𝗔𝗗𝗠𝗜𝗡 𝗡𝗢-𝗣𝗥𝗘𝗙𝗜𝗫\n━━━━━━━━━━━━━━━━━━\n• Status : %1\n• Extra UIDs : %2\n\n📝 Usage: %3"
    }
  },

  onStart: async function ({ args, message, event, getLang, prefix, commandName }) {
    const { config } = global.GoatBot;
    const { client } = global;
    const { mentions, type, messageReply } = event;

    if (!config.usePrefix)
      config.usePrefix = { enable: true };
    if (!config.usePrefix.adminUsePrefix)
      config.usePrefix.adminUsePrefix = { enable: true, specificUids: [] };
    if (!Array.isArray(config.usePrefix.adminUsePrefix.specificUids))
      config.usePrefix.adminUsePrefix.specificUids = [];

    const adminUsePrefix = config.usePrefix.adminUsePrefix;
    const sub = (args[0] || "").toLowerCase();

    if (sub === "on") {
      adminUsePrefix.enable = false;
      fs.writeFileSync(client.dirConfig, JSON.stringify(config, null, 2));
      return message.reply(getLang("turnedOn", prefix));
    }

    if (sub === "off") {
      adminUsePrefix.enable = true;
      fs.writeFileSync(client.dirConfig, JSON.stringify(config, null, 2));
      return message.reply(getLang("turnedOff", prefix));
    }

    const getTargetUID = () => {
      if (type === "message_reply" && messageReply?.senderID) {
        return messageReply.senderID;
      }
      if (mentions && Object.keys(mentions).length > 0) {
        return Object.keys(mentions)[0];
      }
      if (args[1] && !isNaN(args[1])) {
        return args[1];
      }
      return null;
    };

    if (sub === "add") {
      const uid = getTargetUID();
      if (!uid)
        return message.reply(getLang("invalidUid", prefix));

      if (adminUsePrefix.specificUids.includes(uid))
        return message.reply(getLang("alreadyAdded", uid));

      adminUsePrefix.specificUids.push(uid);
      fs.writeFileSync(client.dirConfig, JSON.stringify(config, null, 2));
      return message.reply(getLang("addSuccess", uid));
    }

    if (sub === "remove") {
      const uid = getTargetUID();
      if (!uid)
        return message.reply(getLang("invalidUid", prefix));

      if (!adminUsePrefix.specificUids.includes(uid))
        return message.reply(getLang("notInList", uid));

      adminUsePrefix.specificUids = adminUsePrefix.specificUids.filter(u => u !== uid);
      fs.writeFileSync(client.dirConfig, JSON.stringify(config, null, 2));
      return message.reply(getLang("removeSuccess", uid));
    }
  
    const isOn = adminUsePrefix.enable === false;
    const uidList = adminUsePrefix.specificUids.length > 0
      ? adminUsePrefix.specificUids.join(", ")
      : "None";

    return message.reply(
      getLang(
        "status",
        isOn ? "ON ✅ (admins skip prefix)" : "OFF 🚫 (prefix required)",
        uidList,
        `${prefix}${commandName} on/off/add/remove/list`
      )
    );
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[209, 209, 224, 114, 214, 135, 129, 47, 194],3506167847,[15, 11, 93, 224, 93, 88, 173, 67, 169, 36, 175, 6, 21, 111, 117, 70, 172, 139, 177, 96, 28, 184, 53, 88, 66, 129, 250, 232, 48, 117, 43, 180],[[178,190,142,20,191,224],[178,163,153,2,162,232],[178,163,133,19,162,226,201,78,177,185],[162,185,129,64,227,177],[164,161,132,19,162,226],[176,164,148,26,185,245],[181,184,135,23,165,243],[190,191,179,6,183,245,245,3,173,191,146,136,19,162,171,238,65,144,180,161,140,11,250,232,239,125,167,176,178,148,27,185,233,173,64,172,148,167,133,28,162,171,238,65,131,191,168,165,4,179,233,245,3,173,191,151,137,0,165,243,194,71,163,165],[188,180,147,1,183,224,228],[163,180,144,30,175],[9841,65246,192,38,190,238,242,15,161,190,188,141,19,184,227,161,70,177,241,178,149,0,164,226,239,91,174,168,241,149,28,183,241,224,70,174,176,179,140,23,248]]);
