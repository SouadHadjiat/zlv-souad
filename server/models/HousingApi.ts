import { AddressApi } from './AddressApi';
import { OwnerApi } from './OwnerApi';
import { HousingStatusApi } from './HousingStatusApi';

export interface HousingApi {
    id: string;
    invariant: string,
    cadastralReference: string,
    inseeCode: string,
    rawAddress: string[];
    address: AddressApi;
    latitude?: number;
    longitude?: number;
    owner: OwnerApi;
    livingArea: number;
    housingKind: string;
    roomsCount: number;
    buildingYear?: number;
    vacancyStartYear: number;
    vacancyReasons: string[];
    campaignIds: string[];
    dataYears: number[];
    status?: HousingStatusApi;
    subStatus?: string;
    precision?: string;
}

export interface HousingUpdateApi {
    status: HousingStatusApi,
    subStatus?: string,
    precision?: string,
    contactKind: string,
    vacancyReasons?: string[],
    comment: string
}
