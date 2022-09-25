import { IClientOptions, ClientSubscribeCallback } from "mqtt";
export interface IMQTTClient {
    connect(options?: IClientOptions): void;
    send(topic: string, data: any): void;
    register(topic: string, callbackFn?: ClientSubscribeCallback): void;
    recevie(): void;
    getStatus(): any;
}
