
import { TYPES } from "../../application/constants/types";
import { controller, httpGet } from "inversify-express-utils";
import { ICctvDevice } from "integration/cctv/interface-cctv-device";
import { inject } from "inversify";
// var onvif = require("onvif");

@controller("/v1/api/cctv")
export class CctvController {

    @inject(TYPES.CvtvCamera)
    private cvtvCamera!: ICctvDevice;

    @httpGet("/test")
    public async test() {
        // let name = 
        console.log("mmmmmm");
        this.cvtvCamera.connect()
        //console.log(this.cvtvCamera);
        return "mmmmmm";
        //return this.CvtvCamera.connect();
    }
}