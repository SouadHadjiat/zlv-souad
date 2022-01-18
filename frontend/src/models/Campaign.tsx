import { HousingFilters } from './HousingFilters';

export interface DraftCampaign {
    startMonth: string;
    reminderNumber: number;
    filters: HousingFilters;
}

export interface Campaign {
    id: string;
    campaignNumber: number;
    startMonth: string;
    reminderNumber: number;
    name: string;
    filters: HousingFilters;
    createdAt: Date;
    validatedAt?: Date;
    exportedAt?: Date;
    sentAt?: Date;
    housingCount: number;
    waitingCount: number;
    inProgressCount: number;
    notVacantCount: number;
    noActionCount: number;
    exitCount: number;
    ownerCount: number;
}

export enum CampaignSteps {
    OwnersValidation, Export, Sending, InProgess
}

export const campaignNumberSort = (c1: Campaign, c2: Campaign) => {
    return c1.campaignNumber < c2.campaignNumber ? -1 :
        c1.campaignNumber > c2.campaignNumber ? 1 : 0
}

export const campaignStep = (campaign?: Campaign) => {
    return (!campaign?.validatedAt) ? CampaignSteps.OwnersValidation :
        !campaign?.exportedAt ? CampaignSteps.Export :
            !campaign?.sentAt ? CampaignSteps.Sending :
                CampaignSteps.InProgess
}
