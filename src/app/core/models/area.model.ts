import { PortModel } from "./port.model";

export type AreaModel = {
    id?: number; 
    areaId?: number;
    name: string;
    port:PortModel;
}

export interface AreaTable {
    items: AreaModel[];
    noFiltered: number;
    noTotal: number;
}

export interface AreaCustomField {
    customField: number;
    name: string;
    value: string | string[] | number;
}

