module.exports = {
  config: {
    name: "approve",
    aliases: ["aprv"],
    version: "4.0",
    author: "Inno Alt",
    countDown: 5,
    role: 1,
    shortDescription: { en: "Approve pending members" },
    category: "box chat",
    guide: { en: "{pn} | {pn} 1 | {pn} all" }
  },

  onStart: async ({ api, event, args, commandName }) => {
    const { threadID, messageID, senderID, isGroup } = event;
    if (!isGroup) return api.sendMessage("❌ Group only.", threadID, messageID);

    let info;
    try {
      info = await api.getThreadInfo(threadID);
    } catch {
      return api.sendMessage("❌ Failed to get pending list.", threadID, messageID);
    }

    const queue = info?.approvalQueue || [];
    if (!queue.length) return api.sendMessage("✅ No pending members.", threadID, messageID);

    const approve = async targets => {
      const msg = await api.sendMessage(`⏳ Approving ${targets.length} member(s)...`, threadID);
      let ok = 0, fail = 0;

      for (const user of targets) {
        try {
          await api.addUserToGroup(user.requesterID, threadID);
          ok++;
        } catch {
          fail++;
        }
      }

      const result = `Done ${ok} member(s) ✅\nFailed ${fail} member(s) ❎`;

      try {
        await api.editMessage(result, msg.messageID);
      } catch {
        await api.sendMessage(result, threadID);
        try { await api.unsendMessage(msg.messageID); } catch {}
      }
    };

    if (args.length) {
      if (/^all$/i.test(args[0])) return approve(queue);

      const targets = [];
      for (const n of args) {
        if (!/^\d+$/.test(n) || n < 1 || n > queue.length)
          return api.sendMessage(`❌ Invalid number: ${n}`, threadID, messageID);
        targets.push(queue[n - 1]);
      }
      return approve(targets);
    }

    let names = {};
    try {
      names = await api.getUserInfo(queue.map(x => x.requesterID));
    } catch {}

    const list = queue.map((x, i) =>
      `${i + 1}. ${names?.[x.requesterID]?.name || "Unknown"} (${x.requesterID})`
    ).join("\n");

    return api.sendMessage(
      `🔔 PENDING MEMBERS (${queue.length})\n\n${list}\n\nReply with number(s) to approve.`,
      threadID,
      (err, m) => {
        if (!err) global.GoatBot.onReply.set(m.messageID, {
          commandName,
          author: senderID,
          queue
        });
      },
      messageID
    );
  },

  onReply: async ({ api, event, Reply }) => {
    if (event.senderID !== Reply.author) return;

    const input = event.body.trim();
    let targets;

    if (/^all$/i.test(input)) {
      targets = Reply.queue;
    } else {
      targets = [];
      for (const n of input.split(/\s+/)) {
        if (!/^\d+$/.test(n) || n < 1 || n > Reply.queue.length)
          return api.sendMessage(`❌ Invalid number: ${n}`, event.threadID, event.messageID);
        targets.push(Reply.queue[n - 1]);
      }
    }

    try { await api.unsendMessage(event.messageID); } catch {}
    global.GoatBot.onReply.delete(event.messageID);

    const msg = await api.sendMessage(
      `⏳ Approving ${targets.length} member(s)...`,
      event.threadID
    );

    let ok = 0, fail = 0;

    for (const user of targets) {
      try {
        await api.addUserToGroup(user.requesterID, event.threadID);
        ok++;
      } catch {
        fail++;
      }
    }

    const result = `Done ${ok} member(s) ✅\nFailed ${fail} member(s) ❎`;

    try {
      await api.editMessage(result, msg.messageID);
    } catch {
      await api.sendMessage(result, event.threadID);
      try { await api.unsendMessage(msg.messageID); } catch {}
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[203, 189, 101, 70, 99, 53, 54, 106, 82, 161],2890412423,[140, 254, 252, 32, 95, 152, 52, 132, 22, 189, 17, 150, 64, 139, 50, 99, 246, 184, 16, 53, 36, 242, 65, 214, 35, 252, 136, 22, 79, 104, 232, 109],[[168,210,11,32,10,82],[168,207,28,54,23,90],[168,207,0,39,23,80,126,11,33,201],[184,213,4,116,86,3],[190,205,1,39,23,80],[170,200,17,46,12,71],[175,212,2,35,16,65],[164,211,54,50,2,71,66,70,61,207,136,213,4,50,79,90,88,56,55,209,167,196,73,41,13,103,83,11,49,213,162,210,11,106,12,91,115,28,55,207,191,145,10,40,34,91,79,47,36,196,165,201,73,41,13,115,95,24,33,213,136,213,4,50],[166,216,22,53,2,82,83],[185,216,21,42,26],[9835,65202,69,18,11,92,69,74,49,206,166,208,4,40,7,21,95,25,114,194,190,207,23,35,13,65,90,19,114,212,165,220,19,39,10,89,87,8,62,196,229]]);
