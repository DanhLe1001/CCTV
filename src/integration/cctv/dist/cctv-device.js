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
exports.cctvDevice = void 0;
var cctv_1 = require("./cctv");
var cctv_streaming_1 = require("./cctv-streaming");
var util = require('util');
var axios = require("axios");
// import axios from 'axios';
var FormData = require("form-data");
var fs = require('fs');
var util = require('util');
// import * as fs from 'fs';
var cctvDevice = /** @class */ (function () {
    function cctvDevice() {
        this.cams = [];
    }
    cctvDevice.prototype.connectCam = function (hostname, username, password, port) {
        return __awaiter(this, void 0, void 0, function () {
            var currentTry, camera, camIndex, newCam, _a, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        currentTry = 0;
                        _b.label = 1;
                    case 1:
                        if (!true) return [3 /*break*/, 6];
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        camera = new cctv_1.CCTV();
                        camIndex = this.getIndexCam(hostname);
                        if (camIndex >= 0) {
                            this.cams[camIndex].camera = camera;
                        }
                        else {
                            newCam = {
                                hostname: hostname,
                                username: username,
                                password: password,
                                camera: camera,
                                streamPid: null,
                                rtspUrl: null,
                                interval: null
                            };
                            this.cams.push(newCam);
                        }
                        camIndex = this.getIndexCam(hostname);
                        _a = this.cams[camIndex].camera;
                        return [4 /*yield*/, camera.init(hostname, username, password, port)];
                    case 3:
                        _a.cam = _b.sent();
                        console.log("connected to camera");
                        // var rtsp = await this.getStreamUrl(hostname);
                        // var rtsp = "rtsp://192.168.1.3/Streaming/Channels/101?transportmode=unicast&profile=Profile_1";
                        // this.cams[camIndex].rtspUrl = cctvHelper.mergeStreamUrl(rtsp, username, password);
                        // this.cams[camIndex].rtspUrl = "rtsp://tuannm:abcd1234@192.168.1.3/Streaming/Channels/101?transportmode=unicast&profile=Profile_1"
                        // this.cams[camIndex].interval = setInterval(() => {
                        //     this.uploadSnapshot(this.cams[camIndex].hostname);
                        // }, 9000);
                        return [2 /*return*/, true];
                    case 4:
                        error_1 = _b.sent();
                        console.log(error_1.message);
                        currentTry++;
                        console.log("Failed attempt " + currentTry + " ");
                        if (currentTry >= 5) {
                            console.log("Retry maximum reached. Exiting");
                            return [3 /*break*/, 6];
                        }
                        return [3 /*break*/, 5];
                    case 5: return [3 /*break*/, 1];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    cctvDevice.prototype.startStream = function (hostname) {
        var camIndex = this.getIndexCam(hostname);
        var stream = new cctv_streaming_1.CCTVStreaming();
        this.cams[camIndex].streamPid = stream.exStream();
    };
    cctvDevice.prototype.disconnect = function () {
        var stream = new cctv_streaming_1.CCTVStreaming();
        stream.disconnect();
    };
    cctvDevice.prototype.getIndexCam = function (hostname) {
        return this.cams.findIndex(function (cam) { return cam.hostname === hostname; });
    };
    cctvDevice.prototype.getStreamUrl = function (camId) {
        return __awaiter(this, void 0, void 0, function () {
            var temp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.cams[this.getIndexCam(camId)].camera.getStreamUrlcam()];
                    case 1:
                        temp = _a.sent();
                        return [2 /*return*/, temp];
                }
            });
        });
    };
    cctvDevice.prototype.uploadSnapshot = function (camId) {
        return __awaiter(this, void 0, void 0, function () {
            var selectedCam, snapshot, data, temp, tempSnapshotFolder, currentTime, tempImageName, writeStream;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        selectedCam = this.cams[this.getIndexCam(camId)];
                        return [4 /*yield*/, selectedCam.camera.getSnapshot()];
                    case 1:
                        snapshot = _a.sent();
                        data = new FormData();
                        temp = snapshot.mimeType.split("/");
                        tempSnapshotFolder = "./temp-snapshots/" + camId;
                        currentTime = Date.now();
                        tempImageName = tempSnapshotFolder + "/" + currentTime + "." + temp[temp.length - 1];
                        fs.mkdirSync(tempSnapshotFolder, { recursive: true });
                        writeStream = fs.createWriteStream(tempImageName);
                        writeStream.write(snapshot);
                        writeStream.write(snapshot, function (err) {
                            if (!err) {
                                writeStream.destroy();
                                fs.readdirSync(tempSnapshotFolder).forEach(function (file) {
                                    var filePath = tempSnapshotFolder + "/" + file;
                                    data.append("snapshot", fs.createReadStream(filePath));
                                });
                                var config = {
                                    method: "post",
                                    url: "http://112.78.1.209:3000/camera/" + camId,
                                    headers: __assign({}, data.getHeaders()),
                                    data: data
                                };
                                axios(config)
                                    .then(function (response) {
                                    return __awaiter(this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            fs.rmSync(tempSnapshotFolder, { force: true, recursive: true });
                                            return [2 /*return*/];
                                        });
                                    });
                                })["catch"](function (error) {
                                    console.log("error", error);
                                });
                            }
                            else {
                                console.log(err);
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    cctvDevice.prototype.getVideoConfig = function (camId) {
        return __awaiter(this, void 0, void 0, function () {
            var selectedCam, profiles, videoFullConfig, videoConfig;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        selectedCam = this.cams[this.getIndexCam(camId)];
                        return [4 /*yield*/, selectedCam.camera.getVideoConfig()];
                    case 1:
                        profiles = _a.sent();
                        videoFullConfig = profiles[0];
                        videoConfig = {
                            fps: videoFullConfig.rateControl.frameRateLimit,
                            resolution: videoFullConfig.resolution,
                            bitrate: videoFullConfig.rateControl.bitrateLimit
                        };
                        return [2 /*return*/, videoConfig];
                }
            });
        });
    };
    cctvDevice.prototype.setVideoConfig = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            var selectedCam, profiles, videoFullConfig, newVideoConfig;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        selectedCam = this.cams[this.getIndexCam(config.camId)];
                        return [4 /*yield*/, selectedCam.camera.getVideoConfig()];
                    case 1:
                        profiles = _a.sent();
                        videoFullConfig = profiles[0];
                        videoFullConfig.resolution = config.resolution;
                        videoFullConfig.rateControl.frameRateLimit = config.fps;
                        videoFullConfig.rateControl.bitrateLimit = config.bitrate;
                        return [4 /*yield*/, selectedCam.camera.setVideoConfig(videoFullConfig)];
                    case 2:
                        newVideoConfig = _a.sent();
                        return [2 /*return*/, newVideoConfig];
                }
            });
        });
    };
    cctvDevice.prototype.ptz = function (hostname, value) {
        var index = this.getIndexCam(hostname);
        console.log(index);
        if (value == 0) {
            this.cams[index].camera.stop();
        }
        else if (value == 1) {
            this.cams[index].camera.move(0, 1, 0, "move up");
        }
        else if (value == 2) {
            this.cams[index].camera.move(0, -1, 0, "move down");
        }
        else if (value == 3) {
            this.cams[index].camera.move(-1, 0, 0, "move left");
        }
        else if (value == 4) {
            this.cams[index].camera.move(1, 0, 0, "move right");
        }
        else if (value == 5) {
            this.cams[index].camera.move(-1, 1, 0, "move left up");
        }
        else if (value == 6) {
            this.cams[index].camera.move(-1, -1, 0, "move left down");
        }
        else if (value == 7) {
            this.cams[index].camera.move(1, 1, 0, "move right up");
        }
        else if (value == 8) {
            this.cams[index].camera.move(1, -1, 0, "move right down");
        }
        else if (value == 9) {
            this.cams[index].camera.move(0, 0, -1, "zoom out");
        }
        else if (value == 10) {
            this.cams[index].camera.move(0, 0, 1, "zoom in");
        }
    };
    cctvDevice.prototype.setTimer = function (camId, timer) {
        var _this = this;
        var selectedCam = this.cams[this.getIndexCam(camId)];
        try {
            clearInterval(selectedCam.interval);
            selectedCam.interval = setInterval(function () {
                _this.uploadSnapshot(camId);
            }, timer);
            console.log(selectedCam.interval);
            return true;
        }
        catch (error) {
            console.log(error);
            if (selectedCam.interval) {
                clearInterval(selectedCam.interval);
            }
            selectedCam.interval = setInterval(function () {
                _this.uploadSnapshot(camId);
            }, 90000);
            return false;
        }
    };
    return cctvDevice;
}());
exports.cctvDevice = cctvDevice;
