import { Owner } from './Owner';
import { Address } from './Address';
import { HousingStatus } from './HousingState';

export interface Housing {
    id: string;
    invariant: string;
    rawAddress: string[];
    address: Address;
    latitude?: number;
    longitude?: number;
    owner: Owner;
    livingArea: number;
    housingKind: string;
    roomsCount: number;
    buildingYear?: number;
    vacancyStartYear: number;
    vacancyReasons: string[];
    dataYears: number[];
    campaignIds: string[];
    status?: HousingStatus;
    subStatus?: string;
    precision?: string;
}

export interface SelectedHousing {
    all: boolean;
    ids: string[];
}

export interface HousingUpdate {
    status: HousingStatus,
    subStatus?: string,
    precision?: string,
    contactKind?: string,
    vacancyReasons?: string[],
    comment?: string
}

export const selectedHousingCount = (selectedHousing: SelectedHousing, totalCount: number) => {
    return selectedHousing.all ? totalCount - selectedHousing.ids.length : selectedHousing.ids.length
}

export const HousingSort = (h1: Housing, h2: Housing) =>
    Math.max(...h1.dataYears) === Math.max(...h2.dataYears) ?
        h1.invariant.localeCompare(h2.invariant) :
        Math.max(...h1.dataYears) - Math.max(...h2.dataYears);
