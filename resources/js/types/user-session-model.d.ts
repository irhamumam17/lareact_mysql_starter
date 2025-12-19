import { Model } from "./model";

export interface UserSessionModel extends Model {
    user_id: number;
    session_id: string;
    ip_address?: string | null;
    user_agent?: string | null;
    browser?: string | null;
    device?: string | null;
    last_activity?: string | null;
    revoked_at?: string | null;
    user?: {
        id: number;
        name: string;
        email: string;
    };
}


