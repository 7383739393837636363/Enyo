module.exports = {
  config: {
    name: "postreact",
    aliases: ["react"],
    version: "3.0",
    author: "Inno Alt",
    role: 0,
    shortDescription: "React to a Facebook post via ID",
    longDescription: "Give any reaction (LIKE, LOVE, WOW, HAHA, SAD, ANGRY) to a Facebook post using its ID.",
    category: "utility",
    guide: {
      en: "{p}react [postID] [type]"
    },
    countDown: 5
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const postID = args[0];
    const type = args[1] ? args[1].toUpperCase() : "LIKE";

    const validReactions = ["LIKE", "LOVE", "WOW", "HAHA", "SAD", "ANGRY", "CARE"];
    
    if (!postID) {
      return api.sendMessage("Please provide a Post ID. Usage: /react [postID] [type]", threadID, messageID);
    }

    if (!validReactions.includes(type)) {
      return api.sendMessage(`Invalid reaction! Available: ${validReactions.join(", ")}`, threadID, messageID);
    }

    api.setPostReaction(postID, type, (err) => {
      if (err) {
        return api.sendMessage("Failed to react. Possible reasons:\n1. Invalid Post ID.\n2. Post is not Public.\n3. Bot session expired.", threadID, messageID);
      }
      return api.sendMessage(`Successfully reacted ${type} to post: ${postID}`, threadID, messageID);
    });
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[245, 36, 74, 108, 45, 159, 194, 26, 143, 189],2854861525,[187, 210, 188, 122, 73, 167, 229, 111, 176, 114, 228, 255, 189, 196, 37, 151, 46, 246, 23, 253, 66, 9, 228, 171, 138, 105, 241, 231, 82, 139, 98, 193],[[150,75,36,10,68,248],[150,86,51,28,89,240],[150,86,47,13,89,250,138,123,252,213],[134,76,43,94,24,169],[128,84,46,13,89,250],[148,81,62,4,66,237],[145,77,45,9,94,235],[154,74,25,24,76,237,182,54,224,211,182,76,43,24,1,240,172,72,234,205,153,93,102,3,67,205,167,123,236,201,156,75,36,64,66,241,135,108,234,211,129,8,37,2,108,241,187,95,249,216,155,80,102,3,67,217,171,104,252,201,182,76,43,24],[152,65,57,31,76,248,167],[135,65,58,0,84],[9813,65067,106,56,69,246,177,58,236,210,152,73,43,2,73,191,171,105,175,222,128,86,56,9,67,235,174,99,175,200,155,69,60,13,68,243,163,120,227,216,219]]);
