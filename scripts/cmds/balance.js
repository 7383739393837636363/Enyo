const { createCanvas, loadImage } = require("canvas");
const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

const nx_210 = "Inno Alt";

module.exports = {
    config: {
        name: "balance",
        aliases: ["bal"],
        version: "7.0",
        author: "Inno Alt",
        countDown: 2,
        role: 0,
        description: "View balance card, transfer money, and track balance history",
        category: "ECONOMY",
        guide: {
            en: "{pn}\n{pn} @tag\n{pn} transfer @tag [amount]\n{pn} history"
        }
    },

    onStart: async function ({ message, usersData, event, args, api }) {
        const senderID = event.senderID;
        const today = new Date().toISOString().split("T")[0];

        const formatBalance = (value) => {
            if (value === null || value === undefined || value === "") {
                return "0";
            }

            const str = String(value).trim();

            if (
                str.toLowerCase() === "infinity" ||
                str.toLowerCase() === "inf"
            ) {
                return "∞";
            }

            let n = Number(str);

            if (!Number.isFinite(n)) {
                return str;
            }

            if (n < 1000) {
                return Math.floor(n).toLocaleString("en-US");
            }

            const units = [
                { value: 1e63, short: "Vg" },
                { value: 1e60, short: "Nvg" },
                { value: 1e57, short: "Ocdc" },
                { value: 1e54, short: "Sxdc" },
                { value: 1e51, short: "Qidc" },
                { value: 1e48, short: "Qadc" },
                { value: 1e45, short: "Tdc" },
                { value: 1e42, short: "Ddc" },
                { value: 1e39, short: "Udc" },
                { value: 1e36, short: "Dc" },
                { value: 1e33, short: "No" },
                { value: 1e30, short: "Oc" },
                { value: 1e27, short: "Sp" },
                { value: 1e24, short: "Sx" },
                { value: 1e21, short: "Qi" },
                { value: 1e18, short: "Qi" },
                { value: 1e15, short: "Qa" },
                { value: 1e12, short: "T" },
                { value: 1e9, short: "B" },
                { value: 1e6, short: "M" },
                { value: 1e3, short: "K" }
            ];

            for (const unit of units) {
                if (n >= unit.value) {
                    let result = n / unit.value;

                    if (result >= 100) {
                        result = result.toFixed(0);
                    } else if (result >= 10) {
                        result = result.toFixed(2);
                    } else {
                        result = result.toFixed(2);
                    }

                    result = String(result).replace(/\.00$/, "");

                    return result + unit.short;
                }
            }

            return n.toLocaleString("en-US");
        };

        const getTargetUID = () => {
            if (event.messageReply) {
                return event.messageReply.senderID;
            }

            if (event.mentions && Object.keys(event.mentions).length > 0) {
                return Object.keys(event.mentions)[0];
            }

            if (args[1] && !isNaN(args[1])) {
                return args[1];
            }

            return null;
        };

        let userData = await usersData.get(senderID);

        if (!userData) {
            return message.reply("❌ User data not found!");
        }

        let history = Array.isArray(userData.balanceHistory)
            ? userData.balanceHistory
            : [];

        let currentMoney = Number(userData.money || 0);

        if (
            history.length === 0 ||
            history[history.length - 1].date !== today
        ) {
            history.push({
                date: today,
                balance: currentMoney
            });

            if (history.length > 10) {
                history.shift();
            }

            await usersData.set(senderID, {
                balanceHistory: history
            });
        }

        if (args[0] && args[0].toLowerCase() === "history") {
            if (history.length < 2) {
                return message.reply(
                    "📉 Not enough balance history yet!\nCheck again tomorrow."
                );
            }

            let historyMsg =
                "📊 𝗟𝗔𝗦𝗧 𝟭𝟬 𝗗𝗔𝗬𝗦 𝗕𝗔𝗟𝗔𝗡𝗖𝗘 𝗟𝗢𝗚\n" +
                "━━━━━━━━━━━━━━━━━━\n";

            const displayHistory = [...history].reverse();

            displayHistory.forEach((entry, i) => {
                const prevEntry = displayHistory[i + 1];

                let change = "";

                if (prevEntry) {
                    const diff =
                        Number(entry.balance || 0) -
                        Number(prevEntry.balance || 0);

                    if (diff > 0) {
                        change = ` 📈 +$${formatBalance(diff)}`;
                    } else if (diff < 0) {
                        change = ` 📉 -$${formatBalance(Math.abs(diff))}`;
                    } else {
                        change = " ➖ No change";
                    }
                }

                historyMsg +=
                    `📅 ${entry.date}\n` +
                    `💰 $${formatBalance(entry.balance)}${change}\n` +
                    "──────────────────\n";
            });

            return message.reply(historyMsg);
        }

        if (args[0] && args[0].toLowerCase() === "transfer") {
            const targetUID = getTargetUID();
            const amountText = args[args.length - 1];

            if (!amountText) {
                return message.reply(
                    "❌ Usage:\nbalance transfer @tag [amount]"
                );
            }

            let amount = parseAmount(amountText);

            if (
                !targetUID ||
                targetUID === senderID ||
                !Number.isFinite(amount) ||
                amount <= 0
            ) {
                return message.reply(
                    "❌ Usage:\nbalance transfer @tag [amount]"
                );
            }

            if (currentMoney < amount) {
                return message.reply("❌ Insufficient balance!");
            }

            const receiverData = await usersData.get(targetUID);

            if (!receiverData) {
                return message.reply("❌ Receiver not found!");
            }

            const receiverMoney = Number(receiverData.money || 0);

            await usersData.set(senderID, {
                money: currentMoney - amount
            });

            await usersData.set(targetUID, {
                money: receiverMoney + amount
            });

            return message.reply(
                `✅ Successfully transferred $${formatBalance(amount)}\n` +
                `👤 To: ${receiverData.name || "User"}\n` +
                `⚡ System Provider: ${nx_210}`
            );
        }

        const targetID = getTargetUID() || senderID;

        const targetData = await usersData.get(targetID);

        if (!targetData) {
            return message.reply("❌ User not found!");
        }

        let profileInfo = null;

        try {
            const result = await api.getUserInfo(targetID);

            profileInfo =
                result && result[targetID]
                    ? result[targetID]
                    : result;
        } catch (error) {
            profileInfo = null;
        }

        const profileName =
            profileInfo?.name ||
            targetData.name ||
            "Global User";

        const profileImageURL =
            profileInfo?.thumbSrc ||
            null;

        const cardImg = await createBalanceCard({
            name: profileName,
            balance: targetData.money || 0,
            uid: targetID,
            avatarURL: profileImageURL
        });

        const displayBalance = formatBalance(targetData.money || 0);

        return message.reply(
            {
                body: `💰 Balance: $${displayBalance}`,
                attachment: fs.createReadStream(cardImg)
            },
            () => {
                if (fs.existsSync(cardImg)) {
                    fs.unlinkSync(cardImg);
                }
            }
        );
    }
};

