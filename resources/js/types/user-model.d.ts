import { Model } from "./model";
import { RoleModel } from "./role-model";

export interface UserModel extends Model {
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    roles: RoleModel[];
}