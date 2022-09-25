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
exports.__esModule = true;
exports.cctvController1 = void 0;
var cctv_device_1 = require("./cctv-device");
var mqtt = require("mqtt");
// @injectable()
var cctvController1 = /** @class */ (function () {
    function cctvController1() {
        this.device = new cctv_device_1.cctvDevice();
    }
    cctvController1.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                console.log("Connecting");
                this.client = mqtt.connect("tcp://broker.mqttdashboard.com");
                this.client.on("connect", function () { return __awaiter(_this, void 0, void 0, function () {
                    var _this = this;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                console.log("MQTT Connected");
                                return [4 /*yield*/, this.device.connectCam("192.168.1.3", "tuannm", "abcd1234", 80)];
                            case 1:
                                _a.sent();
                                console.log("Connect to camera : 192.168.1.3");
                                this.device.startStream("192.168.1.3");
                                setTimeout(function () {
                                    _this.device.disconnect();
                                    console.log("device disconnected");
                                }, 20000);
                                this.client.subscribe(["v1/gateway/ptz", "v1/gateway/rpc/get-config", "v1/gateway/rpc/set-config", "v1/gateway/rpc/set-timer"]);
                                return [2 /*return*/];
                        }
                    });
                }); });
                this.client.on("message", function (topic, payload) { return __awaiter(_this, void 0, void 0, function () {
                    var request, videoConfig, videoConfig1, isSuccess, err_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 5, , 6]);
                                console.log("Receive : | " + topic + " | " + payload);
                                request = JSON.parse(payload);
                                // Received command
                                // PTZ
                                if (topic === "v1/gateway/ptz") {
                                    this.device.ptz(request.hostname, request.ptzValue);
                                }
                                if (!(topic === "v1/gateway/rpc/get-config")) return [3 /*break*/, 2];
                                return [4 /*yield*/, this.device.getVideoConfig(request.camId)];
                            case 1:
                                videoConfig = _a.sent();
                                this.client.publish("v1/gateway/rpc/get-config/res", JSON.stringify(videoConfig));
                                _a.label = 2;
                            case 2:
                                if (!(topic === "v1/gateway/rpc/set-config")) return [3 /*break*/, 4];
                                return [4 /*yield*/, this.device.setVideoConfig(request)];
                            case 3:
                                videoConfig1 = _a.sent();
                                this.client.publish("v1/gateway/rpc/set-config/res", JSON.stringify({
                                    bitrate: videoConfig1.rateControl.bitrateLimit,
                                    fps: videoConfig1.rateControl.frameRateLimit,
                                    resolution: videoConfig1.resolution
                                }));
                                _a.label = 4;
                            case 4:
                                if (topic === "v1/gateway/rpc/set-timer") {
                                    isSuccess = this.device.setTimer(request.camId, request.timer);
                                    if (isSuccess) {
                                        this.client.publish("v1/gateway/rpc/set-timer/res", JSON.stringify({ message: "OK" }));
                                    }
                                    else {
                                        this.client.publish("v1/gateway/rpc/set-timer/res", JSON.stringify({ message: "FAIL" }));
                                    }
                                }
                                return [3 /*break*/, 6];
                            case 5:
                                err_1 = _a.sent();
                                console.log(err_1);
                                return [3 /*break*/, 6];
                            case 6: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    return cctvController1;
}());
exports.cctvController1 = cctvController1;
var a = new cctvController1();
a.connect();