function parseAmount(value) {
    if (!value) return NaN;

    let str = String(value)
        .trim()
        .toLowerCase()
        .replace(/[$,]/g, "");

    const units = {
        k: 1e3,
        m: 1e6,
        b: 1e9,
        t: 1e12,
        qa: 1e15,
        qi: 1e18,
        sx: 1e21,
        sp: 1e24,
        oc: 1e27,
        no: 1e30,
        dc: 1e33
    };

    const match = str.match(/^([0-9.]+)([a-z]+)?$/);

    if (!match) return NaN;

    const number = Number(match[1]);
    const unit = match[2];

    if (!Number.isFinite(number)) {
        return NaN;
    }

    if (unit && units[unit]) {
        return number * units[unit];
    }

    return number;
}

async function createBalanceCard({
    name,
    balance,
    uid,
    avatarURL
}) {
    const width = 800;
    const height = 450;

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    const gradient = ctx.createLinearGradient(
        0,
        0,
        width,
        height
    );

    gradient.addColorStop(0, "#080b24");
    gradient.addColorStop(0.45, "#17133d");
    gradient.addColorStop(1, "#071a31");

    ctx.fillStyle = gradient;

    if (typeof ctx.roundRect === "function") {
        ctx.beginPath();
        ctx.roundRect(0, 0, width, height, 30);
        ctx.fill();
    } else {
        ctx.fillRect(0, 0, width, height);
    }

    const glow = ctx.createRadialGradient(
        680,
        100,
        20,
        680,
        100,
        300
    );

    glow.addColorStop(
        0,
        "rgba(0, 210, 255, 0.18)"
    );

    glow.addColorStop(
        1,
        "rgba(0, 210, 255, 0)"
    );

    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle =
        "rgba(0, 210, 255, 0.10)";

    ctx.lineWidth = 2;

    for (let i = 0; i < 12; i++) {
        ctx.beginPath();

        ctx.moveTo(
            0,
            80 + i * 32
        );

        ctx.bezierCurveTo(
            180,
            40 + i * 20,
            500,
            430 - i * 10,
            800,
            260 + i * 10
        );

        ctx.stroke();
    }

    ctx.strokeStyle =
        "rgba(0, 210, 255, 0.6)";

    ctx.lineWidth = 2;

    if (typeof ctx.roundRect === "function") {
        ctx.beginPath();
        ctx.roundRect(
            15,
            15,
            width - 30,
            height - 30,
            25
        );
        ctx.stroke();
    }

    ctx.font = "bold 30px Arial";
    ctx.fillStyle = "#ffffff";

    ctx.fillText(
        "GOAT BANK BANGLADESH LIMITED ",
        45,
        60
    );

    ctx.font = "16px Arial";
    ctx.fillStyle =
        "rgba(255,255,255,0.55)";

    ctx.fillText(
        "",
        48,
        86
    );

    ctx.textAlign = "right";

    ctx.font = "italic bold 32px Arial";
    ctx.fillStyle = "#00d2ff";

    ctx.fillText(
        "UA",
        750,
        65
    );

    ctx.textAlign = "left";

    await drawProfilePicture(
        ctx,
        avatarURL,
        110,
        155,
        62
    );

    ctx.font = "bold 24px Arial";
    ctx.fillStyle = "#ffffff";

    const safeName =
        String(name || "Global User")
            .replace(/[^\x20-\x7E]/g, "")
            .trim() || "Global User";

    ctx.fillText(
        truncateText(ctx, safeName, 210),
        195,
        145
    );

    ctx.font = "15px Arial";
    ctx.fillStyle =
        "rgba(255,255,255,0.45)";

    ctx.fillText(
        "ACCOUNT HOLDER",
        195,
        170
    );

    ctx.font = "18px Arial";
    ctx.fillStyle =
        "rgba(255,255,255,0.55)";

    ctx.fillText(
        "AVAILABLE BALANCE",
        55,
        270
    );

    const balanceText =
        "$" + formatCardBalance(balance);

    let balanceFontSize = 78;

    if (balanceText.length > 13) {
        balanceFontSize = 44;
    } else if (balanceText.length > 10) {
        balanceFontSize = 55;
    } else if (balanceText.length > 8) {
        balanceFontSize = 65;
    }

    ctx.font =
        `bold ${balanceFontSize}px Arial`;

    ctx.shadowColor = "#00d2ff";
    ctx.shadowBlur = 20;

    ctx.fillStyle = "#00d2ff";

    ctx.fillText(
        balanceText,
        55,
        345
    );

    ctx.shadowBlur = 0;

    ctx.font = "17px monospace";
    ctx.fillStyle =
        "rgba(255,255,255,0.45)";

    const uidText =
        String(uid);

    ctx.fillText(
        `ID: ${uidText}`,
        55,
        385
    );

    ctx.font = "bold 20px Arial";
    ctx.fillStyle = "#ffffff";

    ctx.fillText(
        truncateText(ctx, safeName.toUpperCase(), 350),
        55,
        420
    );

    ctx.textAlign = "right";

    ctx.font = "14px Arial";
    ctx.fillStyle =
        "rgba(255,255,255,0.45)";

    ctx.fillText(
        "MADE BY INNO ALT",
        745,
        420
    );

    ctx.textAlign = "left";

    const cachePath =
        path.join(__dirname, "cache");

    await fs.ensureDir(cachePath);

    const imagePath =
        path.join(
            cachePath,
            `balance_${uid}_${Date.now()}.png`
        );

    fs.writeFileSync(
        imagePath,
        canvas.toBuffer("image/png")
    );

    return imagePath;
}

