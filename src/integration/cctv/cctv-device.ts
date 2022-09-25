var onvif = require("onvif");

/**
 * CCTV Device
 * Store the information of CCTV device
 */
export class CCTVDevice {
    /** Keep the cctv devic which has been connected */
    private cctvDevice: any = null;

    private hostName: string = "";
    private userName: string = "";
    private password: string = "";
    private port: number = 8899; // just make default value port most of use

    private rtspUri: string = "";

    constructor(hostName: string, userName: string, password: string, port: number) {
        this.hostName = hostName;
        this.userName = userName;
        this.password = password;
        this.port = port;
    }

    /**
     * Connect to CCTV Device
     * @returns
     */
    public async connect(): Promise<void> {
        this.cctvDevice = await new Promise((resolve: any, reject: any) => {
            let retCCTVInformation: any = new onvif.Cam(
                {
                    hostname: this.hostName,
                    username: this.userName,
                    password: this.password,
                    port: this.port,
                },
                (error: Error) => {
                    if (error) {
                        reject(error);
                    }

                    resolve(retCCTVInformation);
                }
            );
            return retCCTVInformation;
        });
        this.rtspUri = await this.getStreamUri();
        console.log(this.rtspUri);
    }

    /**
     * Get RTSP Stream Uri of CCTV device
     * @returns
     */
    public async getStreamUri(): Promise<string> {
        return new Promise((resolve: any, reject: any) => {
            this.cctvDevice.getStreamUri({ protocol: "RTSP" }, (error: any, stream: any) => {
                if (!error) {
                    resolve(stream.uri);
                } else {
                    reject(error);
                }
            });
        });
    }

    public move(x_speed: number, y_speed: number, zoom_speed: number, msg: string): void {
        // Move the camera
        this.cctvDevice.continuousMove(
            {
                x: x_speed, // Speed of pan (in the range of -1.0 to 1.0)
                y: y_speed, // Speed of tilt (in the range of -1.0 to 1.0)
                zoom: zoom_speed, // Speed of zoom (in the range of -1.0 to 1.0)
            },
            // completion callback function
            (error: any): void => {
                if (error) {
                    console.log(error.message);
                } else {
                    console.log("command sent " + msg);
                }
            }
        );
    }

    /**
     * Disconnect cctv device stream
     */
    public disconnect(): void {
        // TODO:
    }
}
