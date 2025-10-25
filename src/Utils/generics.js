"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.encodeNewsletterMessage = exports.bytesToCrockford = exports.trimUndefined = exports.isWABusinessPlatform = exports.getCodeFromWSError = exports.getCallStatusFromNode = exports.getErrorCodeFromStreamError = exports.getStatusFromReceiptType = exports.generateMdTagPrefix = exports.fetchLatestWaWebVersion = exports.fetchLatestBaileysVersion = exports.bindWaitForConnectionUpdate = exports.bindWaitForEvent = exports.generateMessageID = exports.generateMessageIDV2 = exports.promiseTimeout = exports.delayCancellable = exports.delay = exports.debouncedTimeout = exports.unixTimestampSeconds = exports.toNumber = exports.encodeBigEndian = exports.generateRegistrationId = exports.encodeWAMessage = exports.generateParticipantHashV2 = exports.unpadRandomMax16 = exports.writeRandomPadMax16 = exports.getKeyAuthor = exports.BufferJSON = void 0;
var boom_1 = require("@hapi/boom");
var crypto_1 = require("crypto");
var index_js_1 = require("../../WAProto/index.js");
var baileysVersion = [2, 3000, 1027934701];
var Types_1 = require("../Types");
var WABinary_1 = require("../WABinary");
var crypto_2 = require("./crypto");
exports.BufferJSON = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    replacer: function (k, value) {
        if (Buffer.isBuffer(value) || value instanceof Uint8Array || (value === null || value === void 0 ? void 0 : value.type) === 'Buffer') {
            return { type: 'Buffer', data: Buffer.from((value === null || value === void 0 ? void 0 : value.data) || value).toString('base64') };
        }
        return value;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reviver: function (_, value) {
        if (typeof value === 'object' && value !== null && value.type === 'Buffer' && typeof value.data === 'string') {
            return Buffer.from(value.data, 'base64');
        }
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            var keys = Object.keys(value);
            if (keys.length > 0 && keys.every(function (k) { return !isNaN(parseInt(k, 10)); })) {
                var values = Object.values(value);
                if (values.every(function (v) { return typeof v === 'number'; })) {
                    return Buffer.from(values);
                }
            }
        }
        return value;
    }
};
var getKeyAuthor = function (key, meId) {
    if (meId === void 0) { meId = 'me'; }
    return ((key === null || key === void 0 ? void 0 : key.fromMe) ? meId : (key === null || key === void 0 ? void 0 : key.participant) || (key === null || key === void 0 ? void 0 : key.remoteJid)) || '';
};
exports.getKeyAuthor = getKeyAuthor;
var writeRandomPadMax16 = function (msg) {
    var pad = (0, crypto_1.randomBytes)(1);
    var padLength = (pad[0] & 0x0f) + 1;
    return Buffer.concat([msg, Buffer.alloc(padLength, padLength)]);
};
exports.writeRandomPadMax16 = writeRandomPadMax16;
var unpadRandomMax16 = function (e) {
    var t = new Uint8Array(e);
    if (0 === t.length) {
        throw new Error('unpadPkcs7 given empty bytes');
    }
    var r = t[t.length - 1];
    if (r > t.length) {
        throw new Error("unpad given ".concat(t.length, " bytes, but pad is ").concat(r));
    }
    return new Uint8Array(t.buffer, t.byteOffset, t.length - r);
};
exports.unpadRandomMax16 = unpadRandomMax16;
// code is inspired by whatsmeow
var generateParticipantHashV2 = function (participants) {
    participants.sort();
    var sha256Hash = (0, crypto_2.sha256)(Buffer.from(participants.join(''))).toString('base64');
    return '2:' + sha256Hash.slice(0, 6);
};
exports.generateParticipantHashV2 = generateParticipantHashV2;
var encodeWAMessage = function (message) { return (0, exports.writeRandomPadMax16)(index_js_1.proto.Message.encode(message).finish()); };
exports.encodeWAMessage = encodeWAMessage;
var generateRegistrationId = function () {
    return Uint16Array.from((0, crypto_1.randomBytes)(2))[0] & 16383;
};
exports.generateRegistrationId = generateRegistrationId;
var encodeBigEndian = function (e, t) {
    if (t === void 0) { t = 4; }
    var r = e;
    var a = new Uint8Array(t);
    for (var i = t - 1; i >= 0; i--) {
        a[i] = 255 & r;
        r >>>= 8;
    }
    return a;
};
exports.encodeBigEndian = encodeBigEndian;
var toNumber = function (t) {
    return typeof t === 'object' && t ? ('toNumber' in t ? t.toNumber() : t.low) : t || 0;
};
exports.toNumber = toNumber;
/** unix timestamp of a date in seconds */
var unixTimestampSeconds = function (date) {
    if (date === void 0) { date = new Date(); }
    return Math.floor(date.getTime() / 1000);
};
exports.unixTimestampSeconds = unixTimestampSeconds;
var debouncedTimeout = function (intervalMs, task) {
    if (intervalMs === void 0) { intervalMs = 1000; }
    var timeout;
    return {
        start: function (newIntervalMs, newTask) {
            task = newTask || task;
            intervalMs = newIntervalMs || intervalMs;
            timeout && clearTimeout(timeout);
            timeout = setTimeout(function () { return task === null || task === void 0 ? void 0 : task(); }, intervalMs);
        },
        cancel: function () {
            timeout && clearTimeout(timeout);
            timeout = undefined;
        },
        setTask: function (newTask) { return (task = newTask); },
        setInterval: function (newInterval) { return (intervalMs = newInterval); }
    };
};
exports.debouncedTimeout = debouncedTimeout;
var delay = function (ms) { return (0, exports.delayCancellable)(ms).delay; };
exports.delay = delay;
var delayCancellable = function (ms) {
    var stack = new Error().stack;
    var timeout;
    var reject;
    var delay = new Promise(function (resolve, _reject) {
        timeout = setTimeout(resolve, ms);
        reject = _reject;
    });
    var cancel = function () {
        clearTimeout(timeout);
        reject(new boom_1.Boom('Cancelled', {
            statusCode: 500,
            data: {
                stack: stack
            }
        }));
    };
    return { delay: delay, cancel: cancel };
};
exports.delayCancellable = delayCancellable;
function promiseTimeout(ms, promise) {
    return __awaiter(this, void 0, void 0, function () {
        var stack, _a, delay, cancel, p;
        return __generator(this, function (_b) {
            if (!ms) {
                return [2 /*return*/, new Promise(promise)];
            }
            stack = new Error().stack;
            _a = (0, exports.delayCancellable)(ms), delay = _a.delay, cancel = _a.cancel;
            p = new Promise(function (resolve, reject) {
                delay
                    .then(function () {
                    return reject(new boom_1.Boom('Timed Out', {
                        statusCode: Types_1.DisconnectReason.timedOut,
                        data: {
                            stack: stack
                        }
                    }));
                })
                    .catch(function (err) { return reject(err); });
                promise(resolve, reject);
            }).finally(cancel);
            return [2 /*return*/, p];
        });
    });
}
exports.promiseTimeout = promiseTimeout;
// inspired from whatsmeow code
// https://github.com/tulir/whatsmeow/blob/64bc969fbe78d31ae0dd443b8d4c80a5d026d07a/send.go#L42
var generateMessageIDV2 = function (userId) {
    var data = Buffer.alloc(8 + 20 + 16);
    data.writeBigUInt64BE(BigInt(Math.floor(Date.now() / 1000)));
    if (userId) {
        var id = (0, WABinary_1.jidDecode)(userId);
        if (id === null || id === void 0 ? void 0 : id.user) {
            data.write(id.user, 8);
            data.write('@c.us', 8 + id.user.length);
        }
    }
    var random = (0, crypto_1.randomBytes)(16);
    random.copy(data, 28);
    var hash = (0, crypto_1.createHash)('sha256').update(data).digest();
    return 'SH1N4' + hash.toString('hex').toUpperCase().substring(0, 18);
};
exports.generateMessageIDV2 = generateMessageIDV2;
// generate a random ID to attach to a message
var generateMessageID = function () { return 'SH1N4' + (0, crypto_1.randomBytes)(18).toString('hex').toUpperCase(); };
exports.generateMessageID = generateMessageID;
function bindWaitForEvent(ev, event) {
    var _this = this;
    return function (check, timeoutMs) { return __awaiter(_this, void 0, void 0, function () {
        var listener, closeListener;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promiseTimeout(timeoutMs, function (resolve, reject) {
                        closeListener = function (_a) {
                            var connection = _a.connection, lastDisconnect = _a.lastDisconnect;
                            if (connection === 'close') {
                                reject((lastDisconnect === null || lastDisconnect === void 0 ? void 0 : lastDisconnect.error) || new boom_1.Boom('Connection Closed', { statusCode: Types_1.DisconnectReason.connectionClosed }));
                            }
                        };
                        ev.on('connection.update', closeListener);
                        listener = function (update) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, check(update)];
                                    case 1:
                                        if (_a.sent()) {
                                            resolve();
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        }); };
                        ev.on(event, listener);
                    }).finally(function () {
                        ev.off(event, listener);
                        ev.off('connection.update', closeListener);
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
}
exports.bindWaitForEvent = bindWaitForEvent;
var bindWaitForConnectionUpdate = function (ev) { return bindWaitForEvent(ev, 'connection.update'); };
exports.bindWaitForConnectionUpdate = bindWaitForConnectionUpdate;
/**
 * utility that fetches latest baileys version from the master branch.
 * Use to ensure your WA connection is always on the latest version
 */
var fetchLatestBaileysVersion = function (options) {
    if (options === void 0) { options = {}; }
    return __awaiter(void 0, void 0, void 0, function () {
        var URL, response, text, lines, versionLine, versionMatch, version, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    URL = 'https://raw.githubusercontent.com/WhiskeySockets/Baileys/master/src/Defaults/index.ts';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch(URL, {
                            dispatcher: options.dispatcher,
                            method: 'GET',
                            headers: options.headers
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new boom_1.Boom("Failed to fetch latest Baileys version: ".concat(response.statusText), { statusCode: response.status });
                    }
                    return [4 /*yield*/, response.text()
                        // Extract version from line 7 (const version = [...])
                    ];
                case 3:
                    text = _a.sent();
                    lines = text.split('\n');
                    versionLine = lines[6] // Line 7 (0-indexed)
                    ;
                    versionMatch = versionLine.match(/const version = \[(\d+),\s*(\d+),\s*(\d+)\]/);
                    if (versionMatch) {
                        version = [parseInt(versionMatch[1]), parseInt(versionMatch[2]), parseInt(versionMatch[3])];
                        return [2 /*return*/, {
                                version: version,
                                isLatest: true
                            }];
                    }
                    else {
                        throw new Error('Could not parse version from Defaults/index.ts');
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    return [2 /*return*/, {
                            version: baileysVersion,
                            isLatest: false,
                            error: error_1
                        }];
                case 5: return [2 /*return*/];
            }
        });
    });
};
exports.fetchLatestBaileysVersion = fetchLatestBaileysVersion;
/**
 * A utility that fetches the latest web version of whatsapp.
 * Use to ensure your WA connection is always on the latest version
 */
var fetchLatestWaWebVersion = function (options) {
    if (options === void 0) { options = {}; }
    return __awaiter(void 0, void 0, void 0, function () {
        var defaultHeaders, headers, response, data, regex, match, clientRevision, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    defaultHeaders = {
                        'sec-fetch-site': 'none',
                        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
                    };
                    headers = __assign(__assign({}, defaultHeaders), options.headers);
                    return [4 /*yield*/, fetch('https://web.whatsapp.com/sw.js', __assign(__assign({}, options), { method: 'GET', headers: headers }))];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new boom_1.Boom("Failed to fetch sw.js: ".concat(response.statusText), { statusCode: response.status });
                    }
                    return [4 /*yield*/, response.text()];
                case 2:
                    data = _a.sent();
                    regex = /\\?"client_revision\\?":\s*(\d+)/;
                    match = data.match(regex);
                    if (!(match === null || match === void 0 ? void 0 : match[1])) {
                        return [2 /*return*/, {
                                version: baileysVersion,
                                isLatest: false,
                                error: {
                                    message: 'Could not find client revision in the fetched content'
                                }
                            }];
                    }
                    clientRevision = match[1];
                    return [2 /*return*/, {
                            version: [2, 3000, +clientRevision],
                            isLatest: true
                        }];
                case 3:
                    error_2 = _a.sent();
                    return [2 /*return*/, {
                            version: baileysVersion,
                            isLatest: false,
                            error: error_2
                        }];
                case 4: return [2 /*return*/];
            }
        });
    });
};
exports.fetchLatestWaWebVersion = fetchLatestWaWebVersion;
/** unique message tag prefix for MD clients */
var generateMdTagPrefix = function () {
    var bytes = (0, crypto_1.randomBytes)(4);
    return "".concat(bytes.readUInt16BE(), ".").concat(bytes.readUInt16BE(2), "-");
};
exports.generateMdTagPrefix = generateMdTagPrefix;
var STATUS_MAP = {
    sender: index_js_1.proto.WebMessageInfo.Status.SERVER_ACK,
    played: index_js_1.proto.WebMessageInfo.Status.PLAYED,
    read: index_js_1.proto.WebMessageInfo.Status.READ,
    'read-self': index_js_1.proto.WebMessageInfo.Status.READ
};
/**
 * Given a type of receipt, returns what the new status of the message should be
 * @param type type from receipt
 */
