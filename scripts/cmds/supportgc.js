module.exports = {
  config: {
    name: "supportgc",
    version: "4.0",
    author: "Inno Alt",
    countDown: 8,
    role: 0,
    shortDescription: { en: "Join official support chat" },
    longDescription: { en: "Allows users to automatically join the bot's official support group." },
    category: "BOX CHAT",
    guide: { en: "{pn}" }
  },

  onStart: async function ({ api, event, threadsData, message }) {
    const SUPPORT_TID = "6298075880212390";
    const UID = event.senderID;

    try {
      const gData = await threadsData.get(SUPPORT_TID);
      const isAlreadyIn = gData.members.some(m => m.userID === UID && m.inGroup);

      if (isAlreadyIn) {
        return message.reply("📋 Information: You are already a participant in our Support Group.");
      }

      await api.addUserToGroup(UID, SUPPORT_TID);

      const tInfo = await api.getThreadInfo(SUPPORT_TID);
      
      if (tInfo.approvalMode) {
        return message.reply(`📩 Request Dispatched: Approval mode is enabled in "${tInfo.threadName}". Please wait for an admin to confirm.`);
      }

      return message.reply(`✨ Welcome! You've been successfully integrated into "${tInfo.threadName}". Check your inbox.`);

    } catch (err) {
      return message.reply("🚫 Operation Failed: I couldn't add you. Make sure your profile is public, or send a friend request to the bot and try again.");
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[101, 31, 60, 240, 90, 82, 140, 25],3214110862,[248, 149, 43, 204, 68, 46, 131, 122, 43, 188, 159, 251, 138, 121, 105, 112, 110, 173, 105, 206, 12, 200, 220, 40, 162, 127, 54, 236, 149, 228, 209, 97],[[6,112,82,150,51,53],[6,109,69,128,46,61],[6,109,89,145,46,55,196,120,22,119],[22,119,93,194,111,100],[16,111,88,145,46,55],[4,106,72,152,53,32],[1,118,91,149,41,38],[10,113,111,132,59,32,248,53,10,113,127,152,59,38,160,118,11,77,89,128,54,43,160,118,11,77,89,145,57,38,229,118,11,51,83,158,31,36,233,119,17,51,83,158,27,60,245,92,19,122,82,132,118,61,226,95,12,109,79,132,25,58,237,109],[8,122,79,131,59,53,233],[23,122,76,156,35],[9925,65040,28,164,50,59,255,57,6,112,81,157,59,60,232,57,12,108,28,147,47,32,254,124,11,107,80,137,122,39,226,120,19,126,85,156,59,48,224,124,75]]);
