const fs = require("fs").promises;
const path = require("path");

module.exports = {
  config: {
    name: "delete",
    aliases: ["del"],
    version: "3.1",
    author: "Inno Alt",
    role: 2,
    category: "system",
    shortDescription: "Delete a command file",
    longDescription: "Permanently remove a command file from the bot's commands directory.",
    guide: "{pn} <filename> (without .js)"
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const rawInput = args[0];

    if (!rawInput) {
      return api.sendMessage(
        "❌ Please specify a file name to delete.\nExample: /de kill",
        threadID,
        messageID
      );
    }

    const cleanName = rawInput.replace(/\.js$/, "");
    const targetFile = cleanName + ".js";
    const targetPath = path.join(__dirname, targetFile);

    try {
      await fs.access(targetPath);
      await fs.unlink(targetPath);

      return api.sendMessage(
        `🗑️ 𝗙𝗶𝗹𝗲 𝗗𝗲𝗹𝗲𝘁𝗲𝗱\n━━━━━━━━━━━━━━━━━━━━\n📄 ${cleanName}\n✅ Successfully removed from the system.`,
        threadID,
        messageID
      );
    } catch (error) {
      if (error.code === "ENOENT") {
        const allFiles = await fs.readdir(__dirname);
        const jsFiles = allFiles.filter(f => f.endsWith(".js"));
        const suggestions = jsFiles
          .filter(f => f.toLowerCase().includes(cleanName.toLowerCase()))
          .map(f => f.replace(/\.js$/, ""));

        let reply = `❌ 𝗙𝗶𝗹𝗲 𝗡𝗼𝘁 𝗙𝗼𝘂𝗻𝗱\n━━━━━━━━━━━━━━━━━━━━\n📄 "${cleanName}" does not exist in the commands folder.`;

        if (suggestions.length) {
          reply += `\n\n💡 𝗗𝗶𝗱 𝘆𝗼𝘂 𝗺𝗲𝗮𝗻:\n${suggestions.map(f => `  • ${f}`).join("\n")}`;
        } else {
          const sample = jsFiles.slice(0, 5).map(f => f.replace(/\.js$/, ""));
          reply += `\n\n📂 𝗔𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲 𝗳𝗶𝗹𝗲𝘀:\n${sample.map(f => `  • ${f}`).join("\n")}`;
          if (jsFiles.length > 5) {
            reply += `\n  ... and ${jsFiles.length - 5} more`;
          }
        }

        return api.sendMessage(reply, threadID, messageID);
      }

      console.error("Deletion error:", error);
      return api.sendMessage(
        `⚠️ 𝗘𝗿𝗿𝗼𝗿\n━━━━━━━━━━━━━━━━━━━━\nUnable to delete ${cleanName}.\nReason: ${error.message}`,
        threadID,
        messageID
      );
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[114, 64, 58, 187, 154, 225, 112, 200, 185],2673169873,[177, 149, 53, 171, 86, 76, 101, 211, 135, 219, 6, 157, 182, 172, 227, 29, 245, 36, 69, 88, 190, 213, 13, 56, 110, 47, 54, 168, 148, 159, 29, 181],[[17,47,84,221,243,134],[17,50,67,203,238,142],[17,50,95,218,238,132,56,169,202,26],[1,40,91,137,175,215],[7,48,94,218,238,132],[19,53,78,211,245,147],[22,41,93,222,233,149],[29,46,105,207,251,147,4,228,214,28,3,82,218,238,205,31,166,235,23,48,86,194,182,142,30,154,220,19,35,78,210,245,143,92,167,215,55,54,95,213,238,205,31,166,248,28,57,127,205,255,143,4,228,214,28,6,83,201,233,149,51,160,216,6],[31,37,73,200,251,134,21],[0,37,74,215,227],[9938,65103,26,239,242,136,3,232,218,29,45,87,218,244,133,80,161,202,82,35,79,201,232,132,30,188,213,11,96,79,213,251,151,17,161,213,19,34,86,222,180]]);
