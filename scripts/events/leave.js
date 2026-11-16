const { getTime, drive } = global.utils;
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage, registerFont } = require("canvas");

(function registerCardFonts() {
	const dir = path.join(__dirname, "..", "cmds", "assets", "font");
	const fonts = [
		{ file: "NotoSans-Bold.ttf", weight: "bold" },
		{ file: "NotoSans-Regular.ttf", weight: "normal" }
	];
	for (const { file, weight } of fonts) {
		try {
			const fontPath = path.join(dir, file);
			if (fs.existsSync(fontPath))
				registerFont(fontPath, { family: "LeaveNoto", weight });
		}
		catch (e) { }
	}
})();

const FONT = '"LeaveNoto", "Noto Sans", "Segoe UI", Arial, sans-serif';

const THEMES = {
	left: { a: "#38bdf8", b: "#a855ff", c: "#ff2bd6" },
	kicked: { a: "#ff3b4e", b: "#ff9f1c", c: "#ff2bd6" }
};

function rgba(hex, alpha) {
	const h = hex.replace("#", "");
	const r = parseInt(h.slice(0, 2), 16);
	const g = parseInt(h.slice(2, 4), 16);
	const b = parseInt(h.slice(4, 6), 16);
	return `rgba(${r},${g},${b},${alpha})`;
}

function setFont(ctx, size, weight = "bold") {
	ctx.font = `${weight} ${size}px ${FONT}`;
}

function fitText(ctx, text, maxWidth, size, weight = "bold", minSize = 16) {
	let s = size;
	setFont(ctx, s, weight);
	while (ctx.measureText(text).width > maxWidth && s > minSize) {
		s -= 1;
		setFont(ctx, s, weight);
	}
	if (ctx.measureText(text).width > maxWidth) {
		let t = text;
		while (t.length > 1 && ctx.measureText(t + "...").width > maxWidth) t = t.slice(0, -1);
		return t + "...";
	}
	return text;
}

function roundRectPath(ctx, x, y, w, h, r) {
	ctx.beginPath();
	ctx.moveTo(x + r, y);
	ctx.arcTo(x + w, y, x + w, y + h, r);
	ctx.arcTo(x + w, y + h, x, y + h, r);
	ctx.arcTo(x, y + h, x, y, r);
	ctx.arcTo(x, y, x + w, y, r);
	ctx.closePath();
}

function glowStroke(ctx, color, width, blur) {
	ctx.save();
	ctx.shadowColor = color;
	ctx.shadowBlur = blur;
	ctx.strokeStyle = color;
	ctx.lineWidth = width;
	ctx.stroke();
	ctx.stroke();
	ctx.restore();
}

function neonText(ctx, text, x, y, color, blur = 25, core = "#ffffff") {
	ctx.save();
	ctx.shadowColor = color;
	ctx.shadowBlur = blur;
	ctx.fillStyle = color;
	ctx.fillText(text, x, y);
	ctx.fillText(text, x, y);
	ctx.shadowBlur = 0;
	ctx.fillStyle = core;
	ctx.fillText(text, x, y);
	ctx.restore();
}

async function fetchImage(url) {
	if (!url) return null;
	try {
		const res = await axios.get(url, {
			responseType: "arraybuffer",
			headers: { "User-Agent": "Mozilla/5.0" },
			timeout: 15000
		});
		return await loadImage(Buffer.from(res.data));
	}
	catch (e) {
		return null;
	}
}

