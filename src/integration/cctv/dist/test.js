"use strict";
exports.__esModule = true;
exports.CCTVStreaming = void 0;
var fs = require("fs");
var CCTVStreaming = /** @class */ (function () {
    function CCTVStreaming() {
        this.data = fs.readFileSync('./empirestate.txt', 'utf8');
        this.string = this.data.split("\n");
        this.cmd = [];
        this.test = [];
        this.rmtp = "123456789";
        this.cmd.push(this.string);
    }
    CCTVStreaming.prototype.exStream = function () {
        this.test.push(this.cmd[0][0]);
        var string1 = this.cmd[0][0].split(" ");
        this.test.push(string1);
        console.log(this.test[0][0]);
        this.rmtp = this.test[0][0];
        fs.readFile('empirestate.txt', 'utf-8', function (err, data) {
            if (err)
                throw err;
            var newValue = data.replace(/b/gim, 'abcd');
            fs.writeFile('abc.txt', newValue, 'utf-8', function (err) {
                if (err)
                    throw err;
                console.log('Done!');
            });
        });
    };
    return CCTVStreaming;
}());
exports.CCTVStreaming = CCTVStreaming;
var a = new CCTVStreaming();
a.exStream();
// a.disconnect();
