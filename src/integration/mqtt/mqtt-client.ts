import { TopicHelper } from "../../application/helpers/topic-helper";
import { injectable } from "inversify";
import { MqttClient, connect, IClientOptions, ClientSubscribeCallback } from "mqtt";

@injectable()
export class MQTTClient {
    private client?: MqttClient;

    constructor() {
        /** Defined the empty topic functions */
        TopicHelper.defineTopicFunctionsMap();
    }

    /**
     * Connect to MQTT Server
     * @param options
     */
    public connect(options?: IClientOptions): void {
        // let serverAddress: string = process.env.MQTT_SERVER || "mqtt://127.0.0.1:1883";
        let serverAddress: string = process.env.MQTT_SERVER || "tcp://broker.mqttdashboard.com";

        if (!this.client) {
            if (!options) {
                /** Connect without options parameter */
                this.client = connect(serverAddress);
            } else {
                /** Connect with options parameter */
                this.client = connect(serverAddress, options);
            }
        }
        // Call this to make the MQTT message listener
        this.receivedMessage();
    }

    private receivedMessage(): void {
        this.client?.on("message", (topic, payload) => {
            console.log("Received Message:", topic, payload.toString());

            let fns = TopicHelper.getTopicFunctionsMap(topic);
            console.log("----------");
            fns?.forEach((element) => {
                element(payload);
            });
            console.log("----------");
        });
    }

    /**
     * Close MQTT Connection
     */
    public close(): void {
        if (this.client && this.client.connected) {
            this.client.end();
        }
    }

    /**
     * Publish data (message) into MQTT Server
     * @param topic -> Topic name
     * @param data -> data (message)
     */
    public send(topic: string, data: any): void {
        this.client?.publish(topic, data);
    }

    /**
     * Subcribe topic which can be recieve from MQTT Server
     * @param topic -> topic name
     */
    public register(topic: string, callbackFn?: ClientSubscribeCallback): void {
        this.client?.subscribe(topic);
        TopicHelper.registerTopicFunctionMap(topic, callbackFn);
        // this.client?.on("message", (topic, payload) => {
        //     console.log("Received Message:", topic, payload.toString());
        // });
    }
    public recevie(): void { }

    public getStatus(): any {
        console.log("ininininininiiiin :" + this.client?.connected);
        return this.client?.connected;
    }
}
