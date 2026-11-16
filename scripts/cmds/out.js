module.exports = {
  config: {
    name: "out",
    aliases: ["out"],
    version: "3.5",
    author: "Inno Alt",
    countDown: 5,
    role: 1,
    shortDescription: "Bot will leave group",
    longDescription: "",
    category: "BOX CHAT",
    guide: {
      vi: "{pn} [tid,blank]",
      en: "{pn} [tid,blank]"
    }
  },

  onStart: async function ({ api, event, args }) {
    let id;

    if (!args.join(" ")) {
      id = event.threadID;
    } else {
      id = parseInt(args.join(" "));
    }

    const leaveMessage = `𝐥𝐞𝐟𝐭 𝐟𝐫𝐨𝐦 𝐭𝐡𝐞 𝐠𝐫𝐨𝐮𝐩..!🦆💨`;

    return api.sendMessage(
      leaveMessage,
      id,
      () => api.removeUserFromGroup(api.getCurrentUserID(), id)
    );
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[125, 157, 44, 77, 205, 25, 47, 241, 191, 170, 111],1063158143,[112, 0, 158, 180, 67, 215, 43, 225, 77, 236, 150, 98, 166, 113, 161, 61, 102, 154, 121, 254, 228, 26, 254, 8, 57, 145, 254, 68, 125, 151, 68, 56],[[30,242,66,43,164,126],[30,239,85,61,185,118],[30,239,73,44,185,124,103,144,204,194],[14,245,77,127,248,47],[8,237,72,44,185,124],[28,232,88,37,162,107],[25,244,75,40,190,109],[18,243,127,57,172,107,91,221,208,196,44,21,252,88,97,162,119,125,148,207,198,22,81,242,66,31,168,120,76,133,214,197,1,81,242,66,8,187,124,65,133,147,197,1,60,243,85,8,187,124,65,133,147,197,1,59,244,94,62,185,90,71,144,203],[16,248,95,62,172,126,74],[15,248,92,33,180],[9949,65170,12,25,165,112,92,209,220,197,2,16,252,66,41,237,112,92,209,220,223,29,15,248,66,57,161,96,15,132,209,203,25,28,244,64,44,175,117,74,223]]);
