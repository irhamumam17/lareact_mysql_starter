import { Model } from "./model";
import { ProvinceModel } from "./province-model";

export interface RegencyModel extends Model {
    name: string;
    code: string;
    province_id: string;
    province?: ProvinceModel;
}

