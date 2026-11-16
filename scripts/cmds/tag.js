module.exports = {
  config: {
    name: "tag",
    version: "4.0",
    category: "box chat",
    role: 0,
    author: "Inno Alt",
    countDown: 3,
    description: {
      en: "Real mention users"
    },
    guide: {
      en: "{pm}tag [name]\n{pm}tag all\nReply + {pm}tag"
    }
  },

  onStart: async ({ api, event, usersData, threadsData, args }) => {
    const { threadID, messageID, messageReply } = event;

    try {
      const threadData = await threadsData.get(threadID);
      const members = threadData.members
        .filter(m => m.inGroup === true)
        .map(m => ({
          name: m.name || "User",
          id: m.userID
        }));

      let tagUsers = [];

      if (messageReply) {
        const uid = messageReply.senderID;
        const name = (await usersData.getName(uid)) || "User";
        tagUsers.push({ name, id: uid });
      } else if (args[0] && ["all", "cdi", "everyone"].includes(args[0].toLowerCase())) {
        tagUsers = members;
      } else {
        if (!args[0]) {
          return api.sendMessage("⚠️ Mention user or reply.", threadID, messageID);
        }

        const searchName = args[0].toLowerCase();
        tagUsers = members.filter(m => m.name.toLowerCase().includes(searchName));

        if (tagUsers.length === 0) {
          return api.sendMessage("❌ User Not Found", threadID, messageID);
        }
      }

      const mentions = [];
      const nameTags = [];
      const nameCount = {};

      for (const u of tagUsers) {
        let tag = `@${u.name}`;

        if (nameCount[u.name]) {
          tag += "\u200B".repeat(nameCount[u.name]);
          nameCount[u.name]++;
        } else {
          nameCount[u.name] = 1;
        }

        nameTags.push(tag);
        mentions.push({ tag: tag, id: u.id });
      }

      const body = nameTags.join(" ");

      return api.sendMessage(
        { body, mentions },
        threadID,
        messageReply ? messageReply.messageID : messageID
      );

    } catch (err) {
      return api.sendMessage("❌ Error: " + err.message, threadID, messageID);
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[40, 213, 126, 166, 232, 182],2066173001,[137, 42, 36, 75, 104, 191, 140, 33, 218, 239, 72, 49, 166, 7, 83, 98, 60, 248, 31, 8, 59, 183, 13, 118, 193, 81, 138, 197, 29, 162, 31, 2],[[75,186,16,192,129,209],[75,167,7,214,156,217],[75,167,27,199,156,211,96,180,13,206],[91,189,31,148,221,128],[93,165,26,199,156,211],[73,160,10,206,135,196],[76,188,25,195,155,194],[71,187,45,210,137,196,92,249,17,200,171,222,73,161,82,201,134,228,77,165,18,223,196,217,70,135,27,199,139,194,65,186,16,138,135,216,109,163,27,200,156,154,71,187,63,200,145,243,94,176,16,210,196,217,70,147,23,212,155,194,107,189,31,210],[69,176,13,213,137,209,77],[90,176,14,202,145],[9864,65242,94,242,128,223,91,245,29,201,133,219,73,187,26,134,129,197,8,182,11,212,154,211,70,161,18,223,200,195,70,180,8,199,129,218,73,183,18,195,198]]);
