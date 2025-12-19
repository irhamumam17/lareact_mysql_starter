import { Model } from "./model";
import { UserModel } from "./user-model";

export interface RateLimitLogModel extends Model {
    ip_address: string;
    user_id: number | null;
    endpoint: string;
    method: string;
    attempts: number;
    key: string;
    severity: 'info' | 'warning' | 'critical';
    user_agent: string | null;
    blocked_until: string | null;
    auto_blocked: boolean;
    user?: UserModel;
}

export interface RateLimitStatistics {
    total_today: number;
    critical_today: number;
    auto_blocked_today: number;
    last_hour: number;
    last_24_hours: number;
    top_ips: Array<{
        ip_address: string;
        violation_count: number;
        total_attempts: number;
    }>;
    top_endpoints: Array<{
        endpoint: string;
        method: string;
        violation_count: number;
    }>;
}

