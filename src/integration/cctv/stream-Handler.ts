import { exec } from "child_process";
import * as fs from 'fs';

export class CCTVStreaming {
    private retryCount: number;
    private checkOs: string = process.platform;
    private currentTry: number = 0;
    private RTSP: string;
    private RTMP: string;

    constructor(RTSP: string, RTMP: string, retryCount: number) {
        this.retryCount = retryCount;
        this.RTSP = RTSP;
        this.RTMP = RTMP;
        this.fileHandler();
    }
    public fileHandler(): string[] {
        let data: string = fs.readFileSync('./streamFile.txt', 'utf8');
        let split: string[] = data.split("\n");
        return split;
    }
    public stream(): void {
        let cmdArr: string[] = this.fileHandler();
        let replace: string = cmdArr[0].replace('RTSPCCTV', this.RTSP);
        let cmdStream: string = replace.replace('RTMPCCTV', this.RTMP);
        exec(cmdStream, (error: any) => {
            if (error) {
                console.error("not connection to stream");
                if (this.currentTry < this.retryCount) {
                    this.currentTry++;
                    console.log(`retryconnect count: ${this.currentTry}`);
                    this.stream();
                }
                return;
            }
        })
    }

    public disconnect(): void {
        this.currentTry = 0;
        let cmdArr: string[] = this.fileHandler();
        if (this.checkOs == "darwin") {
            console.log("this OS is MacOS");
            exec(cmdArr[1], (error: any) => {
                if (error) {
                    console.error("could not execute command: ", error)
                    return;
                }
            });
        }
        else if (this.checkOs == "linux") {
            console.log("this OS is linux");
            exec(cmdArr[2], (error: any) => {
                if (error) {
                    console.error("could not execute command: ", error)
                    return;
                }
            });
        }
        else if (this.checkOs == "win32" || this.checkOs == "win64") {
            console.log("this OS is windows");
            exec(cmdArr[3], (error: any) => {
                if (error) {
                    console.error("could not execute command: ", error)
                    return;
                }
            });
        }

        // else if (this.checkOs == "win32" || this.checkOs == "win64") {
        //     console.log("this OS is windows");
        //     let dataCmd: string[] = [];
        //     let data: string[] = [];
        //     exec("tasklist | more", (error: any, stdout: string) => {
        //         if (error) throw error.message;
        //         dataCmd = stdout.split("\n");
        //         var dataArr: any[] = [];
        //         for (let i = 2; i < dataCmd.length - 1; i++) {
        //             data = dataCmd[i].split(" ").filter((data: any) => data !== "");
        //             if (data[0] == "chrome.exe") {
        //                 dataArr.push(data);
        //             }
        //         }
        //         console.log("1......................", dataArr[dataArr.length - 1][1])
        //         process.kill(Number(dataArr[dataArr.length - 1][1]))
        //     });
        // }
    }
}