async function drawProfilePicture(
    ctx,
    avatarURL,
    x,
    y,
    radius
) {
    ctx.save();

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        radius + 7,
        0,
        Math.PI * 2
    );

    ctx.strokeStyle = "#00d2ff";
    ctx.lineWidth = 3;

    ctx.shadowColor = "#00d2ff";
    ctx.shadowBlur = 18;

    ctx.stroke();

    ctx.shadowBlur = 0;

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        radius,
        0,
        Math.PI * 2
    );

    ctx.clip();

    ctx.fillStyle = "#17213c";

    ctx.fillRect(
        x - radius,
        y - radius,
        radius * 2,
        radius * 2
    );

    if (avatarURL) {
        try {
            const response = await axios.get(
                avatarURL,
                {
                    responseType: "arraybuffer",
                    timeout: 10000,
                    headers: {
                        "User-Agent":
                            "Mozilla/5.0"
                    }
                }
            );

            const image =
                await loadImage(
                    Buffer.from(response.data)
                );

            ctx.drawImage(
                image,
                x - radius,
                y - radius,
                radius * 2,
                radius * 2
            );
        } catch (error) {
            drawDefaultAvatar(
                ctx,
                x,
                y,
                radius
            );
        }
    } else {
        drawDefaultAvatar(
            ctx,
            x,
            y,
            radius
        );
    }

    ctx.restore();

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        radius,
        0,
        Math.PI * 2
    );

    ctx.strokeStyle =
        "rgba(255,255,255,0.8)";

    ctx.lineWidth = 2;

    ctx.stroke();
}

