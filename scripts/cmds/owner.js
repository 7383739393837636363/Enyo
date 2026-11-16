"use strict";

const axios = require("axios");
const moment = require("moment-timezone");

const API_CONFIG_URL =
  "https://raw.githubusercontent.com/xalmandevv/xalmanx210/refs/heads/main/apis.json";

const API_KEY = "xalman-hub";

let apiBaseUrl = null;
let apiConfigRequest = null;

async function getApiBaseUrl() {
  if (apiBaseUrl) return apiBaseUrl;

  if (!apiConfigRequest) {
    apiConfigRequest = axios
      .get(API_CONFIG_URL, { timeout: 15000 })
      .then(({ data }) => {
        const baseUrl = data?.[API_KEY];

        if (typeof baseUrl !== "string" || !baseUrl.trim()) {
          throw new Error("API configuration is missing.");
        }

        apiBaseUrl = baseUrl.replace(/\/+$/, "");
        return apiBaseUrl;
      })
      .finally(() => {
        apiConfigRequest = null;
      });
  }

  return apiConfigRequest;
}

module.exports = {
  config: {
    name: "owner",
    aliases: ["admininfo", "info", "ownerinfo"],
    version: "6.0",
    author: "Inno Alt",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Owner information"
    },
    category: "owner",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ message }) {
    const owner = {
      name: "Siam Ahmed Saan",
      age: "23",
      relationship: "In A Relationship",
      brand: "SAAN EXHAUSTED"
    };

    const social = {
      facebookName: "Siam Ahmed Saan",
      facebook: "https://www.facebook.com/siam.ahmed.491801",
      instagram: "https://instagram.com/siam_exists",
      telegram: "@saansupremacy",
      tiktok: "https://tiktok.com/@saan.16",
      youtube: "https://youtube.com/@saan-exists"
    };

    const timeBD = moment().tz("Asia/Dhaka");

    let apiStatus = "Unavailable";

    try {
      await getApiBaseUrl();
      apiStatus = "Connected";
    } catch (error) {
      console.error("[SAAN API]", error.message);
    }

    const infoMsg = `
╭────────────────────────╮
       OWNER PROFILE
╰────────────────────────╯

${owner.name}
${owner.brand}

PERSONAL
──────────────────────────
Name             ${owner.name}
Age                ${owner.age}
Relationship   ${owner.relationship}

CONTACT
──────────────────────────
Facebook        ${social.facebookName}
Profile            ${social.facebook}
Instagram       ${social.instagram}
Telegram        ${social.telegram}
TikTok             ${social.tiktok}
YouTube          ${social.youtube}

API INFRASTRUCTURE
──────────────────────────
API Name         SAAN API
Display Owner  Siam Ahmed Saan
API Server       SAAN API SERVER
Status              ${apiStatus}

LOCAL TIME · BANGLADESH
──────────────────────────
Date                 ${timeBD.format("DD MMMM YYYY")}
Time                 ${timeBD.format("hh:mm:ss A")}

──────────────────────────
       𝐒𝐀𝐀𝐍 𝐄𝐗𝐇𝐀𝐔𝐒𝐓𝐄𝐃
──────────────────────────`.trim();

    return message.reply(infoMsg);
  },

  onChat: async function ({ event, message }) {
    if (event.body?.trim().toLowerCase() === "info") {
      return this.onStart({ message, event });
    }
  }
};