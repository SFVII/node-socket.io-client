"use strict";
/***********************************************************
 **  @project
 **  @file
 **  @author Brice Daupiard <brice.daupiard@nowbrains.com>
 **  @Date 01/12/2021
 **  @Description
 ***********************************************************/
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
        while (_) try {
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
exports.SocketWrapper = exports.DefaultSocketConfig = void 0;
var socket_io_client_1 = require("socket.io-client");
var rxjs_1 = require("rxjs");
exports.DefaultSocketConfig = {
    url: "",
    path: "/socket.io",
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    randomizationFactor: 0.5,
    timeout: 20000,
    autoConnect: true,
    query: {},
    transports: ["polling", "websocket"],
    extraHeaders: {},
};
var SocketWrapper = /** @class */ (function () {
    function SocketWrapper(Config) {
        var _this = this;
        this.Config = Config;
        this.tokenUpdater = new rxjs_1.BehaviorSubject(null);
        this.subscribersCounter = 0;
        this.roomList = [];
        this.SocketConfig = exports.DefaultSocketConfig;
        if (Config) {
            this.Config = Config;
            this.SocketConfig = Config;
        }
        this.url = !Config || (Config && !Config.url) ? "" : Config.url;
        if ((Config && !Config.auth) || !Config) {
            this.socket = this.connect();
            //this.onReconnect();
        }
        else {
            this.tokenUpdater.subscribe(function (token) {
                if (_this.socket) {
                    _this.disconnect();
                }
                if (token) {
                    if (!_this.SocketConfig.extraHeaders) {
                        _this.SocketConfig.extraHeaders = {};
                    }
                    if (!_this.SocketConfig.transportOptions) {
                        _this.SocketConfig.transportOptions = {};
                    }
                    // @ts-ignore
                    for (var _i = 0, _a = _this.SocketConfig.transports; _i < _a.length; _i++) {
                        var en = _a[_i];
                        _this.SocketConfig.transportOptions[en] = {
                            extraHeaders: {
                                Authorization: "Baerer ".concat(token),
                            },
                        };
                    }
                    _this.SocketConfig.extraHeaders.Authorization = "Baerer ".concat(token);
                    _this.SocketConfig.query.token = "".concat(token);
                    _this.socket = _this.connect();
                    _this.onReconnect();
                }
            });
        }
    }
    SocketWrapper.prototype.unsubscribe = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var index;
            return __generator(this, function (_a) {
                this.socket.emit("unsubscribe", name);
                index = this.roomList.findIndex(function (room) { return room === name; });
                if (index > -1) {
                    this.roomList.splice(index, 1);
                    console.log("unsubscribe room %s", name);
                }
                else {
                    console.log("no joined room");
                }
                return [2 /*return*/];
            });
        });
    };
    SocketWrapper.prototype.unsubscribeAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (this.roomList.length) {
                    this.roomList.forEach(function (room) {
                        _this.unsubscribe(room);
                    });
                }
                return [2 /*return*/];
            });
        });
    };
    SocketWrapper.prototype.subscribe = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.roomList.indexOf(name) > -1)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.unsubscribe(name)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (this.roomList.indexOf(name) === -1) {
                            this.roomList.push(name);
                        }
                        console.log("subscribe room %s", name);
                        return [4 /*yield*/, this.socket.emit("subscribe", name)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SocketWrapper.prototype.of = function (namespace) {
        this.socket.of(namespace);
    };
    SocketWrapper.prototype.on = function (eventName, callback) {
        this.socket.on(eventName, callback);
    };
    SocketWrapper.prototype.once = function (eventName, callback) {
        this.socket.once(eventName, callback);
    };
    SocketWrapper.prototype.connect = function () {
        console.log("Config", this.SocketConfig);
        // const ioSocket = (io as any) ? (io as any) : io;
        return (0, socket_io_client_1.io)(this.url, {
            reconnection: this.SocketConfig.reconnection,
            reconnectionAttempts: this.SocketConfig.reconnectionAttempts,
            reconnectionDelay: this.SocketConfig.reconnectionDelay,
            reconnectionDelayMax: this.SocketConfig.reconnectionDelay,
            randomizationFactor: this.SocketConfig.randomizationFactor,
            timeout: this.SocketConfig.timeout,
            autoConnect: this.SocketConfig.autoConnect,
            query: this.SocketConfig.query,
            extraHeaders: this.SocketConfig.extraHeaders,
            transports: this.SocketConfig.transports,
            transportOptions: this.SocketConfig.transportOptions,
        }).connect();
    };
    SocketWrapper.prototype.disconnect = function (close) {
        return this.socket.disconnect.apply(this.socket, arguments);
    };
    SocketWrapper.prototype.emit = function (eventName, data, callback) {
        this.socket.emit(eventName, data, callback);
    };
    SocketWrapper.prototype.removeListener = function (eventName, callback) {
        return this.socket.removeListener.apply(this.socket, arguments);
    };
    SocketWrapper.prototype.removeAllListeners = function (eventName) {
        return this.socket.removeAllListeners.apply(this.socket, arguments);
    };
    SocketWrapper.prototype.fromEvent = function (eventName) {
        var _this = this;
        this.subscribersCounter++;
        return new rxjs_1.Observable(function (observer) {
            _this.socket.on(eventName, function (data) {
                observer.next(data);
            });
            return function () {
                if (_this.subscribersCounter === 1) {
                    _this.socket.removeListener(eventName);
                }
            };
        }).pipe((0, rxjs_1.share)());
    };
    SocketWrapper.prototype.fromOneTimeEvent = function (eventName) {
        var _this = this;
        return new Promise(function (resolve) { return _this.once(eventName, resolve); });
    };
    SocketWrapper.prototype.onReconnect = function () {
        var _this = this;
        if (this.socket) {
            this.socket.on("reconnect", function () {
                if (_this.roomList && _this.roomList.length) {
                    _this.roomList.forEach(function (name) {
                        _this.subscribe(name).catch(function (err) {
                            return console.log("error socket reconnect", err);
                        });
                    });
                }
                else {
                    console.log("room is empty");
                }
            });
        }
        else {
            console.log("socket does not exist");
        }
    };
    return SocketWrapper;
}());
exports.SocketWrapper = SocketWrapper;
exports.default = SocketWrapper;
