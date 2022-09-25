var onvif = require("onvif");
//import "onvif";

export class Camera {

    constructor() {

    }

    public async init(hostname: any, username: any, password: any, port: any) {
        var camInfo = {
            hostname,
            username,
            password,
            port,
        };
        return new Promise((resolve, reject) => {
            new onvif.Cam(camInfo, function (err: any) {
                if (err) {
                    reject(err);
                }

                resolve(camInfo);
                //console.log("1", typeof this);
            });
        });
    }
}