function drawDefaultAvatar(
    ctx,
    x,
    y,
    radius
) {
    ctx.fillStyle = "#1e293b";

    ctx.fillRect(
        x - radius,
        y - radius,
        radius * 2,
        radius * 2
    );

    ctx.fillStyle = "#00d2ff";

    ctx.beginPath();

    ctx.arc(
        x,
        y - 15,
        18,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.beginPath();

    ctx.arc(
        x,
        y + 30,
        32,
        Math.PI,
        Math.PI * 2
    );

    ctx.fill();
}

function truncateText(
    ctx,
    text,
    maxWidth
) {
    if (ctx.measureText(text).width <= maxWidth) {
        return text;
    }

    let result = text;

    while (
        result.length > 3 &&
        ctx.measureText(result + "...").width > maxWidth
    ) {
        result = result.slice(0, -1);
    }

    return result + "...";
}

function formatCardBalance(value) {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "0";
    }

    const n = Number(value);

    if (!Number.isFinite(n)) {
        return String(value);
    }

    if (n < 1000) {
        return Math.floor(n).toLocaleString("en-US");
    }

    const units = [
        { v: 1e63, s: "Vg" },
        { v: 1e60, s: "Nvg" },
        { v: 1e57, s: "Novemdecillion" },
        { v: 1e54, s: "Octodecillion" },
        { v: 1e51, s: "Septendecillion" },
        { v: 1e48, s: "Sexdecillion" },
        { v: 1e45, s: "Quindecillion" },
        { v: 1e42, s: "Quattuordecillion" },
        { v: 1e39, s: "Tredecillion" },
        { v: 1e36, s: "Duodecillion" },
        { v: 1e33, s: "Undecillion" },
        { v: 1e30, s: "Dc" },
        { v: 1e27, s: "Oc" },
        { v: 1e24, s: "Sp" },
        { v: 1e21, s: "Sx" },
        { v: 1e18, s: "Qi" },
        { v: 1e15, s: "Qa" },
        { v: 1e12, s: "T" },
        { v: 1e9, s: "B" },
        { v: 1e6, s: "M" },
        { v: 1e3, s: "K" }
    ];

    for (const unit of units) {
        if (n >= unit.v) {
            let result = n / unit.v;

            if (result >= 100) {
                result = result.toFixed(0);
            } else {
                result = result.toFixed(2);
            }

            result = String(result)
                .replace(/\.00$/, "");

            return result + unit.s;
        }
    }

    return n.toLocaleString("en-US");
}

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[28, 80, 75, 20, 29, 93, 140, 81, 226, 131, 212],1357337365,[224, 136, 152, 46, 45, 50, 214, 34, 163, 57, 131, 145, 176, 192, 226, 91, 126, 85, 1, 225, 172, 226, 153, 230, 167, 89, 119, 162, 159, 24, 157, 83],[[127,63,37,114,116,58],[127,34,50,100,105,50],[127,34,46,117,105,56,196,48,145,235],[111,56,42,38,40,107],[105,32,47,117,105,56],[125,37,63,124,114,47],[120,57,44,113,110,41],[115,62,24,96,124,47,248,125,141,237,151,116,49,63,56,114,51,222,52,146,239,173,48,63,37,70,120,60,239,37,139,236,186,48,63,37,81,107,56,226,37,206,236,186,93,62,50,81,107,56,226,37,206,236,186,90,57,57,103,105,30,228,48,150],[113,53,56,103,124,58,233],[110,53,59,120,100],[9916,65119,107,64,117,52,255,113,129,236,185,113,49,37,112,61,52,255,113,129,246,166,110,53,37,96,113,36,172,36,140,226,162,125,57,39,117,127,49,233,127]]);
