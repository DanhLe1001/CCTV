export class cctvHelper {
    public static mergeStreamUrl(streamUrl: any, username: string, password: string): any {
        return `${streamUrl.substr(0, 7)}${username}:${password}@${streamUrl.substr(7, streamUrl.length)}`;
    }
}