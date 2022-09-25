import { injectable } from "inversify";
import { ICameraService } from "./interface-camera-service";

@injectable()
export class CameraService implements ICameraService {
    public constructor() {
        console.log("[CONSTRUCTOR] - CameraService");
    }

    public getCameraIPAddress(): string {
        return "HERE is IP address";
    }
}
