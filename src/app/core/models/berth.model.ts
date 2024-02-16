import { PortModel } from "./port.model";

export type BerthModel = {
    berthId?: number;
    name: string;
    berthStatus: string;
    addrCoordinates: string;
    port:PortModel;
    length: number;
    width: number;
    depth:number;
}

export interface BerthTable {
    items: BerthModel[];
    noFiltered: number;
    noTotal: number;
}