import { CCTVDevice } from './cctv-device';
import { cctvHelper } from "./cctv-helper";
import { CCTVStreaming } from "./stream-Handler";
const axios = require("axios");
const FormData = require("form-data");
const fs = require('fs');

export class cctvDevice {
    protected cams: any;
    constructor() {
        this.cams = [];
    }
    public async connectCam(hostname: string, username: string, password: string, port: number) {
        let currentTry: number = 0;
        while (true) {
            try {
                let camera: CCTVDevice = new CCTVDevice(hostname, username, password, port);
                let camIndex: number = this.getIndexCam(hostname);
                if (camIndex >= 0) {
                    this.cams[camIndex].camera = camera;
                } else {
                    let newCam: any = {
                        hostname: hostname,
                        username: username,
                        password: password,
                        camera: camera,
                        // streamPid: null,
                        rtspUrl: null,
                        // interval: null,
                    };
                    this.cams.push(newCam);
                }
                camIndex = this.getIndexCam(hostname);
                this.cams[camIndex].camera.cam = await camera.connect();
                let rtsp: string = await this.getStreamUrl(hostname);
                this.cams[camIndex].rtspUrl = cctvHelper.mergeStreamUrl(rtsp, username, password);
                return true;
            } catch (error: any) {
                console.log(error.message);
                currentTry++;
                console.log(`Failed attempt ${currentTry} `);
                if (currentTry >= 5) {
                    console.log("Retry maximum reached. Exiting");
                    break;
                }
            }
        }
    }

    public async startStream(hostname: string, rtmp: string): Promise<void> {
        let camIndex: number = this.getIndexCam(hostname);
        let stream: CCTVStreaming = new CCTVStreaming(this.cams[camIndex].rtspUrl, rtmp, 5);
        // await stream.fileHandle();
        setTimeout(() => {
            this.cams[camIndex].streamPid = stream.stream();
        }, 2000);
    }

    public disconnect(hostname: string, rtmp: string) {
        let camIndex: number = this.getIndexCam(hostname);
        let stream: CCTVStreaming = new CCTVStreaming(this.cams[camIndex].rtspUrl, rtmp, 5);
        stream.disconnect()
    }

    public getIndexCam(hostname: string): number {
        return this.cams.findIndex((cam: any) => cam.hostname === hostname);
    }
    public async getStreamUrl(camId: string): Promise<string> {
        var temp: string = await this.cams[this.getIndexCam(camId)].camera.getStreamUrlcam();
        return temp;
    }

    public ptz(hostname: string, value: number) {
        let index: number = this.getIndexCam(hostname);
        console.log(index);
        if (value == 0) {
            this.cams[index].camera.stop();
        } else if (value == 1) {
            this.cams[index].camera.move(0, 1, 0, "move up");
        } else if (value == 2) {
            this.cams[index].camera.move(0, -1, 0, "move down");
        } else if (value == 3) {
            this.cams[index].camera.move(-1, 0, 0, "move left");
        } else if (value == 4) {
            this.cams[index].camera.move(1, 0, 0, "move right");
        } else if (value == 5) {
            this.cams[index].camera.move(-1, 1, 0, "move left up");
        } else if (value == 6) {
            this.cams[index].camera.move(-1, -1, 0, "move left down");
        } else if (value == 7) {
            this.cams[index].camera.move(1, 1, 0, "move right up");
        } else if (value == 8) {
            this.cams[index].camera.move(1, -1, 0, "move right down");
        } else if (value == 9) {
            this.cams[index].camera.move(0, 0, -1, "zoom out");
        } else if (value == 10) {
            this.cams[index].camera.move(0, 0, 1, "zoom in");
        }
    }
}