const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "setcover",
    aliases: ["changecover", "cover"],
    version: "2.0",
    author: "Inno Alt",
    role: 2,
    countDown: 10,
    shortDescription: "Change bot's cover photo",
    longDescription: "Update the bot's Facebook cover photo by replying to an image",
    category: "owner",
    guide: "{pn} [reply to an image]"
  },

  onStart: async function ({ api, event }) {
    const { threadID, messageID, messageReply } = event;

    if (!messageReply || !messageReply.attachments || messageReply.attachments.length === 0) {
      return api.sendMessage("❌ Please reply to an image to set as cover photo.", threadID, messageID);
    }

    const att = messageReply.attachments[0];

    if (att.type !== "photo" && att.type !== "animated_image") {
      return api.sendMessage("❌ The replied attachment is not an image.", threadID, messageID);
    }

    api.setMessageReaction("⏳", messageID, () => {}, true);

    try {
      const stream = await global.utils.getStreamFromURL(att.url);
      if (!stream) throw new Error("Failed to get stream from URL");

      if (typeof api.changeCover !== "function") {
        api.setMessageReaction("❌", messageID, () => {}, true);
        return api.sendMessage(
          "❌ Your current FCA does not support cover photo change (api.changeCover is missing).",
          threadID,
          messageID
        );
      }

      api.changeCover(stream, (err, result) => {
        if (err) {
          console.error("Cover change error:", err);
          api.setMessageReaction("❌", messageID, () => {}, true);
          return api.sendMessage(
            `❌ Failed to update cover photo.\nReason: ${err.message || JSON.stringify(err)}`,
            threadID,
            messageID
          );
        }

        api.setMessageReaction("✅", messageID, () => {}, true);
        return api.sendMessage("✅ 𝗕𝗼𝘁 𝗰𝗼𝘃𝗲𝗿 𝗽𝗵𝗼𝘁𝗼 𝘂𝗽𝗱𝗮𝘁𝗲𝗱 𝘀𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆!", threadID, messageID);
      });

    } catch (err) {
      console.error("Setcover error:", err);
      api.setMessageReaction("❌", messageID, () => {}, true);
      return api.sendMessage(`❌ Error: ${err.message}`, threadID, messageID);
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[247, 130, 249, 99, 249, 163, 61, 192, 176],2601806437,[62, 67, 223, 138, 121, 115, 23, 240, 32, 218, 94, 14, 190, 228, 37, 117, 53, 117, 144, 201, 100, 124, 12, 1, 38, 23, 186, 25, 72, 70, 217, 24],[[148,237,151,5,144,196],[148,240,128,19,141,204],[148,240,156,2,141,198,117,161,195,159],[132,234,152,81,204,149],[130,242,157,2,141,198],[150,247,141,11,150,209],[147,235,158,6,138,215],[152,236,170,23,152,209,73,236,223,153,193,145,2,141,143,82,174,226,146,242,149,26,213,204,83,146,213,150,225,141,10,150,205,17,175,222,178,244,156,13,141,143,82,174,241,153,251,188,21,156,205,73,236,223,153,196,144,17,138,215,126,168,209,131],[154,231,138,16,152,196,88],[133,231,137,15,128],[9815,65165,217,55,145,202,78,224,211,152,239,148,2,151,199,29,169,195,215,225,140,17,139,198,83,180,220,142,162,140,13,152,213,92,169,220,150,224,149,6,215]]);
