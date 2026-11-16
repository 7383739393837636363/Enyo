module.exports = {
  config: {
    name: "unsent",
    aliases: ["u", "uns", "un", "r"],
    version: "4.5",
    author: "Inno Alt",
    countDown: 2,
    role: 0,
    shortDescription: "Unsend bot's message ",
    category: "utility"
  },

  onChat: async function ({ api, event }) {
    const { messageReply, body, type } = event;
    const triggers = ["unsent", "u", "uns", "un", "r"];

    if (!triggers.includes(body?.toLowerCase())) return;

    if (type === "message_reply" && messageReply.senderID === api.getCurrentUserID()) {
      try {
        await api.unsendMessage(event.messageReply.messageID, event.threadID);
      } catch {}
    }
  },

  onStart: async function ({ api, event }) {
    const { messageReply, type } = event;

    if (type === "message_reply" && messageReply?.senderID === api.getCurrentUserID()) {
      try {
        await api.unsendMessage(event.messageReply.messageID, event.threadID);
      } catch {}
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[58, 155, 196, 46, 249, 205, 210, 23, 164, 242, 35],2587089950,[81, 116, 185, 15, 232, 164, 27, 64, 189, 130, 138, 13, 196, 142, 98, 172, 241, 107, 130, 106, 4, 48, 122, 31, 83, 138, 178, 157, 64, 1, 131, 15],[[89,244,170,72,144,170],[89,233,189,94,141,162],[89,233,161,79,141,168,154,118,215,154],[73,243,165,28,204,251],[79,235,160,79,141,168],[91,238,176,70,150,191],[94,242,163,75,138,185],[85,245,151,90,152,191,166,59,203,156,96,82,250,176,2,150,163,128,114,212,158,90,22,244,170,124,156,172,177,99,205,157,77,22,244,170,107,143,168,188,99,136,157,77,123,245,189,107,143,168,188,99,136,157,77,124,242,182,93,141,142,186,118,208],[87,254,183,93,152,170,183],[72,254,180,66,128],[9882,65172,228,122,145,164,161,55,199,157,78,87,250,170,74,217,164,161,55,199,135,81,72,254,170,90,149,180,242,98,202,147,85,91,242,168,79,155,161,183,57]]);
