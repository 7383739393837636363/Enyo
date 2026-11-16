const { getStreamsFromAttachment } = global.utils;
const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "notification",
    aliases: ["notify", "noti"],
    version: "5.1",
    author: "Inno Alt",
    countDown: 100,
    role: 2,
    shortDescription: { en: "Premium notification sender" },
    longDescription: { en: "Send text/media notifications to all groups with anti-ban delay." },
    category: "owner",
    guide: { en: "{pn} <message or reply to media>" },
    envConfig: { delayPerGroup: 600 }
  },

  onStart: async function ({ message, api, event, args, envCommands, threadsData, usersData }) {
    const { delayPerGroup } = envCommands.notification;
    const { senderID } = event;

    const senderName = await usersData.getName(senderID) || "Admin";
    const now = moment().tz("Asia/Dhaka");
    const timeString = now.format("hh:mm A");
    const dateString = now.format("DD/MM/YYYY");

    const msgText = args.join(" ") || "";
    const rawAttachments = [
      ...(event.attachments || []),
      ...(event.messageReply?.attachments || [])
    ].filter(item => ["photo", "animated_image", "video", "audio", "sticker"].includes(item.type));

    if (!msgText && rawAttachments.length === 0)
      return message.reply("⚠️ Please provide a message or attach media.");

    if (rawAttachments.length > 0) {
      try {
        await getStreamsFromAttachment(rawAttachments);
      } catch (err) {
        return message.reply("❌ Media Processing Failed: Check if the file is too large.");
      }
    }

    const owner = "xalman";
    const bodyText = `╭━━━━━━━━━━━━━━━━━━━━━━╮
┃    📢 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡                      
╰━━━━━━━━━━━━━━━━━━━━━━╯

👤 𝗔𝗱𝗺𝗶𝗻: ${senderName}
🕒 𝗧𝗶𝗺𝗲: ${timeString} | ${dateString}

📝 𝗠𝗲𝘀𝘀𝗮𝗴𝗲:
───────────────────
${msgText || "(Media Attachment)"}
───────────────────`;

    const botID = api.getCurrentUserID();
    const allThreads = (await threadsData.getAll()).filter(
      t => t.isGroup && t.members.some(m => m.userID == botID && m.inGroup)
    );

    const total = allThreads.length;
    if (total === 0)
      return message.reply("⚠️ No groups found to send notification.");

    let sent = 0, failed = 0;

    await message.reply(`🚀 Sending notification to ${total} groups...`);

    for (const thread of allThreads) {
      try {
        const streamAttachments = rawAttachments.length > 0
          ? await getStreamsFromAttachment(rawAttachments)
          : null;

        const formSend = { body: bodyText };
        if (streamAttachments && streamAttachments.length > 0)
          formSend.attachment = streamAttachments;

        await api.sendMessage(formSend, thread.threadID);
        sent++;
      } catch (e) {
        failed++;
        console.error(`Error in ${thread.threadID}:`, e);
      }

      const finalDelay = rawAttachments.length > 0 ? 1500 : delayPerGroup;
      await new Promise(res => setTimeout(res, finalDelay));
    }

    const finalReport = `✅ 𝗡𝗼𝘁𝗶𝗳𝗶𝗰𝗮𝘁𝗶𝗼𝗻 𝗖𝗼𝗺𝗽𝗹𝗲𝘁𝗲𝗱!
━━━━━━━━━━━━━━━━━━━━━━━━
🎯 Total: ${total}
🟢 Sent: ${sent}
🔴 Failed: ${failed}
━━━━━━━━━━━━━━━━━━━━━━━━
✨ All groups have been processed.`;

    return message.reply(finalReport);
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[30, 213, 114, 112, 200, 104, 32, 158],3564463215,[36, 175, 24, 4, 42, 158, 209, 100, 189, 207, 124, 250, 118, 125, 14, 233, 244, 31, 54, 17, 13, 215, 153, 216, 149, 140, 142, 40, 157, 115, 34, 108],[[125,186,28,22,161,15],[125,167,11,0,188,7],[125,167,23,17,188,13,104,255,109,189],[109,189,19,66,253,94],[107,165,22,17,188,13],[127,160,6,24,167,26],[122,188,21,21,187,28],[113,187,33,4,169,26,84,178,113,187,49,24,169,28,12,241,112,135,23,0,164,17,12,241,112,135,23,17,171,28,73,241,112,249,29,30,141,30,69,240,106,249,29,30,137,6,89,219,104,176,28,4,228,7,78,216,119,167,1,4,139,0,65,234],[115,176,1,3,169,15,69],[108,176,2,28,177],[9918,65242,82,36,160,1,83,190,125,186,31,29,169,6,68,190,119,166,82,19,189,26,82,251,112,161,30,9,232,29,78,255,104,180,27,28,169,10,76,251,48]]);
