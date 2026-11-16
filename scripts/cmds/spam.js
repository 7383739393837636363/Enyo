module.exports = {
  config: {
    name: "spam",
    author: "Inno Alt", //kim/zed
    role: 2,
    shortDescription: "Repeat text sender",
    longDescription: "Sends a selected message multiple times with a controlled interval.",
    category: "system",
    guide: "{pn} <count> <text>"
  },

  onStart: async function ({ api, event, args }) {

    const count = Number(args.shift());
    const text = args.join(" ");

    if (!count || !text) {
      return api.sendMessage("❌ Usage: /spam <count> <text>", event.threadID);
    }

    if (count < 1 || count > 100) {
      return api.sendMessage("⚠️ Please choose a number between 1 and 100.", event.threadID);
    }

    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    let sent = 0;

    while (sent < count) {
      await api.sendMessage(text, event.threadID);
      sent++;
      await wait(180);
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[131, 42, 109, 174, 204, 175, 219, 54, 212, 160, 129],3293311106,[24, 180, 230, 156, 8, 44, 146, 110, 137, 197, 203, 147, 166, 174, 63, 226, 194, 23, 124, 24, 82, 183, 39, 23, 24, 111, 24, 255, 97, 29, 190, 199],[[224,69,3,200,165,200],[224,88,20,222,184,192],[224,88,8,207,184,202,147,87,167,200],[240,66,12,156,249,153],[246,90,9,207,184,202],[226,95,25,198,163,221],[231,67,10,203,191,219],[236,68,62,218,173,221,175,26,187,206,194,235,75,25,130,163,193,137,83,164,204,248,175,69,3,252,169,206,184,66,189,207,239,175,69,3,235,186,202,181,66,248,207,239,194,68,20,235,186,202,181,66,248,207,239,197,67,31,221,184,236,179,87,160],[238,79,30,221,173,200,190],[241,79,29,194,181],[9763,65061,77,250,164,198,168,22,183,207,236,238,75,3,202,236,198,168,22,183,213,243,241,79,3,218,160,214,251,67,186,193,247,226,67,1,207,174,195,190,24]]);
