import { IService } from "../interface-service";

export interface ICameraService extends IService {
    getCameraIPAddress(): string;
}
