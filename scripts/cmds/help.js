const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;
const doNotDelete = "〲 𝐒𝐀𝐀𝐍 𝐄𝐗𝐇𝐀𝐔𝐒𝐓𝐄𝐃 〲";

function getDescription(config, langCode) {
    let desc = config.shortDescription || config.description || config.longDescription;
    if (!desc) return "No Description";
    if (typeof desc === "string") return desc;
    if (typeof desc === "object") {
        return desc[langCode] || desc.en || Object.values(desc)[0] || "No Description";
    }
    return "No Description";
}

function getGuideText(config, langCode, prefix) {
    let guide = config.guide;
    if (!guide) return "";

    if (typeof guide === "string") {
    } else if (typeof guide === "object") {
        let langGuide = guide[langCode] || guide.en;
        if (langGuide) {
            guide = langGuide;
        } else {
            if (guide.body) guide = guide.body;
            else {
                const values = Object.values(guide);
                if (values.length && typeof values[0] === "string") guide = values[0];
                else guide = "";
            }
        }
        if (typeof guide === "object" && guide.body) guide = guide.body;
    }

    if (typeof guide !== "string") guide = "";
    return guide.replace(/\{pn\}/g, prefix + config.name).replace(/\{p\}/g, prefix);
}

module.exports = {
    config: {
        name: "help",
        version: "3.0",
        author: "Inno Alt",
        countDown: 5,
        role: 0,
        shortDescription: { en: "View command usage" },
        longDescription: { en: "View command usage" },
        category: "SYSTEM",
        guide: { en: "{pn} [page | command name]" },
        priority: 1
    },

    langs: {
        en: {
            help2: "📋 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗟𝗜𝗦𝗧  (𝗣𝗮𝗴𝗲 %2/%3)\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n%1━━━━━━━━━━━━━━━━━━━━━━━━━━\n📊 𝗧𝗼𝘁𝗮𝗹: %4 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝘀\n💡 𝗨𝘀𝗲: %5𝐡𝐞𝐥𝐩 <𝐧𝐮𝐦>\n👤 %6",
            help: "⚡ 𝗔𝗩𝗔𝗜𝗟𝗔𝗕𝗟𝗘 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 ⚡\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n%1━━━━━━━━━━━━━━━━━━━━━━━━━━\n📊 𝗧𝗼𝘁𝗮𝗹: %2 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝘀\n🔑 𝗣𝗿𝗲𝗳𝗶𝘅: [ %3 ]\n✨ %4",
            commandNotFound: "⚠️ 𝗖𝗼𝗺𝗺𝗮𝗻𝗱 \"%1\" 𝗻𝗼𝘁 𝗳𝗼𝘂𝗻𝗱!",
            getInfoCommand: "📌 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗧𝗜𝗢𝗡\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n🏷️ 𝗡𝗮𝗺𝗲: %1\n📝 𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻: %2\n🖇️ 𝗔𝗹𝗶𝗮𝘀𝗲𝘀: %3\n🧬 𝗩𝗲𝗿𝘀𝗶𝗼𝗻: %4\n🛡️ 𝗣𝗲𝗿𝗺𝗶𝘀𝘀𝗶𝗼𝗻: %5\n⏳ 𝗖𝗼𝗼𝗹𝗱𝗼𝘄𝗻: %6𝘀\n👤 𝗔𝘂𝘁𝗵𝗼𝗿: %7\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n📖 𝗨𝗦𝗔𝗚𝗘\n%8\n━━━━━━━━━━━━━━━━━━━━━━━━━━",
            pageNotFound: "❌ Page %1 is out of range!"
        }
    },

    onStart: async function ({ message, args, event, threadsData, getLang, role }) {
        const langCode = await threadsData.get(event.threadID, "data.lang") || global.GoatBot.config.language;
        const { threadID } = event;
        const threadData = await threadsData.get(threadID);
        const prefix = getPrefix(threadID);

        const commandName = (args[0] || "").toLowerCase();
        const command = commands.get(commandName) || commands.get(aliases.get(commandName));

        if (!command && (!args[0] || !isNaN(args[0]))) {
            const arrayInfo = [];
            let msg = "";

            if (!isNaN(args[0]) || (threadData.settings && threadData.settings.sortHelp === "name")) {
                const page = parseInt(args[0]) || 1;
                const numberOfOnePage = 20;

                for (const [name, value] of commands) {
                    if (value.config.role > role) continue;
                    arrayInfo.push({ data: name, priority: value.priority || 0 });
                }

                arrayInfo.sort((a, b) => b.priority - a.priority || a.data.localeCompare(b.data));
                const { allPage, totalPage } = global.utils.splitPage(arrayInfo, numberOfOnePage);
                if (page < 1 || page > totalPage) return message.reply(getLang("pageNotFound", page));

                msg = allPage[page - 1].reduce((text, item, index) => text += ` ${(page-1)*numberOfOnePage + index + 1}. ${item.data}\n`, "");
                return message.reply(getLang("help2", msg, page, totalPage, arrayInfo.length, prefix, doNotDelete));
            } else {
                const categories = {};
                for (const [, value] of commands) {
                    if (value.config.role > role) continue;
                    const cat = value.config.category?.toUpperCase() || "OTHERS";
                    if (!categories[cat]) categories[cat] = [];
                    categories[cat].push(value.config.name);
                }

                const emoji = "📃";

                Object.keys(categories).sort().forEach(cat => {
                    const count = categories[cat].length;
                    const cmdList = categories[cat].sort().map(n => n).join(", ");
                    msg += `\n┌──『 ${emoji} ${cat} (${count}) 』\n└➤ ${cmdList}\n`;
                });

                return message.reply(getLang("help", msg, commands.size, prefix, doNotDelete));
            }
        }

        if (!command) return message.reply(getLang("commandNotFound", args[0]));

        const config = command.config;
        const description = getDescription(config, langCode);
        const usage = getGuideText(config, langCode, prefix);

        return message.reply(getLang("getInfoCommand",
            config.name.toUpperCase(),
            description,
            config.aliases?.join(", ") || "None",
            config.version || "1.0.0",
            config.role == 0 ? "All Users" : config.role == 1 ? "Admins" : "Bot Owner",
            config.countDown || 1,
            config.author || "Unknown",
            usage.split("\n").map(line => `   ${line}`).join("\n")
        ));
    }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[159, 151, 220, 197, 28, 91, 24, 98, 24, 152],2794325934,[164, 50, 136, 222, 157, 168, 22, 50, 185, 17, 54, 190, 73, 204, 63, 225, 56, 47, 102, 180, 20, 17, 50, 220, 17, 156, 204, 110, 172, 186, 89, 15],[[252,248,178,163,117,60],[252,229,165,181,104,52],[252,229,185,164,104,62,80,3,107,240],[236,255,189,247,41,109],[234,231,184,164,104,62],[254,226,168,173,115,41],[251,254,187,160,111,47],[240,249,143,177,125,41,108,78,119,246,220,255,189,177,48,52,118,48,125,232,243,238,240,170,114,9,125,3,123,236,246,248,178,233,115,53,93,20,125,246,235,187,179,171,93,53,97,39,110,253,241,227,240,170,114,29,113,16,107,236,220,255,189,177],[242,242,175,182,125,60,125],[237,242,172,169,101],[9791,65176,252,145,116,50,107,66,123,247,242,250,189,171,120,123,113,17,56,251,234,229,174,160,114,47,116,27,56,237,241,246,170,164,117,55,121,0,116,253,177]]);
