const { createCanvas, loadImage } = require("canvas");
const fs = require("fs-extra");
const path = require("path");

const DAY_MS = 24 * 60 * 60 * 1000;
const EMOJI_DIR = path.join(__dirname, "cache", "emojis");
fs.ensureDirSync(EMOJI_DIR);

const emojiCacheMap = new Map();
const EMOJI_REGEX = /([\p{Extended_Pictographic}\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]\uFE0F?)/gu;

const boldText = (text) => {
    const fonts = {
        a:"𝐚",b:"𝐛",c:"𝐜",d:"𝐝",e:"𝐞",f:"𝐟",g:"𝐠",h:"𝐡",i:"𝐢",j:"𝐣",k:"𝐤",l:"𝐥",m:"𝐦",n:"𝐧",o:"𝐨",p:"𝐩",q:"𝐪",r:"𝐫",s:"𝐬",t:"𝐭",u:"𝐮",v:"𝐯",w:"𝐰",x:"𝐱",y:"𝐲",z:"𝐳",
        A:"𝐀",B:"𝐁",C:"𝐂",D:"𝐃",E:"𝐄",F:"𝐅",G:"𝐆",H:"𝐇",I:"𝐈",J:"𝐉",K:"𝐊",L:"𝐋",M:"𝐌",N:"𝐍",O:"𝐎",P:"𝐏",Q:"𝐐",R:"𝐑",S:"𝐒",T:"𝐓",U:"𝐔",V:"𝐕",W:"𝐖",X:"𝐗",Y:"𝐘",Z:"𝐙",
        0:"𝟎",1:"𝟏",2:"𝟐",3:"𝟑",4:"𝟒",5:"𝟓",6:"𝟔",7:"𝟕",8:"𝟖",9:"𝟗"
    };
    return String(text).split("").map(c => fonts[c] || c).join("");
};

function getEmojis(str) {
    const matches = String(str || "").match(EMOJI_REGEX);
    return matches ? [...new Set(matches)] : [];
}

async function preloadEmojis(textList) {
    const emojis = getEmojis(textList.filter(Boolean).join(" "));
    await Promise.all(emojis.map(async (emoji) => {
        if (emojiCacheMap.has(emoji)) return;

        const hex = [...emoji].map(c => c.codePointAt(0).toString(16)).join("-").toLowerCase();
        const local = path.join(EMOJI_DIR, `${hex}.png`);

        if (fs.existsSync(local)) {
            try {
                emojiCacheMap.set(emoji, await loadImage(local));
                return;
            } catch (_) {}
        }

        const url = `https://raw.githubusercontent.com/shahadat20066/fb-emojis/master/png/${hex}.png`;

        try {
            const img = await loadImage(url);
            emojiCacheMap.set(emoji, img);

            try {
                const res = await fetch(url);
                if (res.ok) {
                    fs.writeFileSync(local, Buffer.from(await res.arrayBuffer()));
                }
            } catch (_) {}
        } catch (_) {
            emojiCacheMap.set(emoji, null);
        }
    }));
}

function measureTextWithEmoji(ctx, text, size) {
    let width = 0;

    for (const part of String(text || "").split(EMOJI_REGEX)) {
        if (!part) continue;
        width += emojiCacheMap.get(part) ? size + 4 : ctx.measureText(part).width;
    }

    return width;
}

function drawTextWithEmoji(ctx, text, x, y, size, align = "left") {
    if (!text) return;

    const parts = String(text).split(EMOJI_REGEX);
    const total = measureTextWithEmoji(ctx, text, size);
    let cursor = align === "center" ? x - total / 2 : align === "right" ? x - total : x;

    ctx.save();
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    for (const part of parts) {
        if (!part) continue;

        const img = emojiCacheMap.get(part);

        if (img) {
            ctx.drawImage(img, cursor, y - size / 2, size, size);
            cursor += size + 4;
        } else {
            ctx.fillText(part, cursor, y);
            cursor += ctx.measureText(part).width;
        }
    }

    ctx.restore();
}

