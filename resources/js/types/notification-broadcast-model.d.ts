interface NotificationBroadcastModel {
    id: string;
    title: string;
    body: string;
    action_url?: string | null;
    sender_id?: number | null;
    type: string;
}