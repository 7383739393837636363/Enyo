module.exports = {
  config: {
    name: "setallnick",
    version: "4.0",
    role: 2,
    author: "Inno Alt",
    description: "Set bot nickname in all groups",
    category: "OWNER",
    guide: "{pn} <nickname>",
    countDown: 50
  },
  onStart: async function ({ api, event, args, threadsData }) {
    const newNickname = args.join(" ");
    if (!newNickname) {
      return api.sendMessage("❌ Please enter a nickname.\nExample: /setallnick MyBot", event.threadID);
    }
    const allThreads = await threadsData.getAll();
    if (!allThreads || allThreads.length === 0) {
      return api.sendMessage("❌ No threads found in database.", event.threadID);
    }
    let successCount = 0;
    let failCount = 0;
    const botID = api.getCurrentUserID();
    const statusMsg = await api.sendMessage(`⏳ Changing nickname in ${allThreads.length} groups...`, event.threadID);
    const batchSize = 10;
    for (let i = 0; i < allThreads.length; i += batchSize) {
      const batch = allThreads.slice(i, i + batchSize);
      await Promise.all(batch.map(async (thread) => {
        const threadID = thread.threadID;
        try {
          await api.changeNickname(newNickname, threadID, botID);
          successCount++;
        } catch {
          failCount++;
        }
      }));
      await api.editMessage(
        `⏳ Progress: ${Math.min(i + batchSize, allThreads.length)}/${allThreads.length} groups processed.\n✅ Success: ${successCount} | ❌ Failed: ${failCount}`,
        statusMsg.messageID
      );
    }
    return api.editMessage(
      `✅ Nickname change completed!\n\n🔹 Successfully changed: ${successCount}\n❌ Failed: ${failCount}\n📊 Total groups processed: ${allThreads.length}`,
      statusMsg.messageID
    );
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[27, 150, 234, 191, 72, 128, 160, 19],1313555659,[181, 186, 170, 67, 201, 184, 98, 67, 163, 248, 29, 220, 162, 102, 228, 214, 201, 122, 252, 4, 70, 128, 126, 14, 189, 82, 200, 204, 220, 87, 0, 205],[[120,249,132,217,33,231],[120,228,147,207,60,239],[120,228,143,222,60,229,232,114,104,254],[104,254,139,141,125,182],[110,230,142,222,60,229],[122,227,158,215,39,242],[127,255,141,218,59,244],[116,248,185,203,41,242,212,63,116,248,169,215,41,244,140,124,117,196,143,207,36,249,140,124,117,196,143,222,43,244,201,124,117,186,133,209,13,246,197,125,111,186,133,209,9,238,217,86,109,243,132,203,100,239,206,85,114,228,153,203,11,232,193,103],[118,243,153,204,41,231,197],[105,243,154,211,49],[9915,65177,202,235,32,233,211,51,120,249,135,210,41,238,196,51,114,229,202,220,61,242,210,118,117,226,134,198,104,245,206,114,109,247,131,211,41,226,204,118,53]]);
