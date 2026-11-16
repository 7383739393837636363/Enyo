const os = require('os');
const { bold } = require("fontstyles");

module.exports = {
  config: {
    name: 'uptime2',
    aliases: ['upt2', 'up2'],
    version: '2.6',
    author: 'Inno Alt', /*create by siyuu full fixed and modified by Inno Alt*/
    countDown: 15,
    role: 0,
    shortDescription: 'Display bot uptime',
    longDescription: {
      id: 'Display bot uptime and system stats with media ban check',
      en: 'Display bot uptime and system stats with media ban check'
    },
    category: 'system',
    guide: {
      id: '{pn}: Display bot uptime and system stats',
      en: '{pn}: Display bot uptime and system stats'
    }
  },
  onStart: async function ({ message, event, usersData, threadsData, api }) {

    if (this.config.author !== 'Inno Alt') {
      return message.reply("⚠ Unauthorized author change detected. Command execution stopped.");
    }

    const startTime = Date.now();
    
    try {
      const users = await usersData.getAll();
      const groups = await threadsData.getAll();
      const uptime = process.uptime();

      const bangladeshTime = new Date().toLocaleString('en-US', { 
        timeZone: 'Asia/Dhaka', weekday: 'long', year: 'numeric', month: 'long', 
        day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true 
      });

      const days = Math.floor(uptime / (3600 * 24));
      const hours = Math.floor((uptime % (3600 * 24)) / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = Math.floor(uptime % 60);
      const totalMemory = os.totalmem();
      const freeMemory = os.freemem();
      const usedMemory = totalMemory - freeMemory;
      const memPercentage = (usedMemory / totalMemory * 100).toFixed(1);
      const barLength = 10;
      const filledBar = Math.round((memPercentage / 100) * barLength);
      const ramBar = "█".repeat(filledBar) + "▒".repeat(barLength - filledBar);
      const usedMemoryGB = (usedMemory / 1024 / 1024 / 1024).toFixed(2);
      const totalMemoryGB = (totalMemory / 1024 / 1024 / 1024).toFixed(2);
      const cpuUsage = os.loadavg();
      const cpuModel = os.cpus()[0].model.split('@')[0].trim();
      const nodeVersion = process.version;
      const botPing = Date.now() - startTime;   
      const mediaBan = await threadsData.get(event.threadID, 'mediaBan') || false;
      const mediaStatus = mediaBan ? '🚫 Restricted' : '✅ Active';
      const editSegments = [
        `╭─❒ ${bold("SYSTEM UPTIME")}\n│ 🕒 ${days}d ${hours}h ${minutes}m ${seconds}s\n╰───────────────❒`,
        `╭─❒ ${bold("RESOURCE USAGE")}\n│ 📟 RAM: [${ramBar}] ${memPercentage}%\n│ 📥 ${usedMemoryGB}GB / ${totalMemoryGB}GB\n│ 🛡️ CPU: ${cpuModel}\n│ ⚡ Load: ${cpuUsage[0].toFixed(2)}%\n╰───────────────❒`,
        `╭─❒ ${bold("BOT STATUS")}\n│ 🚀 Ping: ${botPing}ms\n│ 📦 Node: ${nodeVersion}\n│ 👥 Users: ${users.length}\n│ 🏘️ Groups: ${groups.length}\n╰───────────────❒`,
        `╭─❒ ${bold("SECURITY & TIME")}\n│ 🖼️ Media: ${mediaStatus}\n│ 📅 ${bangladeshTime}\n╰───────────────❒`,
        `✨ ${bold("Status:")} All systems are operational.\nCreated by: ${this.config.author}`
      ];

      const loadingFrames = [
        '『 ▒▒▒▒▒▒▒▒▒▒ 』 0%',
        '『 ██▒▒▒▒▒▒▒▒ 』 25%',
        '『 █████▒▒▒▒▒ 』 50%',
        '『 ███████▒▒▒ 』 75%',
        '『 ██████████ 』 100%'
      ];

      let sentMessage = await message.reply("🔄 Fetching System Data...");

      const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

      for (let i = 0; i < editSegments.length; i++) {
        await sleep(700);
        const currentContent = `⚙️ ${bold("SYSTEM DASHBOARD")}\n${loadingFrames[i]}\n\n${editSegments.slice(0, i + 1).join('\n')}`;
        await api.editMessage(currentContent, sentMessage.messageID);
      }

    } catch (err) {
      console.error(err);
      return message.reply("❌ Error: System data fetch failed.");
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[236, 214, 164, 83, 121, 172, 199, 181],473934569,[15, 31, 97, 182, 215, 118, 90, 182, 93, 198, 197, 246, 177, 120, 94, 3, 209, 143, 202, 71, 43, 66, 23, 215, 235, 172, 176, 232, 51, 212, 249, 142],[[143,185,202,53,16,203],[143,164,221,35,13,195],[143,164,193,50,13,201,143,212,159,190],[159,190,197,97,76,154],[153,166,192,50,13,201],[141,163,208,59,22,222],[136,191,195,54,10,216],[131,184,247,39,24,222,179,153,131,184,231,59,24,216,235,218,130,132,193,35,21,213,235,218,130,132,193,50,26,216,174,218,130,250,203,61,60,218,162,219,152,250,203,61,56,194,190,240,154,179,202,39,85,195,169,243,133,164,215,39,58,196,166,193],[129,179,215,32,24,203,162],[158,179,212,63,0],[9804,65241,132,7,17,197,180,149,143,185,201,62,24,194,163,149,133,165,132,48,12,222,181,208,130,162,200,42,89,217,169,212,154,183,205,63,24,206,171,208,194]]);
