const { db, utils, GoatBot } = global;
const { config } = GoatBot;
const { log, getText } = utils;
const { creatingThreadData, creatingUserData } = global.client.database;

module.exports = async function (usersData, threadsData, event) {
	const { threadID } = event;
	const senderID = event.senderID || event.author || event.userID;

	// ———————————— CHECK THREAD DATA ———————————— //
	if (threadID) {
		try {
			if (global.temp.createThreadDataError.includes(threadID))
				return;

			const findInCreatingThreadData = creatingThreadData.find(t => t.threadID == threadID);
			if (!findInCreatingThreadData) {
				if (global.db.allThreadData.some(t => t.threadID == threadID))
					return;

				// E2EE / inbox threads are not normal threads: api.getThreadInfo fails for them,
				// so build minimal DM info ourselves instead of asking Facebook.
				const dmInfo = (event.isE2EE === true || event.isGroup === false) ? {
					threadName: "Inbox " + threadID,
					userInfo: [{ id: String(threadID), name: "Unknown", gender: 0 }],
					adminIDs: [],
					nicknames: {},
					threadType: 1
				} : undefined;
				const threadData = await threadsData.create(threadID, dmInfo);
				log.info("DATABASE", `New Thread: ${threadID} | ${threadData.threadName} | ${config.database.type}`);
			}
			else {
				await findInCreatingThreadData.promise;
			}
		}
		catch (err) {
			if (err.name != "DATA_ALREADY_EXISTS") {
				global.temp.createThreadDataError.push(threadID);
				log.err("DATABASE", getText("handlerCheckData", "cantCreateThread", threadID), err);
			}
		}
	}


	// ————————————— CHECK USER DATA ————————————— //
	if (senderID) {
		try {
			const findInCreatingUserData = creatingUserData.find(u => u.userID == senderID);
			if (!findInCreatingUserData) {
				if (db.allUserData.some(u => u.userID == senderID))
					return;

				const userData = await usersData.create(senderID).catch(async e => {
					if (event.isE2EE === true) return await usersData.create(senderID, { name: "Unknown" });
					throw e;
				});
				log.info("DATABASE", `New User: ${senderID} | ${userData.name} | ${config.database.type}`);
			}
			else {
				await findInCreatingUserData.promise;
			}
		}
		catch (err) {
			if (err.name != "DATA_ALREADY_EXISTS")
				log.err("DATABASE", getText("handlerCheckData", "cantCreateUser", senderID), err);
		}
	}
};
