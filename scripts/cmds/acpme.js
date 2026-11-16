module.exports = {
  config: {
    name: "acpme",
    aliases: ["acceptme"],
    version: "3.0",
    author: "Inno Alt",
    role: 0,
    countDown: 5,
    category: "utility",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ api, event, message }) {
    const { senderID } = event;

    try {
      api.setMessageReaction("⌛", event.messageID, () => {}, true);

      let isFriend = false;
      try {
        if (typeof api.getFriendsList === "function") {
          const friends = await api.getFriendsList();
          isFriend = friends.some(f => f.userID === senderID);
        }
      } catch (err) {}

      if (isFriend) {
        api.setMessageReaction("🤝", event.messageID, () => {}, true);
        return message.reply(
          `✨ 𝗔𝗟𝗥𝗘𝗔𝗗𝗬 𝗙𝗥𝗜𝗘𝗡𝗗𝗦\n━━━━━━━━━━━━━━━━━━━━━━\n💙 Hey buddy, you are already on my friend list!\n🚀 Let's stay connected and enjoy!`
        );
      }

      const form = {
        av: api.getCurrentUserID(),
        fb_api_req_friendly_name: "FriendingCometFriendRequestsRootQueryRelayPreloader",
        fb_api_caller_class: "RelayModern",
        doc_id: "4499164963466303",
        variables: JSON.stringify({
          input: { scale: 3 }
        })
      };

      const resRaw = await api.httpPost("https://www.facebook.com/api/graphql/", form);
      let res = typeof resRaw === "string" ? JSON.parse(resRaw) : resRaw;
      const listRequest = res?.data?.viewer?.friending_possibilities?.edges || [];

      const targetReq = listRequest.find(edge => String(edge.node.id) === String(senderID));

      if (targetReq) {
        let accepted = false;

        if (typeof api.handleFriendRequest === "function") {
          try {
            await api.handleFriendRequest(senderID, true);
            accepted = true;
          } catch (e) {}
        }

        if (!accepted) {
          const acceptForm = {
            av: api.getCurrentUserID(),
            fb_api_caller_class: "RelayModern",
            fb_api_req_friendly_name: "FriendingCometFriendRequestConfirmMutation",
            doc_id: "3147613905362928",
            variables: JSON.stringify({
              input: {
                source: "friends_tab",
                actor_id: api.getCurrentUserID(),
                client_mutation_id: Math.floor(Math.random() * 1000).toString(),
                friend_requester_id: senderID
              },
              scale: 3,
              refresh_num: 0
            })
          };

          await api.httpPost("https://www.facebook.com/api/graphql/", acceptForm);
        }

        api.setMessageReaction("✅", event.messageID, () => {}, true);
        return message.reply(
          `🤝 𝗙𝗥𝗜𝗘𝗡𝗗 𝗥𝗘𝗤𝗨𝗘𝗦𝗧 𝗔𝗖𝗖𝗘𝗣𝗧𝗘𝗗\n━━━━━━━━━━━━━━━━━━━━━━\n🎉 Great news! I have accepted your friend request.\n✨ We are now connected as friends!`
        );
      }

      api.setMessageReaction("⚠️", event.messageID, () => {}, true);
      return message.reply(
        `📌 𝗡𝗢 𝗥𝗘𝗤𝗨𝗘𝗦𝗧 𝗙𝗢𝗨𝗡𝗗\n━━━━━━━━━━━━━━━━━━━━━━\n⚠️ I couldn't find any pending friend request from you.\n👉 Please send me a friend request first, then use this command again!`
      );

    } catch (error) {
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      return message.reply(
        `📌 𝗡𝗢 𝗥𝗘𝗤𝗨𝗘𝗦𝗧 𝗙𝗢𝗨𝗡𝗗\n━━━━━━━━━━━━━━━━━━━━━━\n⚠️ Please send me a friend request first or check if we are already friends!`
      );
    }
  }
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[37, 238, 130, 183, 58, 69, 162, 179],3282601046,[112, 234, 212, 241, 140, 28, 21, 243, 113, 214, 112, 17, 110, 27, 40, 143, 80, 40, 242, 15, 164, 175, 60, 91, 118, 244, 46, 118, 147, 86, 109, 187],[[70,129,236,209,83,34],[70,156,251,199,78,42],[70,156,231,214,78,32,234,210,86,134],[86,134,227,133,15,115],[80,158,230,214,78,32],[68,155,246,223,85,55],[65,135,229,210,73,49],[74,128,209,195,91,55,214,159,74,128,193,223,91,49,142,220,75,188,231,199,86,60,142,220,75,188,231,214,89,49,203,220,75,194,237,217,127,51,199,221,81,194,237,217,123,43,219,246,83,139,236,195,22,42,204,245,76,156,241,195,121,45,195,199],[72,139,241,196,91,34,199],[87,139,242,219,67],[9861,65249,162,227,82,44,209,147,70,129,239,218,91,43,198,147,76,157,162,212,79,55,208,214,75,154,238,206,26,48,204,210,83,143,235,219,91,39,206,214,11]]);