function drawBackground(ctx, w, h, t) {
	const g = ctx.createLinearGradient(0, 0, w, h);
	g.addColorStop(0, "#06060f");
	g.addColorStop(0.5, "#0c0a1f");
	g.addColorStop(1, "#04040a");
	ctx.fillStyle = g;
	ctx.fillRect(0, 0, w, h);

	const glow = (x, y, r, color) => {
		const rg = ctx.createRadialGradient(x, y, 0, x, y, r);
		rg.addColorStop(0, rgba(color, 0.32));
		rg.addColorStop(1, rgba(color, 0));
		ctx.fillStyle = rg;
		ctx.fillRect(0, 0, w, h);
	};
	glow(0, 0, 750, t.a);
	glow(w, h, 850, t.b);
	glow(w, 0, 550, t.b);
	glow(0, h, 550, t.a);

	ctx.strokeStyle = rgba(t.a, 0.05);
	ctx.lineWidth = 1;
	for (let x = 0; x < w; x += 50) {
		ctx.beginPath();
		ctx.moveTo(x, 0);
		ctx.lineTo(x, h);
		ctx.stroke();
	}
	for (let y = 0; y < h; y += 50) {
		ctx.beginPath();
		ctx.moveTo(0, y);
		ctx.lineTo(w, y);
		ctx.stroke();
	}

	for (let i = 0; i < 110; i++) {
		const x = Math.random() * w;
		const y = Math.random() * h;
		const r = Math.random() * 2 + 0.5;
		ctx.fillStyle = rgba(Math.random() > 0.5 ? t.a : t.b, Math.random() * 0.5 + 0.1);
		ctx.beginPath();
		ctx.arc(x, y, r, 0, Math.PI * 2);
		ctx.fill();
	}
}

function drawFrame(ctx, w, h, t) {
	roundRectPath(ctx, 30, 30, w - 60, h - 60, 24);
	glowStroke(ctx, t.a, 4, 30);

	roundRectPath(ctx, 48, 48, w - 96, h - 96, 16);
	ctx.strokeStyle = rgba(t.b, 0.45);
	ctx.lineWidth = 2;
	ctx.stroke();

	const o = 66;
	const L = 80;
	const corners = [[o, o, 1, 1], [w - o, o, -1, 1], [o, h - o, 1, -1], [w - o, h - o, -1, -1]];
	for (const [cx, cy, dx, dy] of corners) {
		ctx.beginPath();
		ctx.moveTo(cx, cy + dy * L);
		ctx.lineTo(cx, cy);
		ctx.lineTo(cx + dx * L, cy);
		glowStroke(ctx, t.b, 5, 25);
	}
}

function drawDivider(ctx, x1, x2, y, t) {
	const g = ctx.createLinearGradient(x1, 0, x2, 0);
	g.addColorStop(0, rgba(t.a, 0));
	g.addColorStop(0.25, t.a);
	g.addColorStop(0.75, t.b);
	g.addColorStop(1, rgba(t.b, 0));
	ctx.save();
	ctx.strokeStyle = g;
	ctx.lineWidth = 3;
	ctx.shadowColor = t.a;
	ctx.shadowBlur = 15;
	ctx.beginPath();
	ctx.moveTo(x1, y);
	ctx.lineTo(x2, y);
	ctx.stroke();

	const cx = (x1 + x2) / 2;
	ctx.fillStyle = "#ffffff";
	ctx.shadowColor = t.b;
	ctx.shadowBlur = 20;
	ctx.beginPath();
	ctx.moveTo(cx, y - 9);
	ctx.lineTo(cx + 9, y);
	ctx.lineTo(cx, y + 9);
	ctx.lineTo(cx - 9, y);
	ctx.closePath();
	ctx.fill();
	ctx.restore();
}

function drawCover(ctx, img, x, y, r) {
	const s = Math.max((2 * r) / img.width, (2 * r) / img.height);
	const iw = img.width * s;
	const ih = img.height * s;
	ctx.drawImage(img, x - iw / 2, y - ih / 2, iw, ih);
}

