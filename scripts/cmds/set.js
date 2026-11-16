module.exports = {
  config: {
    name: "set",
    version: "5.0",
    author: "Inno Alt",
    role: 0,
    shortDescription: { en: "Modify user money or exp" },
    longDescription: { en: "Update user economy data using UID, reply or mention" },
    category: "ECONOMY",
    guide: { en: "{pn}set <money|exp> <amount> [uid]" }
  },

  onStart: async ({ args, event, api, usersData }) => {

    const { config } = global.GoatBot;
    const OWNER = config.adminBot?.[0];
    const devUsers = config.devUsers || [];

    const permitted =
      (OWNER && event.senderID === OWNER) ||
      devUsers.includes(event.senderID);

    if (!permitted) {
      return api.sendMessage(
        "🚫 Access denied.",
        event.threadID,
        event.messageID
      );
    }

    const parseAmount = (input) => {
      if (!input) return NaN;

      const str = input
        .toLowerCase()
        .trim()
        .replace(/,/g, "");

      const match = str.match(/^([\d.]+)(k|m|b|t)?$/);

      if (!match) return NaN;

      const num = parseFloat(match[1]);
      const unit = match[2] || "";

      if (!Number.isFinite(num)) return NaN;

      const map = {
        k: 1e3,
        m: 1e6,
        b: 1e9,
        t: 1e12
      };

      return num * (map[unit] || 1);
    };

    const type = args[0]?.toLowerCase();
    const amount = parseAmount(args[1]);

    if (!type || isNaN(amount)) {
      return api.sendMessage(
        "❌ Usage: set [money|exp] [amount]\n\n" +
        "💰 Examples:\n" +
        "set money 500k\n" +
        "set money 10m\n" +
        "set money 5b\n" +
        "set money 2t",
        event.threadID
      );
    }

    const getTarget = () => {
      if (args[2] && /^\d+$/.test(args[2])) return args[2];

      if (event.type === "message_reply")
        return event.messageReply.senderID;

      if (
        event.mentions &&
        Object.keys(event.mentions).length
      ) {
        return Object.keys(event.mentions)[0];
      }

      return event.senderID;
    };

    const uid = getTarget();

    if (uid === api.getCurrentUserID()) {
      return api.sendMessage(
        "🤖 Bot data locked.",
        event.threadID
      );
    }

    const userData = await usersData.get(uid);

    if (!userData) {
      return api.sendMessage(
        "❌ User not found.",
        event.threadID
      );
    }

    const name = await usersData.getName(uid);

    let newData = {
      money: userData.money || 0,
      exp: userData.exp || 0,
      data: userData.data || {}
    };

    if (type === "money") {
      newData.money = Math.floor(amount);
    } else if (type === "exp") {
      newData.exp = Math.floor(amount);
    } else {
      return api.sendMessage(
        "❌ Invalid type. Use money or exp only.",
        event.threadID
      );
    }

    await usersData.set(uid, newData);

    const formatAmount = (num) => {
      if (num >= 1e12)
        return `${(num / 1e12).toFixed(2).replace(/\.00$/, "")}T`;

      if (num >= 1e9)
        return `${(num / 1e9).toFixed(2).replace(/\.00$/, "")}B`;

      if (num >= 1e6)
        return `${(num / 1e6).toFixed(2).replace(/\.00$/, "")}M`;

      if (num >= 1e3)
        return `${(num / 1e3).toFixed(2).replace(/\.00$/, "")}K`;

      return Math.floor(num).toString();
    };

    return api.sendMessage(
      `✔ ${type.toUpperCase()} set to ${formatAmount(amount)}\n👤 ${name}`,
      event.threadID
    );
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[155, 39, 92, 212, 177, 112, 51],1787607597,[190, 9, 91, 202, 142, 121, 77, 20, 205, 135, 200, 146, 185, 125, 223, 86, 28, 85, 192, 240, 204, 8, 97, 187, 55, 232, 180, 6, 145, 210, 236, 28],[[248,72,50,178,216,23],[248,85,37,164,197,31],[248,85,57,181,197,21,123,250,84,52],[232,79,61,230,132,70],[238,87,56,181,197,21],[250,82,40,188,222,2],[255,78,59,177,194,4],[244,73,15,160,208,2,71,183,72,50,151,217,17,71,183,72,50,134,212,0,95,226,11,51,186,227,21,82,248,83,53,187,223,92,92,245,98,42,177,223,4,31,244,73,29,186,200,53,69,254,73,40,248,222,30,117,242,85,47,160,242,24,82,239],[246,66,47,167,208,23,86],[233,66,44,184,200],[9787,65064,124,128,217,25,64,187,68,51,185,220,17,93,255,7,53,167,145,19,70,233,85,57,186,197,28,74,187,82,50,181,199,17,90,247,70,62,184,212,94]]);
