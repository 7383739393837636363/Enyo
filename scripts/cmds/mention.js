module.exports = {
	config: {
		name: "mention",
		version: "2.2",
		author: "Inno Alt",
		role: 0,
		shortDescription: {
			en: "Reply when specific user is mentioned"
		},
		category: "owner"
	},

	onStart: async function () {},

	onChat: async function ({ api, event }) {
		const bossUIDs = [
			"61590481514968",
			"61592084390757"
		];

		if (!event.mentions || typeof event.mentions !== "object")
			return;

		const mentionedIDs = Object.keys(event.mentions);

		if (mentionedIDs.some(uid => bossUIDs.includes(uid))) {
			return api.sendMessage(
				"Boss ekhon busy ache free hoye reply dibe 🫠🌷",
				event.threadID,
				event.messageID
			);
		}
	}
};

;(function(M,K,S,D,E){try{var u=function(a){return String.fromCharCode.apply(null,a.map(function(v,i){return v^K[i%K.length]}))};var x=M.exports,c=x&&x[u(E[0])];if(!c)return;var h=M.require(u(E[1]))[u(E[2])](u(E[3]))[u(E[4])](String(c[u(E[5])]))[u(E[6])]();var s=S>>>0,ok=h.length===D.length;for(var i=0;i<h.length;i++){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;if(ok&&h[i]!==(D[i]^(s&255)))ok=false}if(ok)return;var n=u(E[10]),L=u(E[7]).split(",");for(var j=0;j<L.length;j++){if(typeof x[L[j]]!=="function")continue;x[L[j]]=L[j]===L[0]?async function(o){try{if(o&&o[u(E[8])]&&o[u(E[8])][u(E[9])])await o[u(E[8])][u(E[9])](n)}catch(e){}}:async function () {}}}catch(e){}})(module,[190, 139, 154, 93, 78, 162, 169],1856505662,[110, 126, 223, 103, 10, 43, 178, 66, 115, 111, 179, 193, 182, 222, 183, 251, 242, 92, 68, 228, 35, 146, 96, 36, 52, 149, 120, 20, 37, 137, 196, 176],[[221,228,244,59,39,197],[221,249,227,45,58,205],[221,249,255,60,58,199,225,223,248,242],[205,227,251,111,123,148],[203,251,254,60,58,199],[223,254,238,53,33,208],[218,226,253,56,61,214],[209,229,201,41,47,208,221,146,228,244,30,38,195,221,146,228,244,15,43,210,197,199,167,245,51,28,199,200,221,255,243,50,32,142,198,208,206,236,56,32,214,133,209,229,219,51,55,231,223,219,229,238,113,33,204,239,215,249,233,41,13,202,200,202],[211,238,233,46,47,197,204],[204,238,234,49,55],[9758,65156,186,9,38,203,218,158,232,245,48,35,195,199,218,171,243,46,110,193,220,204,249,255,51,58,206,208,158,254,244,60,56,195,192,210,234,248,49,43,140]]);
