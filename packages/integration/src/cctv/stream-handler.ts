import { spawn } from "child_process";

export class StreamHandler {
    protected cmd: string = "E:\\Cam\\cam\\cambox\\src\\ffmpeg.exe";
    protected RSTP: any;
    protected RTMP: any;

    constructor(RSTP: any, RTMP: any) {
        this.RSTP = RSTP;
        this.RTMP = RTMP;
    }

    public excute(): number | undefined {
        console.log(this.RSTP);
        const args = [
            "-rtsp_transport",
            "tcp",
            "-timeout",
            "2000000",
            "-i",
            this.RSTP,
            "-c:v",
            "copy",
            "-codec:a",
            "aac",
            //'-c', 'copy',
            "-preset",
            "ultrafast",
            // '-crf', '24',
            "-loglevel",
            "error",
            "-segment_list_flags",
            "+live",
            "-f",
            "flv",
            this.RTMP,
        ];
        console.log("\x1b[36m%s\x1b[0m", args.join(" "));
        const ls = spawn(this.cmd, args);

        ls.stdout.on("data", (data) => {
            console.log(`stdout: ${data}`);
        });

        ls.stderr.on("data", (data) => {
            console.error(`stderr: ${data}`);
        });

        ls.on("close", (code) => {
            console.log(`child process StreamHandler exited with code ${code}`);
        });
        return ls.pid;
    }
}