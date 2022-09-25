import { TYPES } from "../application/constants/types";
import { IMQTTClient } from "./mqtt/interface-mqtt-client";
import { MQTTClient } from "./mqtt/mqtt-client";
import { CameraService } from "../application/services/camera/camera-service";
import { ICameraService } from "../application/services/camera/interface-camera-service";
import { ICctvDevice } from "./cctv/interface-cctv-device";
import { cctvController1 } from "./cctv/cctv-class";




import { ContainerModule } from "inversify";

import "./controllers/camera-controller";
import "./controllers/cctv-controller"


export const referenceDataIoCModule = new ContainerModule((bind) => {
    bind<ICameraService>(TYPES.CameraService).to(CameraService).inSingletonScope();
    bind<IMQTTClient>(TYPES.MQTTClient).to(MQTTClient).inSingletonScope();

    bind<ICctvDevice>(TYPES.CvtvCamera).to(cctvController1).inSingletonScope();
});
