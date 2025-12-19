import { Model } from "./model";
import { UserModel } from "./user-model";

export interface MailLogModel extends Model {
    user_id: number;
    recipients: string[];
    subject: string;
    message: string;
    status: 'sent' | 'failed';
    error?: string;
    user?: UserModel;
}