function drawAvatar(ctx, img, x, y, r, t, tint) {
	ctx.save();
	ctx.beginPath();
	ctx.arc(x, y, r + 28, 0, Math.PI * 2);
	glowStroke(ctx, t.b, 3, 25);
	ctx.beginPath();
	ctx.arc(x, y, r + 13, 0, Math.PI * 2);
	glowStroke(ctx, t.a, 6, 35);
	ctx.restore();

	ctx.save();
	ctx.beginPath();
	ctx.arc(x, y, r, 0, Math.PI * 2);
	ctx.clip();
	if (img) {
		drawCover(ctx, img, x, y, r);
	}
	else {
		const rg = ctx.createRadialGradient(x, y, 0, x, y, r);
		rg.addColorStop(0, rgba(t.a, 0.6));
		rg.addColorStop(1, "#0a0a18");
		ctx.fillStyle = rg;
		ctx.fillRect(x - r, y - r, r * 2, r * 2);
	}
	ctx.fillStyle = rgba(tint, 0.3);
	ctx.fillRect(x - r, y - r, r * 2, r * 2);
	ctx.restore();

	ctx.beginPath();
	ctx.arc(x, y, r, 0, Math.PI * 2);
	ctx.strokeStyle = "#ffffff";
	ctx.lineWidth = 4;
	ctx.stroke();
}

function drawBadge(ctx, x, y, r, color, kind) {
	ctx.save();
	ctx.beginPath();
	ctx.arc(x, y, r, 0, Math.PI * 2);
	ctx.fillStyle = "rgba(10,10,26,0.95)";
	ctx.fill();
	glowStroke(ctx, color, 4, 18);
	ctx.restore();

	ctx.save();
	ctx.strokeStyle = "#ffffff";
	ctx.lineWidth = 5;
	ctx.lineCap = "round";
	ctx.lineJoin = "round";
	ctx.shadowColor = color;
	ctx.shadowBlur = 12;
	const k = r * 0.42;
	ctx.beginPath();
	if (kind === "kick") {
		ctx.moveTo(x - k, y - k);
		ctx.lineTo(x + k, y + k);
		ctx.moveTo(x + k, y - k);
		ctx.lineTo(x - k, y + k);
	}
	else {
		ctx.moveTo(x - k * 1.1, y);
		ctx.lineTo(x + k * 1.1, y);
		ctx.moveTo(x + k * 0.1, y - k);
		ctx.lineTo(x + k * 1.1, y);
		ctx.lineTo(x + k * 0.1, y + k);
	}
	ctx.stroke();
	ctx.restore();
}

function drawMiniAvatar(ctx, img, x, y, r, color) {
	ctx.save();
	ctx.beginPath();
	ctx.arc(x, y, r, 0, Math.PI * 2);
	ctx.clip();
	if (img) {
		drawCover(ctx, img, x, y, r);
	}
	else {
		ctx.fillStyle = rgba(color, 0.4);
		ctx.fillRect(x - r, y - r, r * 2, r * 2);
	}
	ctx.restore();

	ctx.beginPath();
	ctx.arc(x, y, r, 0, Math.PI * 2);
	ctx.strokeStyle = "#ffffff";
	ctx.lineWidth = 3;
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(x, y, r + 6, 0, Math.PI * 2);
	glowStroke(ctx, color, 3, 14);
}

function drawInfoBox(ctx, x, y, w, h, label, value, color, avatar) {
	ctx.save();
	roundRectPath(ctx, x, y, w, h, 14);
	ctx.fillStyle = "rgba(12,12,28,0.85)";
	ctx.fill();
	glowStroke(ctx, color, 2.5, 14);

	roundRectPath(ctx, x + 14, y + 18, 6, h - 36, 3);
	ctx.shadowColor = color;
	ctx.shadowBlur = 15;
	ctx.fillStyle = color;
	ctx.fill();
	ctx.restore();

	ctx.textAlign = "left";
	ctx.textBaseline = "alphabetic";
	setFont(ctx, 18);
	ctx.fillStyle = rgba("#ffffff", 0.55);
	ctx.fillText(label, x + 38, y + 32);

	let maxW = w - 38 - 24;
	if (avatar) maxW -= 80;
	const text = fitText(ctx, value, maxW, 32);
	ctx.fillStyle = "#ffffff";
	ctx.fillText(text, x + 38, y + h - 20);

	if (avatar) drawMiniAvatar(ctx, avatar.img, x + w - 58, y + h / 2, 30, color);
}

