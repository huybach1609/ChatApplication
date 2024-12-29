export class Message {
    constructor(sender, to, time, message, type) {
        this.sender = sender;
        this.to = to;
        this.time = time;
        this.message = message;
        this.type = type;
    }
}