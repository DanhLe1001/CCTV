import { CCTV } from './cctv';
import { cctvHelper } from "./cctv-helper";
import { CCTVStreaming } from "./stream-Handler";
// import { CCTVStreaming } from "./cctv-streaming1";
var util = require('util')

const axios = require("axios");
// import axios from 'axios';
const FormData = require("form-data");
const fs = require('fs');
var util = require('util');
// import * as fs from 'fs';



export class cctvDevice {
    protected cams: any;
    constructor() {
        this.cams = [];

    }
    public async connectCam(hostname: string, username: string, password: string, port: number) {
        let currentTry: number = 0;
        while (true) {
            try {
                var camera = new CCTV();
                var camIndex = this.getIndexCam(hostname);
                if (camIndex >= 0) {
                    this.cams[camIndex].camera = camera;
                } else {
                    var newCam: any = {
                        hostname: hostname,
                        username: username,
                        password: password,
                        camera: camera,
                        streamPid: null,
                        rtspUrl: null,
                        interval: null,
                    };
                    this.cams.push(newCam);
                }
                camIndex = this.getIndexCam(hostname);
                this.cams[camIndex].camera.cam = await camera.init(hostname, username, password, port);
                console.log("connected to camera");

                var rtsp = await this.getStreamUrl(hostname);


                // var rtsp = "rtsp://192.168.1.3/Streaming/Channels/101?transportmode=unicast&profile=Profile_1";
                this.cams[camIndex].rtspUrl = cctvHelper.mergeStreamUrl(rtsp, username, password);
                // this.cams[camIndex].rtspUrl = "rtsp://tuannm:abcd1234@192.168.1.3/Streaming/Channels/101?transportmode=unicast&profile=Profile_1"
                // this.cams[camIndex].interval = setInterval(() => {
                //     this.uploadSnapshot(this.cams[camIndex].hostname);
                // }, 9000);
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
        // setTimeout(() => {
        this.cams[camIndex].streamPid = stream.stream();
        // }, 2000);
    }

    public disconnect(hostname: string, rtmp: string) {
        let camIndex: number = this.getIndexCam(hostname);
        let stream: CCTVStreaming = new CCTVStreaming(this.cams[camIndex].rtspUrl, rtmp, 5);
        stream.disconnect()
    }
    public getIndexCam(hostname: string): number {
        return this.cams.findIndex((cam: any) => cam.hostname === hostname);
    }
    public async getStreamUrl(camId: string) {
        var temp: CCTV = await this.cams[this.getIndexCam(camId)].camera.getStreamUrlcam();
        return temp;
    }
    public async uploadSnapshot(camId: any) {
        let selectedCam = this.cams[this.getIndexCam(camId)];
        let snapshot = await selectedCam.camera.getSnapshot();
        let data = new FormData();
        let temp = snapshot.mimeType.split("/");
        let tempSnapshotFolder = `./temp-snapshots/${camId}`;
        let currentTime = Date.now();
        let tempImageName = `${tempSnapshotFolder}/${currentTime}.${temp[temp.length - 1]}`;
        fs.mkdirSync(tempSnapshotFolder, { recursive: true });
        var writeStream = fs.createWriteStream(tempImageName);
        writeStream.write(snapshot);
        writeStream.write(snapshot, (err: any) => {
            if (!err) {
                writeStream.destroy();
                fs.readdirSync(tempSnapshotFolder).forEach((file: any) => {
                    let filePath = `${tempSnapshotFolder}/${file}`;
                    data.append("snapshot", fs.createReadStream(filePath));
                });

                var config = {
                    method: "post",
                    url: `http://112.78.1.209:3000/camera/${camId}`,
                    headers: {
                        ...data.getHeaders(),
                    },
                    data: data,
                };

                axios(config)
                    .then(async function (response: any) {
                        fs.rmSync(tempSnapshotFolder, { force: true, recursive: true });
                    })
                    .catch(function (error: any) {
                        console.log("error", error);
                    });
            } else {
                console.log(err);
            }
        });
    }
    public async getVideoConfig(camId: string) {
        let selectedCam = this.cams[this.getIndexCam(camId)];
        let profiles = await selectedCam.camera.getVideoConfig();
        let videoFullConfig = profiles[0];
        let videoConfig = {
            fps: videoFullConfig.rateControl.frameRateLimit,
            resolution: videoFullConfig.resolution,
            bitrate: videoFullConfig.rateControl.bitrateLimit,
        };
        return videoConfig;
    }
    public async setVideoConfig(config: any) {
        let selectedCam = this.cams[this.getIndexCam(config.camId)];
        let profiles = await selectedCam.camera.getVideoConfig();
        let videoFullConfig = profiles[0];
        videoFullConfig.resolution = config.resolution;
        videoFullConfig.rateControl.frameRateLimit = config.fps;
        videoFullConfig.rateControl.bitrateLimit = config.bitrate;

        var newVideoConfig = await selectedCam.camera.setVideoConfig(videoFullConfig);
        return newVideoConfig;
    }
    public ptz(hostname: string, value: number) {
        const index = this.getIndexCam(hostname);
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
    public setTimer(camId: any, timer: any) {
        let selectedCam = this.cams[this.getIndexCam(camId)];
        try {
            clearInterval(selectedCam.interval);
            selectedCam.interval = setInterval(() => {
                this.uploadSnapshot(camId);
            }, timer);
            console.log(selectedCam.interval);
            return true;
        } catch (error) {
            console.log(error);
            if (selectedCam.interval) {
                clearInterval(selectedCam.interval);
            }
            selectedCam.interval = setInterval(() => {
                this.uploadSnapshot(camId);
            }, 90000);
            return false;
        }
    }
}