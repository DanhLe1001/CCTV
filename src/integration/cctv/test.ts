import { exec } from "child_process";
import * as fs from 'fs';

let dataCmd: string[] = [];
let data: string[] = [];
exec("tasklist | more", (error: any, stdout: string) => {
    if (error) throw error.message;
    dataCmd = stdout.split("\n");
    var dataArr: any[] = [];
    for (let i = 2; i < dataCmd.length - 1; i++) {
        data = dataCmd[i].split(" ").filter((data: any) => data !== "");
        if (data[0] == "chrome.exe") {
            dataArr.push(data);
        }
    }
    console.log(dataArr);

    console.log("1......................", dataArr[dataArr.length - 1][1])
    // process.kill(Number(dataArr[dataArr.length - 1][1]))
});