export const APIRoutes = {

    sendNotification:"https://fcm.googleapis.com/fcm/send",    
    register: "/registration",
    login: '/user/login',
    updateSystemToken: '/UpdateSystemToken',
    getChatList: '/CommunityMessage/GetChatBox',
    deleteMessage: '/CommunityMessage/DeleteMessage',
    getAllEmployee: '/UserEmployees',
    isTyping:(receiverId: number,isTyping:boolean) => `/ChatTriggered/TriggeredByTyping/${receiverId}?status=${isTyping}`,
    blockUser:(receiverId: number) => `/BlockUser/BlockUser/${receiverId}`,
    unBlockUser:(receiverId: number) => `/BlockUser/RemoveBlocked/${receiverId}`,
    sendMessage: (receiverId: number) => `/CommunityMessage/SendMessage/${receiverId}`,
    getMessageById: (id: number, isGroup:boolean) => `/CommunityMessage/DisplayMessage/${id}/${isGroup}`,
    deleteConversationById: (id: number) => `/CommunityMessage/DeleteConversation/${id}`,
    updateUserStatus: (receiverId: number) => `/ChatTriggered/TriggeredBySeen/${receiverId}`
}