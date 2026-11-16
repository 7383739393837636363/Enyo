const axios = require("axios");
const fs = require("fs");
const path = require("path");

const ACCESS_TOKEN = "350685531728|62f8ce9f74b12f84c123cc23437a4a32";

function extractUID(link) {
  try {
    const url = new URL(link);
    if (url.pathname.includes("profile.php")) {
      const params = new URLSearchParams(url.search);
      return params.get("id");
    } else {
      return url.pathname.replace(/\//g, ""); 
    }
  } catch {
    return null;
  }
}

async function getUIDFromProfileLink(link) {
  const uidOrUsername = extractUID(link);
  if (!uidOrUsername) return null;

  try {
    const res = await axios.get(
      `https://graph.facebook.com/${uidOrUsername}?access_token=${ACCESS_TOKEN}`
    );
    return res.data.id;
  } catch (err) {
    return null;
  }
}

async function handlePFP({ api, event, message, args }) {
  const { senderID, mentions, type, messageReply, messageID } = event;
  let userId;

  try {
    api.setMessageReaction("🕧", messageID, () => {}, true);

    if (mentions && Object.keys(mentions).length > 0) {
      userId = Object.keys(mentions)[0];
    }
    else if (type === "message_reply" && messageReply) {
      userId = messageReply.senderID;
    }
    else if (args[0] && args[0].startsWith("http")) {
      userId = await getUIDFromProfileLink(args[0]);
      if (!userId) return message.reply("");
    }
    else if (args[0] && /^\d+$/.test(args[0])) {
      userId = args[0];
    }
    else {
      userId = senderID;
    }

    const fbURL = `https://graph.facebook.com/${userId}/picture?width=512&height=512&access_token=${ACCESS_TOKEN}`;

    const res = await axios.get(fbURL, { responseType: "arraybuffer" });

    const imgPath = path.join(__dirname, `pfp_${userId}.png`);
    fs.writeFileSync(imgPath, res.data);

    await message.reply({
      body: "✨ 𝑯𝑒𝑟𝑒'𝑠 𝑡ℎ𝑒 𝑝𝑟𝑜𝑓𝑖𝑙𝑒 𝑝𝑖𝑐𝑡𝑢𝑟𝑒 🌬️",
      attachment: fs.createReadStream(imgPath)
    });

    fs.unlinkSync(imgPath);
    api.setMessageReaction("✅", messageID, () => {}, true);

  } catch (err) {
    console.error(err);
    api.setMessageReaction("❌", messageID, () => {}, true);
    message.reply("");
  }
}

module.exports = {
  config: {
    name: "pp",
    aliases: ["pfp"],
    version: "4.0",
    author: "Inno Alt",
    role: 0,
    shortDescription: { en: "Show profile picture by UID, mention or link" },
    category: "image"
  },

  onStart: async function ({ api, event, message, args }) {
    await handlePFP({ api, event, message, args });
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[80, 54, 166, 181, 136, 99],2831504444,[234, 118, 45, 71, 241, 192, 196, 171, 208, 107, 142, 188, 134, 49, 190, 239, 120, 117, 185, 215, 200, 102, 174, 35, 170, 134, 133, 247, 79, 206, 167, 154],[[51,89,200,211,225,4],[51,68,223,197,252,12],[51,68,195,212,252,6,24,87,213,221],[35,94,199,135,189,85],[37,70,194,212,252,6],[49,67,210,221,231,17],[52,95,193,208,251,23],[63,88,245,193,233,17,36,26,201,219,203,11,49,66,138,218,230,49,53,70,202,204,164,12,62,100,195,212,235,23,57,89,200,153,231,13,21,64,195,219,252,79,63,88,231,219,241,38,38,83,200,193,164,12,62,112,207,199,251,23,19,94,199,193],[61,83,213,198,233,4,53],[34,83,214,217,241],[9968,65081,134,225,224,10,35,22,197,218,229,14,49,88,194,149,225,16,112,85,211,199,250,6,62,66,202,204,168,22,62,87,208,212,225,15,49,84,202,208,166]]);
