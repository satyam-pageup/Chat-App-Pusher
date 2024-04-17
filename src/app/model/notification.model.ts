export interface INotificationModel {
    notification: {
        title: string,
        body: string,
        userId: number,
    },
    to: string
}


export interface NotificationResponse{
    collapseKey: string;
    data: {
        [key: string]: string;
    },
    from: string;
    messageId: string;
    notification: {
        body: string;
        title: string;
        userId: number;
    }
}