var getStatusFromReceiptType = function (type) {
    var status = STATUS_MAP[type];
    if (typeof type === 'undefined') {
        return index_js_1.proto.WebMessageInfo.Status.DELIVERY_ACK;
    }
    return status;
};
exports.getStatusFromReceiptType = getStatusFromReceiptType;
var CODE_MAP = {
    conflict: Types_1.DisconnectReason.connectionReplaced
};
/**
 * Stream errors generally provide a reason, map that to a baileys DisconnectReason
 * @param reason the string reason given, eg. "conflict"
 */
var getErrorCodeFromStreamError = function (node) {
    var reasonNode = (0, WABinary_1.getAllBinaryNodeChildren)(node)[0];
    var reason = (reasonNode === null || reasonNode === void 0 ? void 0 : reasonNode.tag) || 'unknown';
    var statusCode = +(node.attrs.code || CODE_MAP[reason] || Types_1.DisconnectReason.badSession);
    if (statusCode === Types_1.DisconnectReason.restartRequired) {
        reason = 'restart required';
    }
    return {
        reason: reason,
        statusCode: statusCode
    };
};
exports.getErrorCodeFromStreamError = getErrorCodeFromStreamError;
var getCallStatusFromNode = function (_a) {
    var tag = _a.tag, attrs = _a.attrs;
    var status;
    switch (tag) {
        case 'offer':
        case 'offer_notice':
            status = 'offer';
            break;
        case 'terminate':
            if (attrs.reason === 'timeout') {
                status = 'timeout';
            }
            else {
                //fired when accepted/rejected/timeout/caller hangs up
                status = 'terminate';
            }
            break;
        case 'reject':
            status = 'reject';
            break;
        case 'accept':
            status = 'accept';
            break;
        default:
            status = 'ringing';
            break;
    }
    return status;
};
exports.getCallStatusFromNode = getCallStatusFromNode;
var UNEXPECTED_SERVER_CODE_TEXT = 'Unexpected server response: ';
var getCodeFromWSError = function (error) {
    var _a, _b, _c;
    var statusCode = 500;
    if ((_a = error === null || error === void 0 ? void 0 : error.message) === null || _a === void 0 ? void 0 : _a.includes(UNEXPECTED_SERVER_CODE_TEXT)) {
        var code = +(error === null || error === void 0 ? void 0 : error.message.slice(UNEXPECTED_SERVER_CODE_TEXT.length));
        if (!Number.isNaN(code) && code >= 400) {
            statusCode = code;
        }
    }
    else if (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((_b = error === null || error === void 0 ? void 0 : error.code) === null || _b === void 0 ? void 0 : _b.startsWith('E')) ||
        ((_c = error === null || error === void 0 ? void 0 : error.message) === null || _c === void 0 ? void 0 : _c.includes('timed out'))) {
        // handle ETIMEOUT, ENOTFOUND etc
        statusCode = 408;
    }
    return statusCode;
};
exports.getCodeFromWSError = getCodeFromWSError;
/**
 * Is the given platform WA business
 * @param platform AuthenticationCreds.platform
 */
