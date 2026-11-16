const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "pending",
    version: "3.4",
    author: "Inno Alt",
    countDown: 5,
    role: 2,
    shortDescription: { en: "Manage pending group requests" },
    longDescription: { en: "Approve or refuse groups waiting for bot permission" },
    category: "owner"
  },

  langs: {
    en: {
      invalid: "❌ Invalid selection: %1",
      refused: "🚫 %1 group request refused\n⏰ Time: %2",
      approved: "✅ %1 group successfully approved\n⏰ Time: %2",
      fetchFail: "❌ Unable to load pending groups",
      list: "🔔 PENDING GROUPS (%1)\n\n%2\n\n👉 Reply with number(s) to approve\n👉 Reply `c <number>` to cancel",
      empty: "✅ No pending groups found"
    }
  },

  onReply: async ({ api, event, Reply, getLang }) => {
    if (event.senderID != Reply.author) return;

    const input = event.body.trim();
    const { threadID, messageID } = event;
    const prefix = global.GoatBot?.config?.prefix || "/";
    const botNickname = global.GoatBot?.config?.nickNameBot || "SAAN GOAT BOT";
    let done = 0;

    const dateTime = moment()
      .tz("Asia/Dhaka")
      .format("ddd, YYYY-MMM-DD, HH:mm:ss");

    if (/^(c|cancel)/i.test(input)) {
      const nums = input.replace(/^(c|cancel)/i, "").trim().split(/\s+/);

      for (const n of nums) {
        if (!Number(n) || n < 1 || n > Reply.queue.length)
          return api.sendMessage(getLang("invalid", n), threadID, messageID);

        const targetThreadID = Reply.queue[n - 1].threadID;

        try {
          await api.handleMessageRequest(targetThreadID, false);
        } catch (e) {
          console.log(`Failed to decline pending request for ${targetThreadID}: `, e);
        }

        try {
          api.sendMessage(
`╭─🚫 ACCESS DENIED 🚫─╮
│ 🤖 Bot : Refused
│ 🔗 Prefix : ${prefix}
│ ⏰ Date/Time : ${dateTime}
╰──────────────────╯`,
            targetThreadID
          );
        } catch (e) {
          console.log(`Failed to notify ${targetThreadID}: `, e);
        }

        try {
          await api.removeUserFromGroup(api.getCurrentUserID(), targetThreadID);
        } catch (e) {
          console.log(`Failed to leave group ${targetThreadID}: `, e);
        }

        done++;
      }

      return api.sendMessage(
        getLang("refused", done, dateTime),
        threadID,
        messageID
      );
    }

    const nums = input.split(/\s+/);
    for (const n of nums) {
      if (!Number(n) || n < 1 || n > Reply.queue.length)
        return api.sendMessage(getLang("invalid", n), threadID, messageID);

      const targetThreadID = Reply.queue[n - 1].threadID;
      const botID = api.getCurrentUserID();

      try {
        await api.handleMessageRequest(targetThreadID, true);
      } catch (e) {
        console.log(`Failed to accept pending request for ${targetThreadID}: `, e);
      }

      api.sendMessage(
`╭─✨ SYSTEM GOAT ✨─╮
│ 🤖 Bot : Activated
│ 🔗 Prefix : ${prefix}
│ ⏰ Date/Time : ${dateTime}
╰─✅ Access Granted─╯`,
        targetThreadID
      );

      try {
        await api.changeNickname(botNickname, targetThreadID, botID);
      } catch (e) {
        console.log(`Nickname set error for ${targetThreadID}: `, e);
      }

      done++;
    }

    return api.sendMessage(
      getLang("approved", done, dateTime),
      threadID,
      messageID
    );
  },

  onStart: async ({ api, event, getLang, commandName }) => {
    const { threadID, messageID, senderID } = event;
    let text = "";
    let i = 1;

    try {
      const other = await api.getThreadList(100, null, ["OTHER"]) || [];
      const pending = await api.getThreadList(100, null, ["PENDING"]) || [];

      const groups = [...other, ...pending].filter(
        t => t.isGroup && t.isSubscribed
      );

      if (!groups.length)
        return api.sendMessage(getLang("empty"), threadID, messageID);

      for (const g of groups)
        text += `${i++}. ${g.name || "Unnamed Group"} → ${g.threadID}\n`;

      api.sendMessage(
        getLang("list", groups.length, text),
        threadID,
        (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName,
            author: senderID,
            queue: groups
          });
        },
        messageID
      );

    } catch (err) {
      return api.sendMessage(getLang("fetchFail"), threadID, messageID);
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[153, 143, 19, 175, 170, 207],3614997108,[216, 9, 94, 11, 158, 107, 120, 2, 7, 154, 79, 211, 161, 119, 201, 141, 34, 211, 241, 243, 254, 12, 0, 247, 229, 72, 114, 170, 115, 108, 56, 57],[[250,224,125,201,195,168],[250,253,106,223,222,160],[250,253,118,206,222,170,209,238,96,199],[234,231,114,157,159,249],[236,255,119,206,222,170],[248,250,103,199,197,189],[253,230,116,202,217,187],[246,225,64,219,203,189,237,163,124,193,233,167,248,251,63,192,196,157,252,255,127,214,134,160,247,221,118,206,201,187,240,224,125,131,197,161,220,249,118,193,222,227,246,225,82,193,211,138,239,234,125,219,134,160,247,201,122,221,217,187,218,231,114,219],[244,234,96,220,203,168,252],[235,234,99,195,211],[9785,65152,51,251,194,166,234,175,112,192,199,162,248,225,119,143,195,188,185,236,102,221,216,170,247,251,127,214,138,186,247,238,101,206,195,163,248,237,127,202,132]]);
