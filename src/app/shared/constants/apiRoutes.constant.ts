export const APIRoutes = {

    sendNotification:"https://fcm.googleapis.com/fcm/send",    
    register: "/registration",
    login: '/user/login',
    updateSystemToken: '/UpdateSystemToken',
    getChatBox: '/CommunityMessage/GetChatBox',
    deleteMessage: '/CommunityMessage/DeleteMessage',
    getAllEmployee: '/UserEmployees',
    blockUser:(receiverId: number) => `/BlockUser/BlockUser/${receiverId}`,
    unBlockUser:(receiverId: number) => `/BlockUser/RemoveBlocked/${receiverId}`,
    sendMessage: (receiverId: number) => `/CommunityMessage/SendMessage/${receiverId}`,
    getMessageById: (id: number) => `/CommunityMessage/DisplayMessage/${id}`,


}