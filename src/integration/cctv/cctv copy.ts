var onvif = require("onvif");

export class CCTV {
    public cam: any;
    constructor() {
        // this.cam = null;
    }
    /** Connect to camera */
    public init(hostname: string, username: string, password: string, port: number) {
        var camInfo = {
            hostname,
            username,
            password,
            port,
        };
        return new Promise((resolve, reject) => {
            let camInfor = new onvif.Cam(camInfo, (err: any) => {
                if (err) {
                    console.log("1", err.message);
                    reject(err);
                }
                resolve(camInfor);
                // console.log("1.........", camInfor);

            });

        });
    }

    public getStreamUrlcam() {
        return new Promise((resolve, reject) => {
            try {
                this.cam.getStreamUri({ protocol: "RTSP" }, function (err: any, info: any) {
                    if (!err) {
                        resolve(info.uri);
                    }
                });
            } catch (err: any) {
                reject(err.message);
            }
        });
    }

    public getSnapshot() {
        return new Promise((resolve, reject) => {
            try {
                this.cam.getSnapshotUri(function (err: any, info: any) {

                    if (!err) {
                        resolve(info);
                        console.log("3..........", info);
                    }
                });
            } catch (err) {
                reject(err);
            }
        });
    }
    public getVideoConfig() {
        return new Promise((resolve, reject) => {
            try {
                this.cam.getVideoEncoderConfigurations(function (err: any, info: any) {
                    if (!err) {
                        resolve(info);
                    }
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    public setVideoConfig(config: any) {
        return new Promise((resolve, reject) => {
            try {
                this.cam.setVideoEncoderConfiguration(config, function (err: any, info: any) {
                    if (!err) {
                        resolve(info);
                    }
                });
            } catch (err) {
                reject(err);
            }
        });
    }
    public move(x_speed: number, y_speed: number, zoom_speed: number, msg: string) {
        // Move the camera
        this.cam.continuousMove(
            {
                x: x_speed, // Speed of pan (in the range of -1.0 to 1.0)
                y: y_speed, // Speed of tilt (in the range of -1.0 to 1.0)
                zoom: zoom_speed, // Speed of zoom (in the range of -1.0 to 1.0)
            },
            // completion callback function
            function (err: any) {
                if (err) {
                    console.log(err.message);
                } else {
                    console.log("command sent " + msg);
                }
            }
        );
    }

    public stop() {
        // send a stop command, stopping Pan/Tilt and stopping zoom
        console.log("Sending stop command");
        this.cam.stop({ panTilt: true, zoom: true }, function (err: any) {
            if (err) {
                console.log(err.message);
            } else {
                console.log("stop command sent");
            }
        });
    }
    setIntervalTimer(timer: any) {
        return new Promise((resolve, reject) => {
            try {
                resolve(this.cam);
            } catch (error) {
                reject(error);
            }
        });
    }
}