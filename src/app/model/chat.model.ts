export interface ChatBoxI {
    // employeeId: number;
    // employeeName: string;
    lastMessage: string;
    lastMessageDate: string;
    isSeen: boolean
    newMessages: number;
    recieverId: number;
    recieverName: string;
    lastActive: string;
    isGroup: boolean;
}
export class ChatBoxC {
    employeeId: number = 0;
    employeeName: string = '';
    lastMessage: string = '';
    lastMessageDate: string='';    
    isSeen: boolean = false;
    newMessages: number = 0;
    recieverId: number = 0;
    recieverName: string = '';
    lastActive: string = '';
}

export interface MessageI{
    id: number;
    message: string;
    name: string;
    userType: string;
    senderId: number;
    isSeen: boolean;
    messageDate: string;
    receiverId: number;
}
export interface IGetMessage{
    id: number;
    message: string;
    name: string;
    userType: string;
    senderId: number;
    status: number;
    receiverId: number;
    messageDate: string;
}


export interface MessageNewI{
    id: number;
    message: string;
    name: string;
    userType: string;
    senderId: number;
    isSeen: boolean;
    status: "sending" | "failed" | "success" | "seen" | "unseen" | "";
    messageDate: string;
}
