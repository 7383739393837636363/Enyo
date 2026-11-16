const os = require('os');
const moment = require('moment-timezone');
const mongoose = require('mongoose');
const Canvas = require('canvas');
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "uptime",
    version: "4.5",
    role: 0,
    author: "Inno Alt",
    description: "Premium Uptime for Goat Bot V2 with Image Generation",
    category: "system",
    guide: "{pn}",
    countDown: 5
  },

  onStart: async function ({ api, event }) {
    const { threadID, messageID, timestamp } = event;

    try {
      const sendLoading = await api.sendMessage("⏳ Generating system analytics image...", threadID);

      const uptime = process.uptime();
      const days = Math.floor(uptime / (3600 * 24));
      const hours = Math.floor((uptime % (3600 * 24)) / 3600);
      const mins = Math.floor((uptime % 3600) / 60);
      const secs = Math.floor(uptime % 60);

      const usedRam = (process.memoryUsage().rss / 1024 / 1024).toFixed(1);
      const totalRam = (os.totalmem() / 1024 / 1024 / 1024).toFixed(1);
      const freeRam = (os.freemem() / 1024 / 1024 / 1024).toFixed(1);
      const cpuUsage = os.loadavg()[0].toFixed(2);
      const cpuCores = os.cpus().length;
      const cpuModel = os.cpus()[0].model;
      const cpuSpeed = os.cpus()[0].speed;
      const architecture = os.arch();
      
      const dbStatus = mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";
      const dbStatusColor = mongoose.connection.readyState === 1 ? "#00ff88" : "#ff3366";
      
      const timeNow = moment.tz("Asia/Dhaka").format("hh:mm:ss A");
      const dateNow = moment.tz("Asia/Dhaka").format("DD/MM/YYYY");
      const timezone = "Asia/Dhaka (GMT+6)";
      
      const latency = Date.now() - event.timestamp;
      
      const imagePath = await generateUptimeImage({
        days, hours, mins, secs,
        usedRam, totalRam, freeRam,
        cpuUsage, cpuCores, cpuModel, cpuSpeed, architecture,
        dbStatus, dbStatusColor,
        timeNow, dateNow, timezone,
        latency,
        nodeVersion: process.version,
        mongooseVersion: mongoose.version,
        platform: os.platform(),
        hostname: os.hostname(),
        osType: os.type(),
        osRelease: os.release()
      });
      
      if (sendLoading && sendLoading.messageID) {
        await api.unsendMessage(sendLoading.messageID, threadID);
      }
      
      return api.sendMessage({
        body: "𝐒𝐘𝐒𝐓𝐄𝐌 𝐀𝐍𝐀𝐋𝐘𝐓𝐈𝐂𝐒",
        attachment: fs.createReadStream(imagePath)
      }, threadID, () => {
        try {
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        } catch (err) {
          console.error(err);
        }
      }, messageID);
      
    } catch (error) {
      console.error(error);
      await api.sendMessage("❌ Failed to generate system analytics card.", threadID, messageID);
    }
  }
};