function drawBanner(ctx, cx, cy, text, color, maxW) {
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	const fitted = fitText(ctx, text, maxW - 90, 32);
	const tw = ctx.measureText(fitted).width;
	const w = tw + 90;
	const h = 58;
	ctx.save();
	roundRectPath(ctx, cx - w / 2, cy - h / 2, w, h, h / 2);
	ctx.fillStyle = "rgba(10,10,26,0.9)";
	ctx.fill();
	glowStroke(ctx, color, 3, 20);
	ctx.restore();
	neonText(ctx, fitted, cx, cy + 2, color, 15);
}

async function createLeaveCard(d) {
	const W = 1600;
	const H = 900;
	const t = d.kicked ? THEMES.kicked : THEMES.left;
	const canvas = createCanvas(W, H);
	const ctx = canvas.getContext("2d");

	drawBackground(ctx, W, H, t);
	drawFrame(ctx, W, H, t);

	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	setFont(ctx, 100);
	neonText(ctx, d.kicked ? "REMOVED" : "GOODBYE", W / 2, 120, t.a, 45);
	const sub = fitText(ctx, "FROM  " + d.groupName.toUpperCase(), 1100, 42);
	neonText(ctx, sub, W / 2, 190, t.b, 28);
	drawDivider(ctx, 160, W - 160, 236, t);

	drawAvatar(ctx, d.userImg, W / 2, 430, 125, t, d.kicked ? "#ff1f35" : "#06060f");
	drawBadge(ctx, W / 2 + 106, 430 + 106, 32, d.kicked ? t.a : t.b, d.kicked ? "kick" : "leave");

	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	const uName = fitText(ctx, d.userName, 700, 50);
	neonText(ctx, uName, W / 2, 630, t.b, 20);
	drawBanner(ctx, W / 2, 705, d.kicked ? "REMOVED FROM THE GROUP" : "WE WILL MISS YOU", t.a, 700);

	drawInfoBox(ctx, 110, 320, 470, 100, "REMAINING MEMBERS", String(d.memberCount), t.a);
	drawInfoBox(ctx, 110, 435, 470, 100, "DATE", d.dateStr, t.b);
	drawInfoBox(ctx, 1020, 320, 470, 100, "STATUS", d.kicked ? "KICKED OUT" : "LEFT THE GROUP", t.c);
	if (d.kicked)
		drawInfoBox(ctx, 1020, 435, 470, 100, "REMOVED BY", d.byName, t.a, { img: d.byImg });
	else
		drawInfoBox(ctx, 1020, 435, 470, 100, "TIME", d.timeStr, t.a);

	drawDivider(ctx, 160, W - 160, 780, t);
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	setFont(ctx, 22, "normal");
	ctx.fillStyle = rgba("#ffffff", 0.55);
	ctx.fillText("Created By Saan", W / 2, 822);

	return canvas.toBuffer("image/png");
}

async function getGroupData(api, threadID, threadData, leftID) {
	try {
		const info = await api.getThreadInfo(threadID);
		if (info && Array.isArray(info.participantIDs)) {
			return {
				name: info.threadName || info.name || null,
				memberCount: info.participantIDs.filter(id => String(id) !== String(leftID)).length
			};
		}
	}
	catch (e) { }

	const members = threadData && threadData.members;
	let memberCount = 0;
	if (members) {
		const list = Array.isArray(members) ? members : Object.values(members);
		memberCount = list.filter(m => m && m.inGroup !== false && String(m.userID) !== String(leftID)).length;
	}
	return { name: null, memberCount };
}

async function saveCard(buffer) {
	const dir = path.join(__dirname, "..", "cache");
	await fs.ensureDir(dir);
	const filePath = path.join(dir, `leave_${Date.now()}.png`);
	await fs.writeFile(filePath, buffer);
	setTimeout(() => fs.remove(filePath).catch(() => { }), 15000);
	return filePath;
}

