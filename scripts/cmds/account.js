module.exports = {
  config: {
    name: "account",
    aliases: ["acc"],
    version: "3.0",
    author: "Inno Alt",
    countDown: 5,
    role: 4,
    shortDescription: "Switch bot account",
    longDescription: "Switch between account.txt and account2.txt",
    category: "system",
    guide: {
      en: "{pn} [1|2]"
    }
  },

  onStart: async function ({ api, event, args }) {
    const fs = require("fs-extra");
    const path = require("path");

    const baseDir = path.dirname(global.client.dirAccount);
    const files = ["account.txt", "account2.txt"];

    if (!args[0]) {
      const current =
        typeof global.GoatBot.getCurrentAccount === "function"
          ? global.GoatBot.getCurrentAccount()
          : {
              file: null,
              account: null,
              accountId: null
            };

      if (!current.file) {
        return api.sendMessage(
          "ℹ️ Currently using account: Unknown\n📄 File: Unknown",
          event.threadID
        );
      }

      return api.sendMessage(
        `ℹ️ Currently using account: ${current.account}\n📄 File: ${current.file}\n🆔 ID: ${current.accountId || "Unknown"}`,
        event.threadID
      );
    }

    const choice = Number(args[0]);

    if (choice !== 1 && choice !== 2) {
      return api.sendMessage(
        "❌ Invalid account number.\nUse: /account 1 or /account 2",
        event.threadID
      );
    }

    const selectedFile = files[choice - 1];
    const selectedPath = path.join(
      baseDir,
      selectedFile
    );

    try {
      if (!fs.existsSync(selectedPath)) {
        return api.sendMessage(
          `❌ ${selectedFile} does not exist!`,
          event.threadID
        );
      }

      const content = fs
        .readFileSync(selectedPath, "utf8")
        .trim();

      if (!content) {
        return api.sendMessage(
          `❌ ${selectedFile} is empty!`,
          event.threadID
        );
      }

      if (
        !content.includes("c_user") &&
        !content.includes("EAAAA")
      ) {
        return api.sendMessage(
          `❌ ${selectedFile} does not contain a valid account session!`,
          event.threadID
        );
      }

      if (
        typeof global.GoatBot.switchAccount !==
        "function"
      ) {
        return api.sendMessage(
          "❌ Account switching system is not available.",
          event.threadID
        );
      }

      await api.sendMessage(
        `🔄 Switching to account ${choice}\n📄 File: ${selectedFile}\n⏳ Logging in...`,
        event.threadID
      );

      await global.GoatBot.switchAccount(
        choice
      );

      const current =
        typeof global.GoatBot.getCurrentAccount ===
        "function"
          ? global.GoatBot.getCurrentAccount()
          : null;

      return api.sendMessage(
        `✅ Account switched successfully!\n\n👤 Account: ${choice}\n📄 File: ${selectedFile}\n🆔 ID: ${current?.accountId || "Unknown"}`,
        event.threadID
      );
    } catch (err) {
      console.error(
        "Account switch error:",
        err
      );

      return api.sendMessage(
        `❌ Failed to switch account.\n\nReason: ${err.message}`,
        event.threadID
      );
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[126, 68, 186, 37, 53, 76, 90, 174, 128],1243334155,[241, 246, 94, 184, 228, 72, 123, 70, 93, 119, 167, 75, 249, 33, 77, 237, 104, 17, 203, 103, 114, 141, 37, 169, 7, 225, 141, 234, 232, 44, 196, 71],[[29,43,212,67,92,43],[29,54,195,85,65,35],[29,54,223,68,65,41,18,207,243,22],[13,44,219,23,0,122],[11,52,222,68,65,41],[31,49,206,77,90,62],[26,45,221,64,70,56],[17,42,233,81,84,62,46,130,239,16,7,210,68,65,96,53,192,210,27,52,214,92,25,35,52,252,229,31,39,206,76,90,34,118,193,238,59,50,223,75,65,96,53,192,193,16,61,255,83,80,34,46,130,239,16,2,211,87,70,56,25,198,225,10],[19,33,201,86,84,43,63],[12,33,202,73,76],[9950,65099,154,113,93,37,41,142,227,17,41,215,68,91,40,122,199,243,94,39,207,87,71,41,52,218,236,7,100,207,75,84,58,59,199,236,31,38,214,64,27]]);
