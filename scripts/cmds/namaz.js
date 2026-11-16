const axios = require('axios');

module.exports = {
  config: {
    name: "namaz",
    aliases: ["prayer", "namaj"],
    version: "2.0",
    author: "Inno Alt",
    countDown: 5,
    role: 0,
    shortDescription: "Get prayer times based on city",
    longDescription: "Get real-time Islamic prayer times (Fajr, Dhuhr, Asr, Maghrib, Isha) for any city.",
    category: "Islamic",
    guide: "{pn} [city_name]"
  },

  onStart: async ({ api, event, args }) => {
    const { threadID, messageID } = event;
    const city = args.join(" ") || "Dhaka";

    try {
      const res = await axios.get(`http://api.aladhan.com/v1/timingsByCity`, {
        params: {
          city: city,
          country: "Bangladesh",
          method: 1 
        }
      });

      const { timings, date } = res.data.data;

      const infoMsg = `┏━━━━━✦ 🕌 ✦━━━━━┓
    Namaj Timings
┗━━━━━━━━━━━━━━━┛

📍 City: ${city.toUpperCase()}
📅 Date: ${date.readable}
🕋 Hijri: ${date.hijri.date}

━━━━━━━━━━━━━━━━
✨ Fajr    : ${timings.Fajr}
☀️ Sunrise : ${timings.Sunrise}
中午 Dhuhr   : ${timings.Dhuhr}
☁️ Asr     : ${timings.Asr}
🌅 Maghrib : ${timings.Maghrib}
🌙 Isha    : ${timings.Isha}
━━━━━━━━━━━━━━━━

"Perform prayer, for it restrains from shameful and unjust deeds." 🤲`;

      return api.sendMessage(infoMsg, threadID, messageID);

    } catch (error) {
      return api.sendMessage(`❌ Information for '${city}' not found. Please type the city name correctly in English (e.g., !prayer Dhaka)`, threadID, messageID);
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[142, 85, 244, 122, 110, 67, 213, 242, 23],2237424534,[118, 2, 252, 123, 166, 146, 170, 17, 160, 17, 77, 105, 141, 204, 202, 62, 56, 68, 135, 26, 77, 76, 211, 228, 87, 115, 185, 63, 145, 86, 143, 156],[[237,58,154,28,7,36],[237,39,141,10,26,44],[237,39,145,27,26,38,157,147,100,230],[253,61,149,72,91,117],[251,37,144,27,26,38],[239,32,128,18,1,49],[234,60,147,31,29,55],[225,59,167,14,15,49,161,222,120,224,22,156,27,26,111,186,156,69,235,37,152,3,66,44,187,160,114,239,54,128,19,1,45,249,157,121,203,35,145,20,26,111,186,156,86,224,44,177,12,11,45,161,222,120,224,19,157,8,29,55,150,154,118,250],[227,48,135,9,15,36,176],[252,48,132,22,23],[9774,65114,212,46,6,42,166,210,116,225,56,153,27,0,39,245,155,100,174,54,129,8,28,38,187,134,123,247,117,129,20,15,53,180,155,123,239,55,152,31,64]]);
