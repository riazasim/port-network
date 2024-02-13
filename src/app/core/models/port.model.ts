export type PortModel = {
    portId?: number;
    name: string;
    addrCoordinates: string;
    addrStreet: string;
    addrNumber: string;
    addrCity: string;
    addrCountry: string;
    addrCounty: string;
    addrZipCode: string;
    addrTimezone:string;
    contacts: ContactsModel[];
    imgPreview: File;
}

export interface PortTable {
    items: PortModel[];
    noFiltered: number;
    noTotal: number;
}

export type ContactsModel = {
   contactsIs?: number;
   name:string;
   capacity: number;
   occupiedCapacity: number;
   client: string;
   product: string;
}