var isWABusinessPlatform = function (platform) {
    return platform === 'smbi' || platform === 'smba';
};
exports.isWABusinessPlatform = isWABusinessPlatform;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function trimUndefined(obj) {
    for (var key in obj) {
        if (typeof obj[key] === 'undefined') {
            delete obj[key];
        }
    }
    return obj;
}
exports.trimUndefined = trimUndefined;
var CROCKFORD_CHARACTERS = '123456789ABCDEFGHJKLMNPQRSTVWXYZ';
function bytesToCrockford(buffer) {
    var value = 0;
    var bitCount = 0;
    var crockford = [];
    for (var _i = 0, buffer_1 = buffer; _i < buffer_1.length; _i++) {
        var element = buffer_1[_i];
        value = (value << 8) | (element & 0xff);
        bitCount += 8;
        while (bitCount >= 5) {
            crockford.push(CROCKFORD_CHARACTERS.charAt((value >>> (bitCount - 5)) & 31));
            bitCount -= 5;
        }
    }
    if (bitCount > 0) {
        crockford.push(CROCKFORD_CHARACTERS.charAt((value << (5 - bitCount)) & 31));
    }
    return crockford.join('');
}
exports.bytesToCrockford = bytesToCrockford;
function encodeNewsletterMessage(message) {
    return index_js_1.proto.Message.encode(message).finish();
}
exports.encodeNewsletterMessage = encodeNewsletterMessage;
