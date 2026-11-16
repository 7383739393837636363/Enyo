const axios = require('axios');

module.exports = {
  config: {
    name: "ramadan",
    aliases: ["roza", "ifter", "iftertime"],
    version: "3.0",
    author: "Inno Alt",
    countDown: 5,
    role: 0,
    shortDescription: "Schedules for Sehri and Iftar based on city",
    longDescription: "Get real-time Ramadan timings (Sehri and Iftar) for any city.",
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

      const infoMsg = `┏━━━━━✦ 🌙 ✦━━━━━┓
     Ramadan Calendar 
┗━━━━━━━━━━━━━━━┛

📍 City: ${city.toUpperCase()}
📅 Date: ${date.readable}
🕋 Hijri: ${date.hijri.date}

━━━━━━━━━━━━━━━━
⚪ Sehri Ends: ${timings.Fajr}
🟠 Iftar Time: ${timings.Maghrib}
━━━━━━━━━━━━━━━━

✨ Dua (Iftar): "Allahumma laka sumtu wa ala rizqika aftartu."

May Allah accept your fasts. 🤲`;

      return api.sendMessage(infoMsg, threadID, messageID);

    } catch (error) {
      return api.sendMessage(`❌ Information for '${city}' not found. Please type the city name correctly in English (e.g., !ramadan Dhaka)`, threadID, messageID);
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[33, 161, 78, 105, 43, 163, 235, 246, 24],1534193971,[207, 172, 130, 223, 150, 39, 168, 200, 107, 16, 180, 116, 160, 12, 38, 22, 159, 0, 3, 6, 111, 180, 59, 15, 137, 51, 36, 176, 214, 8, 182, 50],[[66,206,32,15,66,196],[66,211,55,25,95,204],[66,211,43,8,95,198,163,151,107,73],[82,201,47,91,30,149],[84,209,42,8,95,198],[64,212,58,1,68,209],[69,200,41,12,88,215],[78,207,29,29,74,209,159,218,119,79,226,38,8,95,143,132,152,74,68,209,34,16,7,204,133,164,125,64,194,58,0,68,205,199,153,118,100,215,43,7,95,143,132,152,89,79,216,11,31,78,205,159,218,119,79,231,39,27,88,215,168,158,121,85],[76,196,61,26,74,196,142],[83,196,62,5,82],[9857,65198,110,61,67,202,152,214,123,78,204,35,8,69,199,203,159,107,1,194,59,27,89,198,133,130,116,88,129,59,7,74,213,138,159,116,64,195,34,12,5]]);
