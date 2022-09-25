import { cctvDevice } from "./cctv-device(box)";
import * as mqtt from 'mqtt';
import { ICctvDevice } from './interface-cctv-device';
import { injectable } from "inversify";
import { CCTVStreaming } from "./stream-Handler";



// @injectable()
export class cctvController1 implements ICctvDevice {
    protected device: any;
    protected client: any;
    constructor() {
        this.device = new cctvDevice();
    }
    public async connect() {
        console.log("Connecting");
        this.client = mqtt.connect("tcp://broker.mqttdashboard.com");
        this.client.on("connect", async () => {
            console.log("MQTT Connected");
            await this.device.connectCam("192.168.1.3", "tuannm", "abcd1234", 80);
            console.log(`Connect to camera : 192.168.1.3`);

            await this.device.startStream("192.168.1.3", "rtmp://127.0.0.1:1935/app/OvenMediaEngine");

            setTimeout(() => {
                this.device.disconnect("192.168.1.3", "rtmp://127.0.0.1:1935/app/OvenMediaEngine");
                console.log("device disconnected\n");
            }, 15000);
            this.client.subscribe(["v1/gateway/ptz", "v1/gateway/rpc/get-config", "v1/gateway/rpc/set-config", "v1/gateway/rpc/set-timer"]);
        });

        this.client.on("message", async (topic: string, payload: any) => {
            try {
                console.log("Receive : | " + topic + " | " + payload);
                var request = JSON.parse(payload);
                // Received command
                // PTZ
                if (topic === "v1/gateway/ptz") {
                    this.device.ptz(request.hostname, request.ptzValue);
                }
                // CONFIG
                if (topic === "v1/gateway/rpc/get-config") {
                    let videoConfig = await this.device.getVideoConfig(request.camId);
                    this.client.publish("v1/gateway/rpc/get-config/res", JSON.stringify(videoConfig));
                }
                if (topic === "v1/gateway/rpc/set-config") {
                    let videoConfig1 = await this.device.setVideoConfig(request);
                    this.client.publish(
                        "v1/gateway/rpc/set-config/res",
                        JSON.stringify({
                            bitrate: videoConfig1.rateControl.bitrateLimit,
                            fps: videoConfig1.rateControl.frameRateLimit,
                            resolution: videoConfig1.resolution,
                        })
                    );
                }
                if (topic === "v1/gateway/rpc/set-timer") {
                    let isSuccess = this.device.setTimer(request.camId, request.timer);
                    if (isSuccess) {
                        this.client.publish("v1/gateway/rpc/set-timer/res", JSON.stringify({ message: "OK" }));
                    } else {
                        this.client.publish("v1/gateway/rpc/set-timer/res", JSON.stringify({ message: "FAIL" }));
                    }
                }
            } catch (err) {
                console.log(err);
            }
        });
    }
}

var a = new cctvController1();
a.connect();