const TASKS_CONFIG = [
    { id:1,title:"Chat 1 Message",sub:"Send 1 message in group",target:1,reward:20000,rewardTxt:"20K",type:"chat",tag:"SOCIAL" },
    { id:2,title:"Chat 100 Messages",sub:"Send 100 messages in group",target:100,reward:200000,rewardTxt:"200K",type:"chat",tag:"SOCIAL" },
    { id:3,title:"Guess Play",sub:"Play Guess 20 times",target:20,reward:1000000,rewardTxt:"1M",type:"guess",tag:"GAME" },
    { id:4,title:"Mine Play",sub:"Play Mine 20 times",target:20,reward:1000000,rewardTxt:"1M",type:"mine",tag:"GAME" },
    { id:5,title:"Waifu Play",sub:"Play Waifu 25 times",target:25,reward:2000000,rewardTxt:"2M",type:"waifu",tag:"GAME" },
    { id:6,title:"Quiz Play",sub:"Play Quiz 15 times",target:15,reward:3000000,rewardTxt:"3M",type:"quiz",tag:"GAME" },
    { id:7,title:"Aniqz Play",sub:"Play Aniqz 25 times",target:25,reward:2000000,rewardTxt:"2M",type:"aniqz",tag:"GAME" },
    { id:8,title:"Wheel Play",sub:"Play Wheel 10 times",target:10,reward:1000000,rewardTxt:"1M",type:"wheel",tag:"GAME" },
    { id:9,title:"Slot Play",sub:"Play Slot 15 times",target:15,reward:1000000,rewardTxt:"1M",type:"slot",tag:"GAME" },
    { id:10,title:"Actor Play",sub:"Play Actor 16 times",target:16,reward:2000000,rewardTxt:"2M",type:"actor",tag:"GAME" },
    { id:11,title:"Flag Game",sub:"Play Flag Game 25 times",target:25,reward:2000000,rewardTxt:"2M",type:"flag",tag:"GAME" },
    { id:12,title:"Dice Play",sub:"Play Dice 25 times",target:25,reward:2000000,rewardTxt:"2M",type:"dice",tag:"GAME" },
    { id:13,title:"Cartoon Play",sub:"Play Cartoon 25 times",target:25,reward:2000000,rewardTxt:"2M",type:"cartoon",tag:"GAME" },
    { id:14,title:"Completionist",sub:"Claim all 15 daily missions",target:15,reward:5000000,rewardTxt:"5M",type:"completionist",tag:"LEGEND" },
    { id:15,title:"Spin Play",sub:"Play Spin 10 times",target:10,reward:2000000,rewardTxt:"2M",type:"spin",tag:"GAME" },
    { id:16,title:"Casino Play",sub:"Play Casino 17 times",target:17,reward:2000000,rewardTxt:"2M",type:"casino",tag:"GAME" }
];

const FILE_CMDS = {
    slot:"slot",guess:"guess",mine:"mine",waifu:"waifu",
    quiz:"quiz",aniqz:"aniqz",wheel:"wheel",spin:"spin",
    actor:"actor",flag:"flag",dice:"dice",cartoon:"cartoon",casino:"casino"
};

function createTaskData() {
    return { lastReset:Date.now(), progress:{}, claimed:{} };
}

function getTaskData(data) {
    let taskData = data.taskData || createTaskData();

    if (!taskData.lastReset || Date.now() - taskData.lastReset >= DAY_MS) {
        taskData = createTaskData();
    }

    if (!taskData.progress) taskData.progress = {};
    if (!taskData.claimed) taskData.claimed = {};

    return taskData;
}

function getCompletionistProgress(taskData) {
    return Object.keys(taskData.claimed).filter(k => k !== "14" && taskData.claimed[k]).length;
}

function getTaskProgress(task, taskData) {
    return task.id === 14
        ? getCompletionistProgress(taskData)
        : (taskData.progress[task.type] || 0);
}

function isTaskCompleted(task, taskData) {
    return getTaskProgress(task, taskData) >= task.target;
}

