/**
 * Topic defined the name and functions of it
 */
export class TopicHelper {
    public static ID_TOPIC_MOVE_UP: string = "ID_TOPIC_MOVE_UP";
    public static ID_TOPIC_MOVE_DOWN: string = "ID_TOPIC_MOVE_DOWN";
    public static ID_TOPIC_MOVE_LEFT: string = "ID_TOPIC_MOVE_LEFT";
    public static ID_TOPIC_MOVE_RIGHT: string = "ID_TOPIC_MOVE_RIGHT";

    public static topicFunctionsMap: Map<string, any[]> = new Map<string, any[]>();

    /** Will be call once in mqtt client new */
    public static defineTopicFunctionsMap(): void {
        TopicHelper.topicFunctionsMap.set(this.ID_TOPIC_MOVE_UP, []);
        TopicHelper.topicFunctionsMap.set(this.ID_TOPIC_MOVE_DOWN, []);
        TopicHelper.topicFunctionsMap.set(this.ID_TOPIC_MOVE_LEFT, []);
        TopicHelper.topicFunctionsMap.set(this.ID_TOPIC_MOVE_RIGHT, []);
    }

    /**
     * Allow add new function for each TOPIC
     * @param topic -> name
     * @param callbackFn -> callback function
     */
    public static registerTopicFunctionMap(topic: string, callbackFn: any): void {
        let fn = TopicHelper.topicFunctionsMap.get(topic);
        if (fn) {
            fn.push(callbackFn);
            console.log(fn);
        }
    }

    public static getTopicFunctionsMap(topic: string): any[] | undefined {
        return TopicHelper.topicFunctionsMap.get(topic);
    }
}
