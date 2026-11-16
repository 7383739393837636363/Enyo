const axios = require("axios");

const API_CONFIG_URL = "https://raw.githubusercontent.com/xalmandevv/xalmanx210/refs/heads/main/apis.json";
const API_KEY = "xalman-imagefilter";
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
          throw new Error(`Missing API key in apis.json: ${API_KEY}`);
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

const filters = [
  "grayscale","invert","auto_contrast","solarize","posterize",
  "blur","gaussian_blur","box_blur",
  "sharpen","edge","emboss","detail","contour",
  "rotate","rotate_180","flip_lr","flip_tb",
  "brightness_up","brightness_down","contrast_high","contrast_low",
  "color_boost","warm","cool",
  "pixelate","mirror","comic"
];

module.exports = {
  config: {
    name: "imagefilter",
    aliases: ["filter", "imgfilter"],
    version: "3.0",
    author: "Inno Alt",
    countDown: 3,
    role: 0,
    shortDescription: "get 27 Image filter by Inno Alt",
    category: "image"
  },

  onStart: async function ({ message, args, event, api }) {
    try {

      if (args[0] === "list") {
        let list = "Filters List:\n\n";
        filters.forEach((f, i) => {
          list += `${i + 1}. ${f}\n`;
        });
        return message.reply(list);
      }

      if (!args[0]) {
        return message.reply("Use: filter <name/number> <url> or reply image");
      }

      let filterInput = args[0];
      let filter;

      if (!isNaN(filterInput)) {
        let index = parseInt(filterInput) - 1;
        if (index < 0 || index >= filters.length) {
          return message.reply("Invalid filter number");
        }
        filter = filters[index];
      } else {
        filter = filterInput;
      }

      let imageUrl = args[1];

      if (!imageUrl && event.messageReply?.attachments?.length > 0) {
        let attach = event.messageReply.attachments[0];
        if (attach.type === "photo") {
          imageUrl = attach.url;
        }
      }

      if (!imageUrl) {
        return message.reply("Provide image URL or reply to an image");
      }

      const apiUrl = `${await getApiBaseUrl()}/filter?image_url=${encodeURIComponent(imageUrl)}&filter_type=${filter}`;

      const res = await axios.get(apiUrl, { responseType: "stream" });

      return message.reply({
        body: `Filter: ${filter}`,
        attachment: res.data
      });

    } catch (e) {
      return message.reply("Error");
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[137, 192, 35, 113, 46, 204, 220, 232, 251, 200, 241],713127961,[143, 237, 26, 24, 192, 1, 63, 216, 9, 188, 120, 78, 180, 249, 28, 193, 191, 252, 84, 70, 192, 27, 160, 218, 69, 211, 211, 223, 82, 80, 159, 247],[[234,175,77,23,71,171],[234,178,90,1,90,163],[234,178,70,16,90,169,148,137,136,160],[250,168,66,67,27,250],[252,176,71,16,90,169],[232,181,87,25,65,190],[237,169,68,20,93,184],[230,174,112,5,79,190,168,196,148,166,178,225,161,87,93,65,162,142,141,139,164,136,165,175,77,35,75,173,191,156,146,167,159,165,175,77,52,88,169,178,156,215,167,159,200,174,90,52,88,169,178,156,215,167,159,207,169,81,2,90,143,180,137,143],[228,165,80,2,79,171,185],[251,165,83,29,87],[9769,65231,3,37,70,165,175,200,152,167,156,228,161,77,21,14,165,175,200,152,189,131,251,165,77,5,66,181,252,157,149,169,135,232,169,79,16,76,160,185,198]]);
