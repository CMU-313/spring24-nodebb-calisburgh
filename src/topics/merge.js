"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const plugins_1 = __importDefault(require("../plugins"));
const posts_1 = __importDefault(require("../posts"));
module.exports = function (Topics) {
    Topics.merge = function (tids, uid, options) {
        return __awaiter(this, void 0, void 0, function* () {
            function createNewTopic(title, oldestTid) {
                return __awaiter(this, void 0, void 0, function* () {
                    const topicData = yield Topics.getTopicFields(oldestTid, ['uid', 'cid']);
                    const params = {
                        uid: topicData.uid,
                        cid: topicData.cid,
                        title: title,
                    };
                    const result = yield plugins_1.default.hooks.fire('filter:topic.mergeCreateNewTopic', {
                        oldestTid: oldestTid,
                        params: params,
                    });
                    const tid = yield Topics.create(result.params);
                    return tid;
                });
            }
            function updateViewCount(mergeIntoTid, tids) {
                return __awaiter(this, void 0, void 0, function* () {
                    const topicData = yield Topics.getTopicsFields(tids, ['viewcount']);
                    const totalViewCount = topicData.reduce((count, topic) => count + topic.viewcount, 0);
                    yield Topics.setTopicField(mergeIntoTid, 'viewcount', totalViewCount);
                });
            }
            function findOldestTopic(tids) {
                return Math.min.apply(null, tids);
            }
            options = options || {};
            const topicsData = yield Topics.getTopicsFields(tids, ['scheduled']);
            if (topicsData.some(t => t.scheduled)) {
                throw new Error('[[error:cant-merge-scheduled]]');
            }
            const oldestTid = findOldestTopic(tids);
            let mergeIntoTid = oldestTid;
            if (options.mainTid) {
                mergeIntoTid = options.mainTid;
            }
            else if (options.newTopicTitle) {
                mergeIntoTid = yield createNewTopic(options.newTopicTitle, oldestTid);
            }
            const otherTids = tids.sort((a, b) => a - b)
                .filter(tid => tid && tid !== mergeIntoTid);
            for (const tid of otherTids) {
                /* eslint-disable no-await-in-loop */
                const pids = yield Topics.getPids(tid);
                for (const pid of pids) {
                    yield Topics.movePostToTopic(uid, pid, mergeIntoTid);
                }
                yield Topics.setTopicField(tid, 'mainPid', 0);
                yield Topics.delete(tid, uid);
                yield Topics.setTopicFields(tid, {
                    mergeIntoTid: mergeIntoTid,
                    mergerUid: uid,
                    mergedTimestamp: Date.now(),
                });
            }
            yield Promise.all([
                // The next line calls a function in a module that has not been updated to TS yet
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                posts_1.default.updateQueuedPostsTopic(mergeIntoTid, otherTids),
                updateViewCount(mergeIntoTid, tids),
            ]);
            yield plugins_1.default.hooks.fire('action:topic.merge', {
                uid: uid,
                tids: tids,
                mergeIntoTid: mergeIntoTid,
                otherTids: otherTids,
            });
            return mergeIntoTid;
        });
    };
};