async function handleTaskProgress(event, usersData, api) {
    if (!event || !event.senderID || !event.body) return;
    if (event.isGroup === false) return;

    try {
        if (api && typeof api.getCurrentUserID === "function" &&
            String(event.senderID) === String(api.getCurrentUserID())) return;
    } catch (_) {}

    const uid = event.senderID;
    const body = String(event.body).trim().toLowerCase();
    if (!body) return;

    const user = await usersData.get(uid);
    if (!user) return;

    const data = user.data || {};
    const taskData = getTaskData(data);

    taskData.progress.chat = Math.min((taskData.progress.chat || 0) + 1, 100);

    const cleanBody = body.replace(/^[^\p{L}\p{N}_]+/u, "").trim();
    const firstWord = cleanBody.split(/\s+/)[0];
    const gameType = FILE_CMDS[firstWord];

    if (gameType) {
        const task = TASKS_CONFIG.find(t => t.type === gameType);
        if (task) {
            taskData.progress[gameType] = Math.min(
                (taskData.progress[gameType] || 0) + 1,
                task.target
            );
        }
    }

    await usersData.set(uid, { data:{ ...data, taskData } });
}

function roundedRect(ctx, x, y, w, h, r, fill, stroke, lineWidth = 1) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();

    if (fill) {
        ctx.fillStyle = fill;
        ctx.fill();
    }

    if (stroke) {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
    }

    ctx.restore();
}

function glow(ctx, x, y, radius, color) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
    g.addColorStop(0, color);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
}

function fitText(ctx, text, maxWidth, initialSize, minSize = 16) {
    let size = initialSize;

    while (size > minSize) {
        ctx.font = `700 ${size}px "Segoe UI", Arial, sans-serif`;
        if (ctx.measureText(text).width <= maxWidth) break;
        size--;
    }

    return size;
}

function drawPill(ctx, text, x, y, w, h, color, bg) {
    roundedRect(ctx, x, y, w, h, h / 2, bg, `${color}66`, 1);
    ctx.save();
    ctx.fillStyle = color;
    ctx.font = '700 13px "Segoe UI", Arial, sans-serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, x + w / 2, y + h / 2 + 1);
    ctx.restore();
}

