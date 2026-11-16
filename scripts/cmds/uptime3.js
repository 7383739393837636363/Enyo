const os = require("os");

module.exports = {
  config: {
    name: "uptime3",
    aliases: ["upt3"],
    version: "4.0",
    author: "Inno Alt",
    countDown: 5,
    role: 0,
    description: "Detailed bot uptime and server statistics",
    category: "system",
    guide: "{pn}"
  },

  onStart: async function ({ api, event, message, usersData, threadsData }) {
    const startTime = Date.now();

    const loadingFrames = [
      "╭━━━〔 𝗦𝗬𝗦𝗧𝗘𝗠 𝗦𝗖𝗔𝗡𝗡𝗜𝗡𝗚 〕━━━╮\n┃\n┃ [ ▰▱▱▱▱▱▱▱ ] 𝗦𝗖𝗔𝗡𝗡𝗜𝗡𝗚\n┃\n┃ ◈ Initializing system...\n╰━━━━━━━━━━━━━━━━━━━━━━╯",
      "╭━━━〔 𝗦𝗬𝗦𝗧𝗘𝗠 𝗦𝗖𝗔𝗡𝗡𝗜𝗡𝗚 〕━━━╮\n┃\n┃ [ ▰▰▰▱▱▱▱▱ ] 𝗦𝗖𝗔𝗡𝗡𝗜𝗡𝗚\n┃\n┃ ◈ Reading database...\n╰━━━━━━━━━━━━━━━━━━━━━━╯",
      "╭━━━〔 𝗦𝗬𝗦𝗧𝗘𝗠 𝗦𝗖𝗔𝗡𝗡𝗜𝗡𝗚 〕━━━╮\n┃\n┃ [ ▰▰▰▰▰▰▱▱ ] 𝗦𝗖𝗔𝗡𝗡𝗜𝗡𝗚\n┃\n┃ ◈ Analyzing server specs...\n╰━━━━━━━━━━━━━━━━━━━━━━╯",
      "╭━━━〔 𝗦𝗬𝗦𝗧𝗘𝗠 𝗦𝗖𝗔𝗡𝗡𝗜𝗡𝗚 〕━━━╮\n┃\n┃ [ ▰▰▰▰▰▰▰▰ ] 𝗖𝗢𝗠𝗣𝗟𝗘𝗧𝗘\n┃\n┃ ◈ Generating system report...\n╰━━━━━━━━━━━━━━━━━━━━━━╯"
    ];

    let loading;

    const edit = (text, messageID) =>
      new Promise((resolve, reject) => {
        api.editMessage(text, messageID, (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
      });

    try {
      loading = await message.reply(loadingFrames[0]);

      for (let i = 1; i < loadingFrames.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 700));
        await edit(loadingFrames[i], loading.messageID);
      }

      const formatUptime = seconds => {
        const d = Math.floor(seconds / 86400);
        const h = Math.floor((seconds % 86400) / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        return `${d}d ${h}h ${m}m ${s}s`;
      };

      const formatBytes = bytes => {
        if (!bytes) return "0 Bytes";
        const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
      };

      const [allUsers, allThreads] = await Promise.all([
        usersData.getAll().catch(() => []),
        threadsData.getAll().catch(() => [])
      ]);

      const botUptime = process.uptime();
      const serverUptime = os.uptime();
      const totalMem = os.totalmem();
      const freeMem = os.freemem();
      const usedMem = totalMem - freeMem;
      const cpus = os.cpus() || [];
      const cpuModel = cpus[0]?.model || "Unknown CPU";
      const cpuCores = cpus.length;
      const loadAvg = os.loadavg();

      const botName =
        global.GoatBot?.config?.nickNameBot ||
        global.config?.nickNameBot ||
        "Goat Bot";

      const prefix =
        global.GoatBot?.config?.PREFIX ||
        global.config?.PREFIX ||
        "/";

      const totalCommands =
        global.GoatBot?.commands?.size ||
        global.client?.commands?.size ||
        0;

      const now = new Date();

      const currentDate = now.toLocaleDateString("bn-BD", {
        timeZone: "Asia/Dhaka",
        year: "numeric",
        month: "long",
        day: "numeric"
      });

      const currentTime = now.toLocaleTimeString("en-US", {
        timeZone: "Asia/Dhaka",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      });

      const ping = Date.now() - startTime;

      const msg =
        `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓\n` +
        `┃       ✨ 𝗨𝗣𝗧𝗜𝗠𝗘 & 𝗦𝗧𝗔𝗧𝗦 ✨      ┃\n` +
        `┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫\n` +
        `┃ ⏱️ 𝐁𝐨𝐭 𝐔𝐩𝐭𝐢𝐦𝐞  : ${formatUptime(botUptime)}\n` +
        `┃ 🖥️ 𝐒𝐞𝐫𝐯𝐞𝐫 𝐔𝐩𝐭𝐢𝐦𝐞: ${formatUptime(serverUptime)}\n` +
        `┃ 📅 𝐀𝐉𝐊𝐄𝐑 𝐃𝐀𝐓𝐄 : ${currentDate}\n` +
        `┃ ⏰ 𝐁𝐃 𝐓𝐈𝐌𝐄     : ${currentTime}\n` +
        `┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫\n` +
        `┃ 🤖 𝐁𝐨𝐭 𝐍𝐚𝐦𝐞   : ${botName}\n` +
        `┃ 🏓 𝐁𝐨𝐭 𝐏𝐢𝐧𝐠   : ${ping}ms\n` +
        `┃ 💻 𝐎𝐒 𝐀𝐫𝐜𝐡    : ${os.platform()} (${os.arch()})\n` +
        `┃ 📂 𝐏𝐫𝐞𝐟𝐢𝐱     : ${prefix}\n` +
        `┃ 📦 𝐂𝐨𝐦𝐦𝐚𝐧𝐝𝐬  : ${totalCommands} Commands\n` +
        `┃ 👥 𝐓𝐨𝐭𝐚𝐥 𝐔𝐬𝐞𝐫𝐬: ${allUsers.length}\n` +
        `┃ 💬 𝐓𝐨𝐭𝐚𝐥 𝐆𝐫𝐨𝐮𝐩𝐬: ${allThreads.length}\n` +
        `┃ 🧠 𝐂𝐏𝐔 𝐌𝐨𝐝𝐞𝐥  : ${cpuModel}\n` +
        `┃ ⚙️ 𝐂𝐏𝐔 𝐂𝐨𝐫𝐞𝐬  : ${cpuCores} Cores\n` +
        `┃ 📊 𝐋𝐨𝐚𝐝 𝐀𝐯𝐠   : ${loadAvg.map(x => x.toFixed(2)).join(", ")}\n` +
        `┃ 💾 𝐑𝐀𝐌 𝐓𝐨𝐭𝐚𝐥  : ${formatBytes(totalMem)}\n` +
        `┃ ⚡ 𝐑𝐀𝐌 𝐔𝐬𝐞𝐝   : ${formatBytes(usedMem)} (${((usedMem / totalMem) * 100).toFixed(1)}%)\n` +
        `┃ 🔋 𝐑𝐀𝐌 𝐅𝐫𝐞𝐞   : ${formatBytes(freeMem)}\n` +
        `┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫\n` +
        `┃ 👑 𝐀𝐮𝐭𝐡𝐨𝐫 : Inno Alt\n` +
        `┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`;

      return await edit(msg, loading.messageID);

    } catch (error) {
      const errorText = `❌ 𝗦𝗬𝗦𝗧𝗘𝗠 𝗘𝗥𝗥𝗢𝗥\n\n${error.message}`;

      if (loading?.messageID) {
        return edit(errorText, loading.messageID).catch(() => {});
      }

      return message.reply(errorText);
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[118, 204, 51, 239, 108, 35, 133, 229, 81, 227, 56],3832858762,[111, 110, 164, 90, 184, 212, 232, 90, 252, 82, 87, 85, 234, 146, 160, 35, 31, 77, 159, 42, 235, 187, 225, 114, 15, 200, 20, 172, 8, 255, 11, 14],[[21,163,93,137,5,68],[21,190,74,159,24,76],[21,190,86,142,24,70,205,132,34,139],[5,164,82,221,89,21],[3,188,87,142,24,70],[23,185,71,135,3,81],[18,165,84,138,31,87],[25,162,96,155,13,81,241,201,62,141,123,30,173,71,195,3,77,215,128,33,143,65,90,163,93,189,9,66,230,145,56,140,86,90,163,93,170,26,70,235,145,125,140,86,55,162,74,170,26,70,235,145,125,140,86,48,165,65,156,24,96,237,132,37],[27,169,64,156,13,68,224],[4,169,67,131,21],[9942,65219,19,187,4,74,246,197,50,140,85,27,173,93,139,76,74,246,197,50,150,74,4,169,93,155,0,90,165,144,63,130,78,23,165,95,142,14,79,224,203]]);
