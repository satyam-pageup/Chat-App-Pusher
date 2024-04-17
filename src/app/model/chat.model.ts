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
}