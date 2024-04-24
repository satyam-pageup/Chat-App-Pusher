export const APIRoutes = {

    sendNotification:"https://fcm.googleapis.com/fcm/send",    
    register: "/registration",
    login: '/user/login',
    updateSystemToken: '/UpdateSystemToken',
    getChatList: '/CommunityMessage/GetChatBox',
    deleteMessage: '/CommunityMessage/DeleteMessage',
    getAllEmployee: '/UserEmployees',
    isTyping:(receiverId: number) => `/ChatTriggered/TriggeredByTyping/${receiverId}`,
    blockUser:(receiverId: number) => `/BlockUser/BlockUser/${receiverId}`,
    unBlockUser:(receiverId: number) => `/BlockUser/RemoveBlocked/${receiverId}`,
    sendMessage: (receiverId: number) => `/CommunityMessage/SendMessage/${receiverId}`,
    getMessageById: (id: number) => `/CommunityMessage/DisplayMessage/${id}`,
    deleteConversationById: (id: number) => `/CommunityMessage/DeleteConversation/${id}`,
    updateUserStatus: (receiverId: number) => `/ChatTriggered/TriggeredBySeen/${receiverId}`
}