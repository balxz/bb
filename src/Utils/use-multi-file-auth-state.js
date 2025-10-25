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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shUseMultiFileAuthState = void 0;
var async_mutex_1 = require("async-mutex");
var promises_1 = require("fs/promises");
var path_1 = require("path");
var index_js_1 = require("../../WAProto/index.js");
var auth_utils_1 = require("./auth-utils");
var generics_1 = require("./generics");
// We need to lock files due to the fact that we are using async functions to read and write files
// https://github.com/WhiskeySockets/Baileys/issues/794
// https://github.com/nodejs/node/issues/26338
// Use a Map to store mutexes for each file path
var fileLocks = new Map();
// Get or create a mutex for a specific file path
var getFileLock = function (path) {
    var mutex = fileLocks.get(path);
    if (!mutex) {
        mutex = new async_mutex_1.Mutex();
        fileLocks.set(path, mutex);
    }
    return mutex;
};
/**
 * stores the full authentication state in a single folder.
 * Far more efficient than singlefileauthstate
 *
 * Again, I wouldn't endorse this for any production level use other than perhaps a bot.
 * Would recommend writing an auth state for use with a proper SQL or No-SQL DB
 * */
var shUseMultiFileAuthState = function (folder) { return __awaiter(void 0, void 0, Promise, function () {
    var writeData, readData, removeData, folderInfo, fixFileName, creds;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                writeData = function (data, file) { return __awaiter(void 0, void 0, void 0, function () {
                    var filePath, mutex;
                    return __generator(this, function (_a) {
                        filePath = (0, path_1.join)(folder, fixFileName(file));
                        mutex = getFileLock(filePath);
                        return [2 /*return*/, mutex.acquire().then(function (release) { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, , 2, 3]);
                                            return [4 /*yield*/, (0, promises_1.writeFile)(filePath, JSON.stringify(data, generics_1.BufferJSON.replacer))];
                                        case 1:
                                            _a.sent();
                                            return [3 /*break*/, 3];
                                        case 2:
                                            release();
                                            return [7 /*endfinally*/];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); })];
                    });
                }); };
                readData = function (file) { return __awaiter(void 0, void 0, void 0, function () {
                    var filePath_1, mutex, error_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                filePath_1 = (0, path_1.join)(folder, fixFileName(file));
                                mutex = getFileLock(filePath_1);
                                return [4 /*yield*/, mutex.acquire().then(function (release) { return __awaiter(void 0, void 0, void 0, function () {
                                        var data;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    _a.trys.push([0, , 2, 3]);
                                                    return [4 /*yield*/, (0, promises_1.readFile)(filePath_1, { encoding: 'utf-8' })];
                                                case 1:
                                                    data = _a.sent();
                                                    return [2 /*return*/, JSON.parse(data, generics_1.BufferJSON.reviver)];
                                                case 2:
                                                    release();
                                                    return [7 /*endfinally*/];
                                                case 3: return [2 /*return*/];
                                            }
                                        });
                                    }); })];
                            case 1: return [2 /*return*/, _a.sent()];
                            case 2:
                                error_1 = _a.sent();
                                return [2 /*return*/, null];
                            case 3: return [2 /*return*/];
                        }
                    });
                }); };
                removeData = function (file) { return __awaiter(void 0, void 0, void 0, function () {
                    var filePath_2, mutex;
                    return __generator(this, function (_a) {
                        try {
                            filePath_2 = (0, path_1.join)(folder, fixFileName(file));
                            mutex = getFileLock(filePath_2);
                            return [2 /*return*/, mutex.acquire().then(function (release) { return __awaiter(void 0, void 0, void 0, function () {
                                    var _a;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0:
                                                _b.trys.push([0, 2, 3, 4]);
                                                return [4 /*yield*/, (0, promises_1.unlink)(filePath_2)];
                                            case 1:
                                                _b.sent();
                                                return [3 /*break*/, 4];
                                            case 2:
                                                _a = _b.sent();
                                                return [3 /*break*/, 4];
                                            case 3:
                                                release();
                                                return [7 /*endfinally*/];
                                            case 4: return [2 /*return*/];
                                        }
                                    });
                                }); })];
                        }
                        catch (_b) { }
                        return [2 /*return*/];
                    });
                }); };
                return [4 /*yield*/, (0, promises_1.stat)(folder).catch(function () { })];
            case 1:
                folderInfo = _a.sent();
                if (!folderInfo) return [3 /*break*/, 2];
                if (!folderInfo.isDirectory()) {
                    throw new Error("found something that is not a directory at ".concat(folder, ", either delete it or specify a different location"));
                }
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, (0, promises_1.mkdir)(folder, { recursive: true })];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                fixFileName = function (file) { var _a; return (_a = file === null || file === void 0 ? void 0 : file.replace(/\//g, '__')) === null || _a === void 0 ? void 0 : _a.replace(/:/g, '-'); };
                return [4 /*yield*/, readData('creds.json')];
            case 5:
                creds = (_a.sent()) || (0, auth_utils_1.initAuthCreds)();
                return [2 /*return*/, {
                        state: {
                            creds: creds,
                            keys: {
                                get: function (type, ids) { return __awaiter(void 0, void 0, void 0, function () {
                                    var data;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                data = {};
                                                return [4 /*yield*/, Promise.all(ids.map(function (id) { return __awaiter(void 0, void 0, void 0, function () {
                                                        var value;
                                                        return __generator(this, function (_a) {
                                                            switch (_a.label) {
                                                                case 0: return [4 /*yield*/, readData("".concat(type, "-").concat(id, ".json"))];
                                                                case 1:
                                                                    value = _a.sent();
                                                                    if (type === 'app-state-sync-key' && value) {
                                                                        value = index_js_1.proto.Message.AppStateSyncKeyData.fromObject(value);
                                                                    }
                                                                    data[id] = value;
                                                                    return [2 /*return*/];
                                                            }
                                                        });
                                                    }); }))];
                                            case 1:
                                                _a.sent();
                                                return [2 /*return*/, data];
                                        }
                                    });
                                }); },
                                set: function (data) { return __awaiter(void 0, void 0, void 0, function () {
                                    var tasks, category, id, value, file;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                tasks = [];
                                                for (category in data) {
                                                    for (id in data[category]) {
                                                        value = data[category][id];
                                                        file = "".concat(category, "-").concat(id, ".json");
                                                        tasks.push(value ? writeData(value, file) : removeData(file));
                                                    }
                                                }
                                                return [4 /*yield*/, Promise.all(tasks)];
                                            case 1:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); }
                            }
                        },
                        saveCreds: function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, writeData(creds, 'creds.json')];
                            });
                        }); }
                    }];
        }
    });
}); };
exports.shUseMultiFileAuthState = shUseMultiFileAuthState;
