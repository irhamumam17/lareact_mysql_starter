import { Model } from "./model";
import { UserModel } from "./user-model";

export interface BlockedIpModel extends Model {
    ip_address: string | null;
    mac_address: string | null;
    type: 'ip' | 'mac';
    reason: string | null;
    description: string | null;
    is_active: boolean;
    expires_at: string | null;
    blocked_by: number | null;
    blocked_by_user?: UserModel;
}

