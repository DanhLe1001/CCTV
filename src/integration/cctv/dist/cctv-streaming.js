"use strict";
exports.__esModule = true;
exports.CCTVStreaming = void 0;
var child_process_1 = require("child_process");
var fs = require("fs");
var CCTVStreaming = /** @class */ (function () {
    function CCTVStreaming() {
        this.data = fs.readFileSync('./streamFile.txt', 'utf8');
        this.split = this.data.split("\n");
        this.cmd = [];
        this.checkOs = process.platform;
        this.countRetry = 0;
        this.cmd.push(this.split);
    }
    CCTVStreaming.prototype.exStream = function () {
        var _this = this;
        child_process_1.exec(this.cmd[0][0], function (error) {
            if (error) {
                console.error("not connect stream");
                if (_this.countRetry < 5) {
                    setTimeout(function () {
                        _this.countRetry++;
                        _this.exStream();
                        console.log("retry count: " + _this.countRetry);
                    }, 5000);
                }
                return;
            }
        });
    };
    CCTVStreaming.prototype.disconnect = function () {
        if (this.checkOs == "darwin") {
            console.log("this OS is MacOS");
            child_process_1.exec(this.cmd[0][1], function (error) {
                if (error) {
                    console.error("could not execute command: ", error);
                    return;
                }
            });
        }
        else if (this.checkOs == "linux") {
            console.log("this OS is linux");
            child_process_1.exec(this.cmd[0][2], function (error) {
                if (error) {
                    console.error("could not execute command: ", error);
                    return;
                }
            });
        }
        else if (this.checkOs == "win32" || this.checkOs == "win64") {
            console.log("this OS is windows");
            child_process_1.exec(this.cmd[0][3], function (error) {
                if (error) {
                    console.error("could not execute command: ", error);
                    return;
                }
            });
        }
    };
    return CCTVStreaming;
}());
exports.CCTVStreaming = CCTVStreaming;
