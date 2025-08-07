export type Subscription = {
    id?:string;
    sessionId?:string,
    userId:string,
    userEmail: string,
    type:"premium" | "free"
}