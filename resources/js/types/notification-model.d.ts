import { Model } from "./model";

export interface NotificationModel extends Model {
    id: string; // uuid
    type: string;
    notifiable_type: string;
    notifiable_id: number;
    data: {
        title: string;
        body: string;
        action_url?: string | null;
        sender_id?: number | null;
    };
    read_at?: string | null;
    created_at: string;
    updated_at: string;
}


