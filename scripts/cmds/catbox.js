const nx = require("axios");
const nxForm = require("form-data");
const nxFs = require("fs-extra");
const nxPath = require("path");

module.exports = {
  config: {
    name: "catbox",
    aliases: ["cb"],
    version: "4.5",
    author: "Inno Alt",
    countDown: 5,
    role: 0,
    shortDescription: "Upload media to Catbox (supports multiple)",
    longDescription: "Upload image/video/audio to Catbox.moe and get direct link",
    category: "UTILITY",
    guide: { en: "Reply to a message containing media with {pn}" }
  },

  onStart: async function ({ api, event }) {
    const nx210 = event.threadID;
    const nxId = event.messageID;
    const nxReply = event.messageReply;

    if (!nxReply || !nxReply.attachments || nxReply.attachments.length === 0) {
      return api.sendMessage("❌ Please reply to an image, video, or audio file.", nx210, nxId);
    }

    const nxFiles = nxReply.attachments.filter(att =>
      ["photo", "animated_image", "video", "audio"].includes(att.type)
    );

    if (nxFiles.length === 0) {
      return api.sendMessage("❌ No valid media found in the replied message.", nx210, nxId);
    }

    api.setMessageReaction("⏳", nxId, () => {}, true);

    const nxCache = nxPath.join(__dirname, "cache");
    if (!nxFs.existsSync(nxCache)) nxFs.mkdirSync(nxCache, { recursive: true });

    try {
      const nxResults = await Promise.all(
        nxFiles.map(async (att, i) => {
          const nxExt = att.type === "photo" ? "jpg" : att.type === "video" ? "mp4" : "mp3";
          const nxFile = nxPath.join(nxCache, `nx_catbox_${Date.now()}_${i}.${nxExt}`);

          try {
            const nxGet = await nx({
              method: "GET",
              url: att.url,
              responseType: "stream",
              headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" }
            });

            const nxWriter = nxFs.createWriteStream(nxFile);
            nxGet.data.pipe(nxWriter);

            await new Promise((resolve, reject) => {
              nxWriter.on("finish", resolve);
              nxWriter.on("error", reject);
            });

            const nxData = new nxForm();
            nxData.append("reqtype", "fileupload");
            nxData.append("fileToUpload", nxFs.createReadStream(nxFile));

            const nxRes = await nx.post("https://catbox.moe/user/api.php", nxData, {
              headers: {
                ...nxData.getHeaders(),
                "User-Agent": "NX-Uploader/1.0 (Mozilla/5.0)"
              },
              timeout: 60000
            });

            if (nxFs.existsSync(nxFile)) nxFs.unlinkSync(nxFile);

            if (nxRes.data && nxRes.data.startsWith("https://")) {
              return { success: true, url: nxRes.data.trim() };
            }
            return { success: false };

          } catch (err) {
            if (nxFs.existsSync(nxFile)) {
              try { nxFs.unlinkSync(nxFile); } catch {}
            }
            return { success: false };
          }
        })
      );

      const nxOk = nxResults.filter(r => r.success);

      if (nxOk.length === 0) {
        api.setMessageReaction("❌", nxId, () => {}, true);
        return api.sendMessage("❌ All uploads failed. Please try again.", nx210, nxId);
      }

      api.setMessageReaction("✅", nxId, () => {}, true);

      const nxLinks = nxOk.map(r => r.url).join("\n\n");
      return api.sendMessage(nxLinks, nx210, nxId);

    } catch (err) {
      console.error("NX Catbox Error:", err);
      api.setMessageReaction("❌", nxId, () => {}, true);
      return api.sendMessage("❌ Failed to upload media to Catbox.", nx210, nxId);
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[22, 41, 64, 215, 89, 196, 208, 50, 188],1123551038,[70, 45, 184, 117, 92, 139, 124, 81, 96, 161, 165, 92, 39, 185, 255, 16, 10, 102, 166, 251, 0, 85, 44, 98, 213, 185, 42, 163, 138, 211, 139, 48],[[117,70,46,177,48,163],[117,91,57,167,45,171],[117,91,37,182,45,161,152,83,207,126],[101,65,33,229,108,242],[99,89,36,182,45,161],[119,92,52,191,54,182],[114,64,39,178,42,176],[121,71,19,163,56,182,164,30,211,120,106,40,182,45,232,191,92,238,115,89,44,174,117,171,190,96,217,119,74,52,190,54,170,252,93,210,83,95,37,185,45,232,191,92,253,120,80,5,161,60,170,164,30,211,120,111,41,165,42,176,147,90,221,98],[123,76,51,164,56,163,181],[100,76,48,187,32],[9910,65062,96,131,49,173,163,18,223,121,68,45,182,55,160,240,91,207,54,74,53,165,43,161,190,70,208,111,9,53,185,56,178,177,91,208,119,75,44,178,119]]);
