import { Model } from "./model";
import { DistrictModel } from "./district-model";

export interface VillageModel extends Model {
    name: string;
    code: string;
    district_id: string;
    district?: DistrictModel;
}