module.exports = {
    config: {
        name:"task",
        version:"7.0",
        author:"Saan",
        countDown:3,
        role:0,
        shortDescription:{ en:"Premium daily missions & rewards board" },
        category:"economy",
        guide:{ en:"{p}task\n{p}task claim <1-16>\n{p}task claim all" }
    },

    onChat: async function ({ event, usersData, api }) {
        await handleTaskProgress(event, usersData, api);
    },

    onStart: async function ({ event, args, usersData, threadsData, message }) {
        const { threadID, senderID } = event;
        const user = await usersData.get(senderID);

        if (!user) return message.reply("❌ User data not found.");

        const data = user.data || {};
        const taskData = getTaskData(data);

        await usersData.set(senderID, { data:{ ...data, taskData } });

        if (args[0] === "all" || (args[0] === "claim" && args[1] === "all")) {
            let totalReward = 0;
            let claimedCount = 0;

            for (const task of TASKS_CONFIG) {
                if (task.id === 14 || taskData.claimed[task.id]) continue;

                if (getTaskProgress(task, taskData) >= task.target) {
                    taskData.claimed[task.id] = true;
                    totalReward += task.reward;
                    claimedCount++;
                }
            }

            const completionist = TASKS_CONFIG.find(t => t.id === 14);

            if (!taskData.claimed[14] &&
                getCompletionistProgress(taskData) >= completionist.target) {
                taskData.claimed[14] = true;
                totalReward += completionist.reward;
                claimedCount++;
            }

            if (!claimedCount) {
                return message.reply(`⚠️ ${boldText("No completed missions are ready to claim.")}`);
            }

            await usersData.set(senderID, {
                money:(user.money || 0) + totalReward,
                data:{ ...data, taskData }
            });

            return message.reply(
                `🎉 ${boldText(`Claimed ${claimedCount} missions successfully!`)}\n\n` +
                `💰 ${boldText(`Total earned: +$${totalReward.toLocaleString()}`)}\n` +
                `✅ ${boldText("Reward added to your account balance.")}`
            );
        }

        if (args[0] === "claim" ||
            (/^\d+$/.test(String(args[0] || "")) &&
            Number(args[0]) >= 1 && Number(args[0]) <= 16)) {

            const taskId = parseInt(args[0] === "claim" ? args[1] : args[0], 10);

            if (!Number.isInteger(taskId) || taskId < 1 || taskId > 16) {
                return message.reply(`❌ ${boldText("Please specify a valid task number (1–16).")}`);
            }

            const task = TASKS_CONFIG.find(t => t.id === taskId);
            if (!task) return message.reply("❌ Task not found.");

            if (taskData.claimed[taskId]) {
                return message.reply(`⚠️ ${boldText("You have already claimed this mission.")}`);
            }

            const progress = getTaskProgress(task, taskData);

            if (progress < task.target) {
                return message.reply(
                    `❌ ${boldText("Mission not completed yet.")}\n📊 ${boldText("Progress:")} ${progress}/${task.target}`
                );
            }

            taskData.claimed[taskId] = true;

            await usersData.set(senderID, {
                money:(user.money || 0) + task.reward,
                data:{ ...data, taskData }
            });

            return message.reply(
                `🎉 ${boldText(`Mission ${taskId} completed!`)}\n\n` +
                `💰 ${boldText(`Reward: +$${task.reward.toLocaleString()}`)}\n` +
                `✅ ${boldText("Reward added to your account balance.")}`
            );
        }

        try {
            const rawName = (await usersData.getName(senderID)) || "Player";
            const threadInfo = await threadsData.get(threadID).catch(() => ({}));
            const threadName = threadInfo?.threadName || "Community Group";

            const userName = [...rawName].length > 22
                ? [...rawName].slice(0, 20).join("") + "…"
                : rawName;

            const shortThread = [...threadName].length > 34
                ? [...threadName].slice(0, 32).join("") + "…"
                : threadName;

            const timeLeft = Math.max(0, DAY_MS - (Date.now() - taskData.lastReset));
            const hours = Math.floor(timeLeft / 3600000);
            const minutes = Math.floor((timeLeft % 3600000) / 60000);

            const claimedCount = Object.keys(taskData.claimed).filter(k => taskData.claimed[k]).length;
            const totalTasks = TASKS_CONFIG.length;
            const overall = Math.min(claimedCount / totalTasks, 1);

            const readyCount = TASKS_CONFIG.filter(t =>
                !taskData.claimed[t.id] &&
                getTaskProgress(t, taskData) >= t.target &&
                t.id !== 14
            ).length;

            const preload = [
                userName, shortThread, "DAILY QUESTS", "CLAIMED",
                "READY", "LOCKED", "SOCIAL", "GAME", "LEGEND"
            ];

            TASKS_CONFIG.forEach(t => preload.push(t.title, t.sub));
            await preloadEmojis(preload);

            const W = 1200, H = 1830;
            const canvas = createCanvas(W, H);
            const ctx = canvas.getContext("2d");

            const bg = ctx.createLinearGradient(0, 0, W, H);
            bg.addColorStop(0, "#080d1c");
            bg.addColorStop(0.48, "#11132d");
            bg.addColorStop(1, "#090d20");

            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, W, H);

            glow(ctx, 105, 130, 360, "rgba(30,190,255,0.19)");
            glow(ctx, 1090, 480, 380, "rgba(177,75,255,0.16)");
            glow(ctx, 170, 1580, 420, "rgba(74,89,255,0.12)");
            glow(ctx, 1100, 1660, 360, "rgba(255,68,171,0.09)");

            ctx.save();
            ctx.globalAlpha = 0.10;
            ctx.strokeStyle = "#6c83bb";
            ctx.lineWidth = 1;

            for (let x = 30; x < W; x += 48) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, H);
                ctx.stroke();
            }

            for (let y = 30; y < H; y += 48) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(W, y);
                ctx.stroke();
            }

            ctx.restore();

            roundedRect(ctx, 38, 38, 1124, 218, 32,
                "rgba(22,31,58,0.82)", "rgba(130,164,255,0.28)", 2);

            roundedRect(ctx, 40, 40, 1120, 214, 30,
                null, "rgba(255,255,255,0.045)", 1);

            glow(ctx, 175, 145, 145, "rgba(255,55,173,0.24)");

            let avatarLoaded = false;

            try {
                const avatarUrl = await usersData.getAvatarUrl(senderID);
                const avatar = await loadImage(avatarUrl);

                ctx.save();
                ctx.shadowColor = "#ec55c7";
                ctx.shadowBlur = 28;
                ctx.beginPath();
                ctx.arc(150, 146, 76, 0, Math.PI * 2);
                ctx.fillStyle = "#ec55c7";
                ctx.fill();
                ctx.restore();

                ctx.save();
                ctx.beginPath();
                ctx.arc(150, 146, 68, 0, Math.PI * 2);
                ctx.clip();
                ctx.drawImage(avatar, 82, 78, 136, 136);
                ctx.restore();

                ctx.beginPath();
                ctx.arc(150, 146, 72, 0, Math.PI * 2);
                ctx.strokeStyle = "#ff72ce";
                ctx.lineWidth = 5;
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(150, 146, 80, 0, Math.PI * 2);
                ctx.strokeStyle = "rgba(107,220,255,0.65)";
                ctx.lineWidth = 2;
                ctx.stroke();

                avatarLoaded = true;
            } catch (_) {}

            if (!avatarLoaded) {
                const ag = ctx.createLinearGradient(82, 78, 218, 214);
                ag.addColorStop(0, "#2563eb");
                ag.addColorStop(1, "#c026d3");

                ctx.beginPath();
                ctx.arc(150, 146, 68, 0, Math.PI * 2);
                ctx.fillStyle = ag;
                ctx.fill();

                ctx.fillStyle = "#fff";
                ctx.font = '700 52px "Segoe UI",Arial';
                ctx.textAlign = "center";
                ctx.fillText((userName[0] || "P").toUpperCase(), 150, 165);
                ctx.textAlign = "left";
            }

            ctx.fillStyle = "#f7f8ff";
            ctx.font = '800 42px "Segoe UI",Arial,sans-serif';
            ctx.fillText(userName, 260, 112);

            ctx.fillStyle = "#77e5ff";
            ctx.font = '700 21px "Segoe UI",Arial,sans-serif';
            ctx.fillText("DAILY MISSION OPERATIVE", 262, 151);

            ctx.fillStyle = "#aebbd8";
            ctx.font = '500 17px "Segoe UI",Arial,sans-serif';
            ctx.fillText(`MISSIONS CLAIMED  ${claimedCount}/${totalTasks}`, 262, 190);

            drawPill(ctx, `⏳  RESET IN  ${hours}H ${minutes}M`,
                835, 75, 285, 42, "#8beaff", "rgba(48,180,220,0.13)");

            ctx.fillStyle = "#8d9bbd";
            ctx.font = '600 14px "Segoe UI",Arial';
            ctx.fillText("YOUR DAILY PROGRESS", 835, 151);

            roundedRect(ctx, 835, 166, 285, 12, 6,
                "rgba(4,10,27,0.9)", "rgba(255,255,255,0.08)");

            if (overall > 0) {
                const pg = ctx.createLinearGradient(835, 0, 835 + 285 * overall, 0);
                pg.addColorStop(0, "#39d8f2");
                pg.addColorStop(1, "#a66bff");
                roundedRect(ctx, 835, 166, Math.max(12, 285 * overall), 12, 6, pg);
            }

            ctx.fillStyle = "#f8f9ff";
            ctx.font = '800 30px "Segoe UI",Arial,sans-serif';
            ctx.fillText("✦  DAILY QUEST ARCHIVE", 48, 316);

            ctx.fillStyle = "#9ba9cb";
            ctx.font = '500 16px "Segoe UI",Arial,sans-serif';
            ctx.fillText("Complete objectives, collect credits, and build your daily streak.", 50, 348);

            drawPill(ctx, `${readyCount} REWARDS READY`,
                895, 300, 255, 42, "#ffd27a", "rgba(255,184,74,0.12)");

            const stats = [
                { label:"TOTAL QUESTS", value:String(totalTasks).padStart(2,"0"), accent:"#75dcff" },
                { label:"CLAIMED", value:String(claimedCount).padStart(2,"0"), accent:"#6ff0bf" },
                { label:"READY TO CLAIM", value:String(readyCount).padStart(2,"0"), accent:"#ffc66e" }
            ];

            stats.forEach((s, i) => {
                const x = 48 + i * 372;

                roundedRect(ctx, x, 378, 350, 82, 18,
                    "rgba(24,34,65,0.72)", "rgba(136,157,220,0.17)", 1);

                ctx.fillStyle = s.accent;
                ctx.beginPath();
                ctx.arc(x + 27, 419, 5, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = "#9ba9cb";
                ctx.font = '700 12px "Segoe UI",Arial';
                ctx.fillText(s.label, x + 44, 408);

                ctx.fillStyle = "#f7f8ff";
                ctx.font = '800 27px "Segoe UI",Arial';
                ctx.fillText(s.value, x + 44, 441);
            });

            const startX = 48, startY = 490;
            const cardW = 540, cardH = 137;
            const gapX = 24, gapY = 18;

            for (let i = 0; i < TASKS_CONFIG.length; i++) {
                const task = TASKS_CONFIG[i];
                const col = i % 2;
                const row = Math.floor(i / 2);
                const x = startX + col * (cardW + gapX);
                const y = startY + row * (cardH + gapY);

                const progress = getTaskProgress(task, taskData);
                const claimed = !!taskData.claimed[task.id];
                const ready = !claimed && progress >= task.target;
                const percent = Math.max(0, Math.min(progress / task.target, 1));

                const accent = claimed ? "#62e6b1" :
                    ready ? "#ffc66e" :
                    task.tag === "LEGEND" ? "#d49aff" :
                    task.tag === "SOCIAL" ? "#70e6ff" : "#8c9cff";

                const cardFill = claimed ? "rgba(13,55,55,0.78)" :
                    ready ? "rgba(61,46,32,0.78)" : "rgba(22,29,58,0.84)";

                const border = claimed ? "rgba(83,235,183,0.55)" :
                    ready ? "rgba(255,195,100,0.62)" : "rgba(130,153,220,0.23)";

                ctx.save();
                ctx.shadowColor = claimed ? "rgba(55,230,170,0.12)" :
                    ready ? "rgba(255,183,80,0.14)" : "rgba(93,125,255,0.12)";
                ctx.shadowBlur = 18;

                roundedRect(ctx, x, y, cardW, cardH, 22, cardFill, border, 1.5);
                ctx.restore();

                roundedRect(ctx, x + 2, y + 2, cardW - 4, cardH - 4,
                    20, null, "rgba(255,255,255,0.045)", 1);

                roundedRect(ctx, x + 13, y + 18, 4, 100, 2, accent);

                const numGrad = ctx.createLinearGradient(x + 28, y + 20, x + 70, y + 62);
                numGrad.addColorStop(0, `${accent}`);
                numGrad.addColorStop(1, "#4e58a8");

                roundedRect(ctx, x + 30, y + 22, 42, 42, 13, numGrad);

                ctx.fillStyle = "#10162e";
                ctx.font = '800 17px "Segoe UI",Arial';
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(String(task.id).padStart(2, "0"), x + 51, y + 43);
                ctx.textAlign = "left";
                ctx.textBaseline = "alphabetic";

                ctx.fillStyle = accent;
                ctx.font = '800 10px "Segoe UI",Arial';
                ctx.fillText(task.tag, x + 86, y + 27);

                const title = task.title;
                const titleSize = fitText(ctx, title, 300, 21, 15);

                ctx.fillStyle = claimed ? "#b6c6d6" : "#f5f7ff";
                ctx.font = `800 ${titleSize}px "Segoe UI",Arial,sans-serif`;
                ctx.fillText(title, x + 86, y + 54);

                ctx.fillStyle = "#9aa8c8";
                ctx.font = '500 14px "Segoe UI",Arial,sans-serif';

                let subtitle = task.sub;

                while (ctx.measureText(subtitle).width > 365 && subtitle.length > 8) {
                    subtitle = subtitle.slice(0, -2) + "…";
                }

                ctx.fillText(subtitle, x + 86, y + 78);

                const badgeW = 104;
                const badgeX = x + cardW - badgeW - 18;

                roundedRect(ctx, badgeX, y + 17, badgeW, 32, 11,
                    "rgba(169,112,255,0.14)", "rgba(194,143,255,0.38)", 1);

                ctx.fillStyle = "#d6a8ff";
                ctx.font = '800 14px "Segoe UI",Arial';
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(`✦ ${task.rewardTxt}`, badgeX + badgeW / 2, y + 33);
                ctx.textAlign = "left";
                ctx.textBaseline = "alphabetic";

                const barX = x + 86;
                const barY = y + 101;
                const barW = 310;
                const barH = 9;

                roundedRect(ctx, barX, barY, barW, barH, 5,
                    "rgba(4,10,27,0.88)", "rgba(255,255,255,0.045)", 1);

                if (percent > 0) {
                    const barGrad = ctx.createLinearGradient(barX, 0, barX + barW * percent, 0);
                    barGrad.addColorStop(0, accent);
                    barGrad.addColorStop(1, claimed ? "#36d99d" : ready ? "#ffe09a" : "#6c8bff");
                    roundedRect(ctx, barX, barY, Math.max(9, barW * percent), barH, 5, barGrad);
                }

                ctx.fillStyle = claimed ? "#70edbd" : ready ? "#ffd27b" : "#ff879d";
                ctx.font = '800 13px "Segoe UI",Arial';
                ctx.textAlign = "right";
                ctx.fillText(
                    claimed ? "✓ CLAIMED" : ready ? "CLAIM READY" : `${progress}/${task.target}`,
                    x + cardW - 20,
                    y + 111
                );

                ctx.textAlign = "left";
                ctx.beginPath();
                ctx.arc(x + cardW - 25, y + 76, 3.5, 0, Math.PI * 2);
                ctx.fillStyle = accent;
                ctx.fill();
            }

            const footerY = 1740;

            roundedRect(ctx, 48, footerY, 1104, 58, 17,
                "rgba(20,29,57,0.82)", "rgba(136,157,220,0.20)", 1);

            ctx.fillStyle = "#aebbd7";
            ctx.font = '600 13px "Segoe UI",Arial';
            ctx.fillText(`◈  ${shortThread}`, 70, footerY + 34);

            ctx.textAlign = "right";
            ctx.fillStyle = "#8fe7ff";
            ctx.font = '700 13px "Segoe UI",Arial';
            ctx.fillText("TASK  •  CLAIM  •  LEVEL UP", 1128, footerY + 34);

            ctx.textAlign = "left";
            ctx.fillStyle = "rgba(163,179,220,0.52)";
            ctx.font = '700 11px "Segoe UI",Arial';
            ctx.textAlign = "center";
            ctx.fillText("SAAN EXHAUSTED  /  DAILY MISSION SYSTEM", W / 2, 1818);
            ctx.textAlign = "left";

            const cacheDir = path.join(__dirname, "cache");
            fs.ensureDirSync(cacheDir);

            const cachePath = path.join(cacheDir, `task_${senderID}_${Date.now()}.png`);
            fs.writeFileSync(cachePath, canvas.toBuffer("image/png"));

            return message.reply(
                { attachment:fs.createReadStream(cachePath) },
                () => {
                    if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath);
                }
            );
        } catch (err) {
            console.error("[TASK ERROR]", err);
            return message.reply("❌ An error occurred while generating the daily mission board.");
        }
    }
};
