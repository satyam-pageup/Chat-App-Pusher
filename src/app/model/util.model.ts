export interface NumberString{
    id: number;
    data: string;
}
export interface IUpdateChatList{
    receiverId: number;
    message: string;
    dateTime: string;
}

export interface IMedia{
    base64: string;
    name: string;
}

export interface IUserStatus{
    status: boolean;
    triggeredId: string;
}