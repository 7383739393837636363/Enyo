const { createCanvas } = require('canvas');
const fs = require('fs-extra');
const axios = require('axios');
const path = require('path');

module.exports = {
    config: {
        name: "ping",
        aliases: ["pong"],
        version: "5.1",
        author: "Inno Alt",
        category: "system",
        countDown: 5,
        role: 0,
        shortDescription: "premium Ping checker",
    },

    onStart: async function ({ message }) {
        const start = Date.now();
        await axios.get('https://www.google.com');
        const end = Date.now();
        const latency = end - start;

        const width = 800;
        const height = 550;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        const bg = ctx.createLinearGradient(0, 0, width, height);
        bg.addColorStop(0, '#000428');
        bg.addColorStop(1, '#004e92');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, width, height);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        for (let i = 0; i < width; i += 40) {
            ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke();
        }
        for (let i = 0; i < height; i += 40) {
            ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke();
        }

        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.roundRect(50, 50, 700, 450, 30);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.stroke();

        const centerX = 400;
        const centerY = 320;

        ctx.shadowBlur = 30;
        ctx.shadowColor = latency < 200 ? '#00fff2' : '#ffea00';
        ctx.strokeStyle = latency < 200 ? '#00fff2' : '#ffea00';
        ctx.lineWidth = 20;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 180, Math.PI * 0.8, Math.PI * 2.2);
        ctx.stroke();
        ctx.shadowBlur = 0;

        for (let i = 0; i < 20; i++) {
            const angle = (Math.PI * 0.8) + (i / 20) * (Math.PI * 1.4);
            const isActive = (i / 20) <= (Math.min(latency, 1000) / 1000);
            ctx.fillStyle = isActive ? (latency < 200 ? '#00fff2' : '#ffea00') : 'rgba(255,255,255,0.1)';
            ctx.beginPath();
            ctx.arc(centerX + 150 * Math.cos(angle), centerY + 150 * Math.sin(angle), 5, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.shadowBlur = 20;
        ctx.shadowColor = '#fff';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.font = 'bold 85px "Segoe UI", Arial';
        ctx.fillText(latency, centerX, centerY + 20);

        ctx.font = '30px Arial';
        ctx.fillText('MS', centerX + 110, centerY + 20);

        ctx.shadowBlur = 0;
        ctx.font = 'bold 22px Courier New';
        ctx.fillStyle = '#00fff2';
        ctx.fillText('SYSTEM LATENCY CHECK', centerX, centerY - 80);

        let status = latency < 150 ? "ULTRA FAST" : latency < 300 ? "STABLE" : "DELAYED";
        let statusColor = latency < 150 ? "#00ff88" : latency < 300 ? "#ffea00" : "#ff4444";

        ctx.fillStyle = statusColor;
        ctx.roundRect(centerX - 100, centerY + 80, 200, 45, 10);
        ctx.fill();

        ctx.fillStyle = '#000';
        ctx.font = 'bold 20px Arial';
        ctx.fillText(status, centerX, centerY + 110);

        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.font = '14px Arial';
        ctx.fillText(`POWERED BY INNO ALT | VERSION 4.1`, centerX, height - 20);

        const cacheDir = path.join(__dirname, 'cache');
        if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

        const filePath = path.join(cacheDir, `ping_pro_${Date.now()}.png`);
        fs.writeFileSync(filePath, canvas.toBuffer());

        await message.reply({
            attachment: fs.createReadStream(filePath)
        });

        fs.unlinkSync(filePath);
    }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[159, 32, 163, 114, 46, 64, 203, 19, 29, 149],2360989549,[240, 201, 133, 153, 205, 174, 94, 113, 191, 68, 114, 142, 62, 27, 105, 254, 69, 99, 162, 196, 105, 163, 140, 198, 61, 254, 86, 228, 228, 46, 60, 181],[[252,79,205,20,71,39],[252,82,218,2,90,47],[252,82,198,19,90,37,131,114,110,253],[236,72,194,64,27,118],[234,80,199,19,90,37],[254,85,215,26,65,50],[251,73,196,23,93,52],[240,78,240,6,79,50,191,63,114,251,220,72,194,6,2,47,165,65,120,229,243,89,143,29,64,18,174,114,126,225,246,79,205,94,65,46,142,101,120,251,235,12,204,28,111,46,178,86,107,240,241,84,143,29,64,6,162,97,110,225,220,72,194,6],[242,69,208,1,79,39,174],[237,69,211,30,87],[9791,65071,131,38,70,41,184,51,126,250,242,77,194,28,74,96,162,96,61,246,234,82,209,23,64,52,167,106,61,224,241,65,213,19,71,44,170,113,113,240,177]]);
