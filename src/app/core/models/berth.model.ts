import { PortModel } from "./port.model";

export type BerthModel = {
    berthId?: number;
    name: string;
    addrCoordinates: string;
    portId:PortModel;
    length: number;
    width: number;
    depth:number;
}

export interface BerthTable {
    items: BerthModel[];
    noFiltered: number;
    noTotal: number;
}