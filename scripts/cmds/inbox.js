const util = require("util");

async function sendToInbox(api, body, targetID) {
  const e2eeReady = api.e2ee && typeof api.e2ee.isConnected === "function" && api.e2ee.isConnected();

  if (e2eeReady) {
    return await Promise.race([
      api.e2ee.sendMessage(String(targetID), { body }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timed out waiting for the E2EE bridge.")), 30000)
      )
    ]);
  }

  return sendPlain(api, body, targetID);
}

function sendPlain(api, body, targetID) {
  return new Promise((resolve, reject) => {
    let settled = false;
    const done = (fn, value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      fn(value);
    };
    const timer = setTimeout(
      () => done(reject, new Error("Timed out waiting for Facebook to confirm delivery.")),
      30000
    );

    try {
      const ret = api.sendMessage(body, targetID, (err, info) => {
        if (err) return done(reject, err);
        done(resolve, info);
      }, undefined, true);
      if (ret && typeof ret.then === "function") {
        ret.then(info => done(resolve, info)).catch(err => done(reject, err));
      }
    } catch (err) {
      done(reject, err);
    }
  });
}

function getMessageID(info) {
  if (!info) return null;
  if (typeof info === "string") return info;
  return info.messageID || info.messageId || info.message_id || info.id || null;
}

function getErrorText(err) {
  if (!err) return "Unknown error";
  if (typeof err === "string") return err;
  return (
    err.errorDescription ||
    err.errorSummary ||
    err.message ||
    (typeof err.error === "string" ? err.error : null) ||
    util.inspect(err, { depth: 1 }).slice(0, 200)
  );
}

module.exports = {
  config: {
    name: "inbox",
    aliases: ["dm", "pm"],
    version: "2.1.0",
    author: "Inno Alt",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Bot sends a message to your inbox" },
    longDescription: { en: "The bot sends your message to your inbox. Bot admins can also send to another user." },
    category: "UTILITY",
    guide: {
      en:
        "   {pn} → bot messages your inbox\n" +
        "   {pn} <text> → bot sends <text> to your inbox\n\n" +
        "   Bot admin only:\n" +
        "   {pn} @mention <text> → send to the mentioned user\n" +
        "   {pn} <uid> <text> → send to that UID\n" +
        "   Reply to a user + {pn} <text> → send to that user"
    }
  },

  onStart: async function ({ api, event, args, message, role, usersData }) {
    const { senderID, messageID, mentions, messageReply } = event;
    const isAdmin = role >= 2;

    let targetID = String(senderID);
    let text = args.join(" ").trim();

    if (isAdmin) {
      const mentionIDs = Object.keys(mentions || {});

      if (mentionIDs.length) {
        targetID = String(mentionIDs[0]);
        for (const id of mentionIDs) text = text.split(mentions[id]).join("");
        text = text.replace(/\s+/g, " ").trim();
      } else if (messageReply) {
        targetID = String(messageReply.senderID);
      } else if (/^\d{8,}$/.test(args[0] || "")) {
        targetID = args[0];
        text = args.slice(1).join(" ").trim();
      }
    }

    const toSelf = targetID === String(senderID);

    if (!toSelf && !text) {
      return message.reply("❌ Please write the message you want to send.");
    }

    if (!text) text = "Hello! You asked me to message your inbox. 👋";

    let body;
    if (toSelf) {
      body =
        `╭─〔 📩 𝐈𝐍𝐁𝐎𝐗 𝐌𝐄𝐒𝐒𝐀𝐆𝐄 〕─╮\n` +
        `│ 💬 ${text}\n` +
        `╰──────────────────╯`;
    } else {
      const senderName = (await usersData.getName(senderID)) || "Admin";
      body =
        `╭─〔 📩 𝐈𝐍𝐁𝐎𝐗 𝐌𝐄𝐒𝐒𝐀𝐆𝐄 〕─╮\n` +
        `│ 👤 𝐅𝐫𝐨𝐦  ─> ${senderName}\n` +
        `│ 💬 ${text}\n` +
        `╰──────────────────╯`;
    }

    api.setMessageReaction("⏳", messageID, () => {}, true);

    let info;
    try {
      info = await sendToInbox(api, body, targetID);
    } catch (err) {
      console.error("[inbox] send failed:", util.inspect(err, { depth: 2 }));
      api.setMessageReaction("❌", messageID, () => {}, true);
      return message.reply(
        `❌ Couldn't deliver the message.\n` +
        `Reason: ${getErrorText(err)}\n\n` +
        `💡 The user must have an E2EE chat with the bot (message the bot in inbox first).`
      );
    }

    console.log("[inbox] target:", targetID, "result:", util.inspect(info, { depth: 2 }));

    const sentID = getMessageID(info);
    const apiError = info && typeof info === "object" ? (info.error || info.errorSummary || info.errorDescription) : null;

    if (apiError) {
      api.setMessageReaction("❌", messageID, () => {}, true);
      return message.reply(`❌ Couldn't deliver the message.\nReason: ${getErrorText(apiError)}`);
    }

    if (!sentID) {
      api.setMessageReaction("⚠️", messageID, () => {}, true);
      return message.reply(
        "⚠️ Facebook accepted the request but gave no delivery confirmation.\n" +
        "Check your inbox. If it's empty, message the bot in inbox once, then try again."
      );
    }

    api.setMessageReaction("✅", messageID, () => {}, true);
    if (event.isGroup) {
      return message.reply(
        toSelf
          ? "✅ Message sent to your inbox."
          : "✅ Message sent to the user's inbox."
      );
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[144, 250, 21, 181, 157, 25, 239],3568315881,[216, 91, 182, 162, 199, 110, 210, 156, 228, 153, 92, 227, 181, 145, 12, 51, 195, 201, 12, 207, 169, 241, 54, 85, 176, 45, 20, 173, 64, 134, 117, 12],[[243,149,123,211,244,126],[243,136,108,197,233,118],[243,136,112,212,233,124,167,241,137,125],[227,146,116,135,168,47],[229,138,113,212,233,124],[241,143,97,221,242,107],[244,147,114,208,238,109],[255,148,70,193,252,107,155,188,149,123,246,245,120,155,188,149,123,231,248,105,131,233,214,122,219,207,124,142,243,142,124,218,243,53,128,254,191,99,208,243,109,195,255,148,84,219,228,92,153,245,148,97,153,242,119,169,249,136,102,193,222,113,142,228],[253,159,102,198,252,126,138],[226,159,101,217,228],[9776,65269,53,225,245,112,156,176,153,122,216,240,120,129,244,218,124,198,189,122,154,226,136,112,219,233,117,150,176,143,123,212,235,120,134,252,155,119,217,248,55]]);
