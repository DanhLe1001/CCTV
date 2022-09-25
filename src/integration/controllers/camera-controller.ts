import { TYPES } from "../../application/constants/types";
import { ICameraService } from "../../application/services/camera/interface-camera-service";
import { inject } from "inversify";
import { controller, httpGet } from "inversify-express-utils";
import { IMQTTClient } from "../mqtt/interface-mqtt-client";
import { TopicHelper } from "../../application/helpers/topic-helper";
var onvif = require("onvif");

@controller("/v1/api/camera")
export class CameraController {
    @inject(TYPES.CameraService)
    private cameraService!: ICameraService;

    @inject(TYPES.MQTTClient)
    private mqttClient!: IMQTTClient;

    @httpGet("/say-hello")
    public async sayHello() {
        //console.log(this.mqttClient);
        this.mqttClient.connect();
        this.mqttClient.register(TopicHelper.ID_TOPIC_MOVE_DOWN, this.callbackFn);
        let name = this.cameraService.getCameraIPAddress();
        return "Hello Everyone. Nice to see you all " + name;
    }
    public callbackFn(payload: any): void {
        console.log("RUN CALLBACK" + payload);
    }

    @httpGet("/get-mqtt-status")
    public async getStatusClient() {
        this.mqttClient.send(TopicHelper.ID_TOPIC_MOVE_DOWN, "HELLO");
        return this.mqttClient.getStatus();
    }

    @httpGet("/load-plugin")
    public async loadPlugin() {
        const glob = require("glob");
        // var Plugins = {};
        glob("./plugins/*.js", { cwd: __dirname }, function (err: any, files: any) {
            console.log(files);
            // files.forEach(function (file: any) {
            //     var plugin = require(file);
            //     //Plugins[plugin.name] = plugin;
            //     console.log(plugin);
            // });
        });
        return "kdsjflks";
    }

    @httpGet("/discovery")
    public doDiscovery() {
        let abc = onvif.Discovery.probe(function (err: any, cams: any) {
            console.log("In Camera Probe");
            // function will be called only after timeout (5 sec by default)
            if (err) {
                // There is a device on the network returning bad discovery data
                // Probe results will be incomplete
                console.log("ERRRO");
                console.log(err);
                throw err;
            }
            console.log("OUT");
            console.log(cams);
            cams.forEach(function (cam: any) {
                console.log(cam);
            });
            return cams;
        });
        return abc;
    }
}
