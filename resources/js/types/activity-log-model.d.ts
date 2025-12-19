import { Model } from "./model";

export interface ActivityLogModel extends Model {
    log_name?: string | null;
    description: string;
    subject_type?: string | null;
    subject_id?: number | string | null;
    causer_type?: string | null;
    causer_id?: number | null;
    event?: string | null;
    properties?: Record<string, any> | null;
    batch_uuid?: string | null;
    created_at: string;
    causer?: {
        id: number;
        name: string;
        email: string;
    } | null;
}


