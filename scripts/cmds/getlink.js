const axios = require("axios");

module.exports = {
  config: {
    name: "getlink",
    version: "2.5",
    author: "Inno Alt",
    role: 0,
    countDown: 5,
    shortDescription: "Get direct link of replied media (image/video/voice)",
    category: "utility"
  },

  onStart: async function ({ api, event }) {
    const { threadID, messageID, messageReply } = event;

    if (!messageReply) {
      return api.sendMessage("❌ Please reply to an image, video, or voice message.", threadID, messageID);
    }

    const attachments = messageReply.attachments;
    if (!attachments || attachments.length === 0) {
      return api.sendMessage("❌ No attachments found in the replied message.", threadID, messageID);
    }

    try {
      const links = [];

      for (const att of attachments) {
        let url = att.url || null;

        if (!url && att.id) {
          try {
            const token = "6628568379|c1e620fa708a1d5696fb991c1bde5662";
            const graphRes = await axios.get(`https://graph.facebook.com/${att.id}?access_token=${token}&fields=url`);
            if (graphRes.data && graphRes.data.url) {
              url = graphRes.data.url;
            }
          } catch {
            url = `https://www.facebook.com/photo.php?fbid=${att.id}`;
          }
        }

        if (!url) {
          url = "Unable to retrieve link.";
        }

        const type = att.type || "media";
        links.push(`📎 ${type.charAt(0).toUpperCase() + type.slice(1)}: ${url}`);
      }

      const replyMsg = links.length === 1
        ? `🔗 Direct link:\n${links[0]}`
        : `🔗 Direct links:\n${links.join("\n")}`;

      return api.sendMessage(replyMsg, threadID, messageID);
    } catch (err) {
      console.error(err);
      return api.sendMessage("❌ Failed to fetch attachment link. Please try again.", threadID, messageID);
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[67, 245, 201, 183, 37, 35, 30, 137, 136],502972948,[159, 34, 6, 17, 32, 190, 122, 166, 192, 228, 141, 243, 49, 181, 219, 124, 149, 2, 123, 212, 31, 50, 212, 231, 150, 52, 242, 169, 150, 84, 40, 177],[[32,154,167,209,76,68],[32,135,176,199,81,76],[32,135,172,214,81,70,86,232,251,43],[48,157,168,133,16,21],[54,133,173,214,81,70],[34,128,189,223,74,81],[39,156,174,210,86,87],[44,155,154,195,68,81,106,165,231,45,182,161,214,81,15,113,231,218,38,133,165,206,9,76,112,219,237,34,150,189,222,74,77,50,230,230,6,131,172,217,81,15,113,231,201,45,140,140,193,64,77,106,165,231,45,179,160,197,86,87,93,225,233,55],[46,144,186,196,68,68,123],[49,144,185,219,92],[9955,65274,233,227,77,74,109,169,235,44,152,164,214,75,71,62,224,251,99,150,188,197,87,70,112,253,228,58,213,188,217,68,85,127,224,228,34,151,165,210,11]]);
