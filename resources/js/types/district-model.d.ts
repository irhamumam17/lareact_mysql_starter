import { Model } from "./model";
import { RegencyModel } from "./regency-model";

export interface DistrictModel extends Model {
    name: string;
    code: string;
    regency_id: string;
    regency?: RegencyModel;
}

