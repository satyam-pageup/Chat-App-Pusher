export interface ReceiveNotificationI{
        multicast_id: number,
        success: number,
        failure: number,
        canonical_ids: number,
        results: [
            {
                message_id: string
            }
        ]
}