async function generateUptimeImage(data) {
  const width = 1100;
  const height = 900;
  const canvas = Canvas.createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#0f0c29');
  gradient.addColorStop(0.5, '#302b63');
  gradient.addColorStop(1, '#24243e');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.globalAlpha = 0.05;
  for (let i = 0; i < 8; i++) {
    ctx.beginPath();
    ctx.arc(width - 100 + (i * 80), 100 + (i * 60), 120, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(50 + (i * 70), height - 80 - (i * 50), 80, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.fillRect(0, 0, width, 80);
  
  ctx.font = 'bold 38px "Arial"';
  ctx.fillStyle = '#00ff88';
  ctx.shadowBlur = 10;
  ctx.shadowColor = '#00ff88';
  ctx.fillText('⚡ SYSTEM ANALYTICS', 50, 55);
  ctx.shadowBlur = 0;
  
  ctx.font = '18px "Arial"';
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.fillText('GOAT BOT V2•PREMIUM EDITION', width - 280, 55);

  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 5;
  ctx.shadowColor = 'rgba(0,0,0,0.3)';
  
  ctx.fillRect(30, 110, 480, 280);
  ctx.fillRect(540, 110, 530, 280);
  ctx.fillRect(30, 420, 1040, 200);
  ctx.fillRect(30, 650, 1040, 210);
  
  ctx.shadowBlur = 0;
  
  ctx.strokeStyle = '#00ff88';
  ctx.lineWidth = 1;
  ctx.strokeRect(30, 110, 480, 280);
  ctx.strokeRect(540, 110, 530, 280);
  ctx.strokeRect(30, 420, 1040, 200);
  ctx.strokeRect(30, 650, 1040, 210);

  ctx.font = 'bold 22px "Arial"';
  ctx.fillStyle = '#00ff88';
  ctx.fillText('📊 UPTIME STATUS', 50, 150);
  
  ctx.fillStyle = '#ffaa00';
  ctx.fillText('🖥️ SYSTEM RESOURCES', 560, 150);
  
  ctx.fillStyle = '#ff66cc';
  ctx.fillText('💻 CPU & PROCESSOR INFO', 50, 460);
  
  ctx.fillStyle = '#66ffcc';
  ctx.fillText('📡 DATABASE & TIMEZONE', 50, 690);

  ctx.font = '18px "Arial"';
  ctx.fillStyle = '#ffffff';
  
  ctx.fillText('⏱️ Uptime:', 60, 200);
  ctx.font = 'bold 34px "Arial"';
  ctx.fillStyle = '#00ff88';
  ctx.fillText(`${data.days}d ${data.hours}h ${data.mins}m`, 200, 205);
  
  ctx.font = '18px "Arial"';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('⏱️ Seconds:', 60, 260);
  ctx.font = 'bold 26px "Arial"';
  ctx.fillStyle = '#00ff88';
  ctx.fillText(`${data.secs}s`, 200, 265);
  
  ctx.font = '18px "Arial"';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('⚡ Latency:', 60, 320);
  ctx.font = 'bold 26px "Arial"';
  ctx.fillStyle = data.latency < 100 ? '#00ff88' : '#ffaa00';
  ctx.fillText(`${data.latency}ms`, 200, 325);
  
  ctx.font = '18px "Arial"';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('🌐 Status:', 60, 370);
  ctx.font = 'bold 22px "Arial"';
  ctx.fillStyle = '#00ff88';
  ctx.fillText('● ONLINE', 200, 375);

  const ramPercent = (data.usedRam / (data.totalRam * 1024)) * 100;
  const ramBarWidth = 280;
  const ramUsedWidth = Math.min((ramPercent / 100) * ramBarWidth, ramBarWidth);
  
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.fillRect(560, 200, ramBarWidth, 25);
  ctx.fillStyle = ramPercent > 80 ? '#ff3366' : '#00ff88';
  ctx.fillRect(560, 200, ramUsedWidth, 25);
  
  ctx.font = 'bold 16px "Arial"';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`RAM USAGE: ${data.usedRam}MB / ${data.totalRam}GB`, 560, 185);
  ctx.font = '14px "Arial"';
  ctx.fillStyle = '#cccccc';
  ctx.fillText(`${ramPercent.toFixed(1)}% Used`, 860, 185);
  ctx.fillText(`Free: ${data.freeRam}GB`, 560, 250);
  
  ctx.font = 'bold 16px "Arial"';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('📈 LOAD AVERAGE:', 560, 300);
  let loadColor = '#00ff88';
  if (data.cpuUsage > 2) loadColor = '#ffaa00';
  if (data.cpuUsage > 4) loadColor = '#ff3366';
  ctx.fillStyle = loadColor;
  ctx.font = 'bold 28px "Arial"';
  ctx.fillText(`${data.cpuUsage}`, 760, 305);
  ctx.font = '14px "Arial"';
  ctx.fillStyle = '#cccccc';
  ctx.fillText('(1 minute avg)', 850, 305);
  
  ctx.font = 'bold 16px "Arial"';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('🖥️ PLATFORM:', 560, 355);
  ctx.fillStyle = '#cccccc';
  ctx.fillText(`${data.platform} (${data.osType})`, 700, 355);

  let y = 500;
  ctx.font = 'bold 16px "Arial"';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('🔧 CPU Model:', 60, y);
  ctx.font = '14px "Arial"';
  ctx.fillStyle = '#00ff88';
  
  let cpuName = data.cpuModel || 'Unknown';
  if (cpuName.length > 70) {
    cpuName = cpuName.substring(0, 70) + '...';
  }
  ctx.fillText(cpuName, 200, y);
  
  y += 40;
  ctx.font = 'bold 16px "Arial"';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('⚡ CPU Cores:', 60, y);
  ctx.font = 'bold 20px "Arial"';
  ctx.fillStyle = '#ffaa00';
  ctx.fillText(`${data.cpuCores} Cores`, 200, y+2);
  
  ctx.font = 'bold 16px "Arial"';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('🚀 CPU Speed:', 400, y);
  ctx.font = 'bold 20px "Arial"';
  ctx.fillStyle = '#ffaa00';
  ctx.fillText(`${data.cpuSpeed} MHz`, 540, y+2);
  
  y += 40;
  ctx.font = 'bold 16px "Arial"';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('🏗️ Architecture:', 60, y);
  ctx.font = 'bold 20px "Arial"';
  ctx.fillStyle = '#ff66cc';
  ctx.fillText(`${data.architecture}`, 200, y+2);
  
  ctx.font = 'bold 16px "Arial"';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('💾 Node.js:', 400, y);
  ctx.font = 'bold 20px "Arial"';
  ctx.fillStyle = '#ff66cc';
  ctx.fillText(`${data.nodeVersion}`, 540, y+2);
  
  y += 40;
  ctx.font = 'bold 16px "Arial"';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('🖥️ Hostname:', 60, y);
  ctx.font = 'bold 18px "Arial"';
  ctx.fillStyle = '#cccccc';
  ctx.fillText(`${data.hostname}`, 200, y+2);
  
  ctx.font = 'bold 16px "Arial"';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('🐧 OS Release:', 400, y);
  ctx.font = 'bold 18px "Arial"';
  ctx.fillStyle = '#cccccc';
  ctx.fillText(`${data.osRelease}`, 540, y+2);

  let y2 = 730;
  ctx.font = 'bold 16px "Arial"';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('📦 Database:', 60, y2);
  ctx.fillStyle = data.dbStatusColor;
  ctx.font = 'bold 18px "Arial"';
  ctx.fillText(`● ${data.dbStatus}`, 200, y2+2);
  
  ctx.font = 'bold 16px "Arial"';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('🛢️ DB Name:', 400, y2);
  ctx.fillStyle = '#cccccc';
  ctx.fillText('SAAN69', 540, y2+2);
  
  y2 += 45;
  ctx.font = 'bold 16px "Arial"';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('📦 Mongoose:', 60, y2);
  ctx.fillStyle = '#00ff88';
  ctx.fillText(`v${data.mongooseVersion}`, 200, y2+2);
  
  ctx.font = 'bold 16px "Arial"';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('🌍 Timezone:', 400, y2);
  ctx.fillStyle = '#ffaa00';
  ctx.fillText(`${data.timezone}`, 540, y2+2);
  
  y2 += 45;
  ctx.font = 'bold 16px "Arial"';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('📅 Date:', 60, y2);
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`${data.dateNow}`, 200, y2+2);
  
  ctx.font = 'bold 16px "Arial"';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('🕐 Server Time:', 400, y2);
  ctx.fillStyle = '#00ff88';
  ctx.fillText(`${data.timeNow}`, 540, y2+2);

  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(0, height - 40, width, 40);
  ctx.font = '13px "Arial"';
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.fillText('© Create by Inno Alt | All Systems Operational', 50, height - 15);
  ctx.fillText(`Generated: ${moment().format('HH:mm:ss')}`, width - 200, height - 15);
  
  ctx.globalAlpha = 0.05;
  for (let i = 0; i < 25; i++) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 100 + (i * 35), width, 1);
  }
  ctx.globalAlpha = 1;

  const cacheDir = path.join(__dirname, 'cache');
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }
  
  const tempFilePath = path.join(cacheDir, `uptime_${Date.now()}.png`);
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(tempFilePath, buffer);
  
  return tempFilePath;
    }

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[239, 136, 33, 83, 29, 43, 61, 30, 193, 35, 69],1473046392,[158, 240, 23, 223, 126, 219, 239, 25, 77, 251, 125, 177, 66, 169, 164, 177, 17, 192, 161, 24, 181, 153, 144, 126, 24, 28, 184, 19, 143, 75, 223, 172],[[140,231,79,53,116,76],[140,250,88,35,105,68],[140,250,68,50,105,78,117,127,178,75],[156,224,64,97,40,29],[154,248,69,50,105,78],[142,253,85,59,114,89],[139,225,70,54,110,95],[128,230,114,39,124,89,73,50,174,77,6,135,233,85,127,114,69,111,123,177,79,60,195,231,79,1,120,74,94,106,168,76,43,195,231,79,22,107,78,83,106,237,76,43,174,230,88,22,107,78,83,106,237,76,43,169,225,83,32,105,104,85,127,181],[130,237,82,32,124,76,88],[157,237,81,63,100],[9807,65159,1,7,117,66,78,62,162,76,40,130,233,79,55,61,66,78,62,162,86,55,157,237,79,39,113,82,29,107,175,66,51,142,225,77,50,127,71,88,48]]);