module.exports = {
	config: {
		name: "leave",
		version: "2.0",
		author: "NTKhang|| modified by Inno Alt",
		category: "events"
	},

	langs: {
		en: {
			session1: "morning",
			session2: "noon",
			session3: "afternoon",
			session4: "evening",
			leaveType1: "left",
			leaveType2: "was kicked from",
			defaultLeaveMessage: "{userName} {type} the group"
		}
	},

	onStart: async ({ threadsData, message, event, api, usersData, getLang }) => {
		if (event.logMessageType == "log:unsubscribe")
			return async function () {
				const { threadID } = event;
				const threadData = await threadsData.get(threadID);
				if (!threadData.settings.sendLeaveMessage)
					return;
				const { leftParticipantFbId } = event.logMessageData;
				if (leftParticipantFbId == api.getCurrentUserID())
					return;

				const hours = getTime("HH");
				const userName = await usersData.getName(leftParticipantFbId);
				const isKicked = leftParticipantFbId != event.author;
				const group = await getGroupData(api, threadID, threadData, leftParticipantFbId);
				const threadName = threadData.threadName || group.name || "group";

				const hasCustomMessage = Boolean(threadData.data.leaveMessage);
				let { leaveMessage = getLang("defaultLeaveMessage") } = threadData.data;

				const form = {
					body: "",
					mentions: leaveMessage.includes("{userNameTag}") ? [{
						tag: userName,
						id: leftParticipantFbId
					}] : []
				};

				leaveMessage = leaveMessage
					.replace(/\{userName\}|\{userNameTag\}/g, userName)
					.replace(/\{type\}/g, isKicked ? getLang("leaveType2") : getLang("leaveType1"))
					.replace(/\{threadName\}|\{boxName\}/g, threadName)
					.replace(/\{time\}/g, hours)
					.replace(/\{session\}/g, hours <= 10 ?
						getLang("session1") :
						hours <= 12 ?
							getLang("session2") :
							hours <= 18 ?
								getLang("session3") :
								getLang("session4")
					);

				form.body = leaveMessage;

				try {
					const adderID = event.author;
					const [userAvatar, byAvatar, byNameRaw] = await Promise.all([
						usersData.getAvatarUrl(leftParticipantFbId),
						isKicked ? usersData.getAvatarUrl(adderID) : null,
						isKicked ? usersData.getName(adderID) : null
					]);
					const [userImg, byImg] = await Promise.all([
						fetchImage(userAvatar),
						fetchImage(byAvatar)
					]);

					const buffer = await createLeaveCard({
						kicked: isKicked,
						userImg,
						byImg,
						userName,
						byName: byNameRaw || "Unknown",
						groupName: threadName,
						memberCount: group.memberCount,
						dateStr: getTime("DD/MM/YYYY"),
						timeStr: getTime("hh:mm A")
					});

					const filePath = await saveCard(buffer);
					const attachments = [fs.createReadStream(filePath)];

					if (!isKicked && threadData.data.leaveAttachment) {
						const files = threadData.data.leaveAttachment;
						const extra = await Promise.allSettled(files.map(file => drive.getFile(file, "stream")));
						attachments.push(...extra.filter(({ status }) => status == "fulfilled").map(({ value }) => value));
					}

					const cardForm = { attachment: attachments };
					if (hasCustomMessage) {
						cardForm.body = form.body;
						cardForm.mentions = form.mentions;
					}
					return await message.send(cardForm);
				}
				catch (error) {
					console.error("[LEAVE] Card creation error:", error);
				}

				if (isKicked) {
					try {
						const gifRes = await axios.get("https://i.imgur.com/SFQoVw7.gif", {
							responseType: "stream",
							headers: {
								'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
								'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
							}
						});
						form.attachment = gifRes.data;
					}
					catch (e) { }
				}
				else if (threadData.data.leaveAttachment) {
					const files = threadData.data.leaveAttachment;
					const attachments = files.map(file => drive.getFile(file, "stream"));
					form.attachment = (await Promise.allSettled(attachments))
						.filter(({ status }) => status == "fulfilled")
						.map(({ value }) => value);
				}

				message.send(form);
			};
	}
};

module.exports.createLeaveCard = createLeaveCard;
