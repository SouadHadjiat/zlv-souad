import { Request, Response } from 'express';
import addressService from '../services/addressService';
import housingRepository from '../repositories/housingRepository';
import { HousingApi, HousingUpdateApi } from '../models/HousingApi';
import { HousingFiltersApi } from '../models/HousingFiltersApi';
import campaignRepository from '../repositories/campaignRepository';
import ExcelJS from 'exceljs';
import { AddressApi } from '../models/AddressApi';
import localityRepository from '../repositories/localityRepository';
import { RequestUser, UserRoles } from '../models/UserApi';
import { OwnerApi } from '../models/OwnerApi';
import ownerRepository from '../repositories/ownerRepository';
import eventRepository from '../repositories/eventRepository';
import { EventApi, EventKinds } from '../models/EventApi';
import campaignHousingRepository from '../repositories/campaignHousingRepository';
import { Request as JWTRequest } from 'express-jwt';
import { getHousingStatusApiLabel } from '../models/HousingStatusApi';
import exportFileService from '../services/exportFileService';

const get = async (request: Request, response: Response): Promise<Response> => {

    const id = request.params.id;

    console.log('Get housing', id)

    return housingRepository.get(id)
        .then(_ => response.status(200).json(_));
}

const list = async (request: JWTRequest, response: Response): Promise<Response> => {

    console.log('List housing')

    const page = request.body.page;
    const perPage = request.body.perPage;
    const role = (<RequestUser>request.auth).role;
    const establishmentId = (<RequestUser>request.auth).establishmentId;
    const filters = <HousingFiltersApi> request.body.filters ?? {};

    return housingRepository.listWithFilters({...filters, establishmentIds: role === UserRoles.Admin && filters.establishmentIds?.length ? filters.establishmentIds : [establishmentId] }, page, perPage)
        .then(_ => response.status(200).json(_));
};

const listByOwner = async (request: JWTRequest, response: Response): Promise<Response> => {

    const ownerId = request.params.ownerId;
    const establishmentId = (<RequestUser>request.auth).establishmentId;

    console.log('List housing by owner', ownerId)

    return Promise.all([
        housingRepository.listWithFilters({establishmentIds: [establishmentId], ownerIds: [ownerId]}),
        housingRepository.countWithFilters({ownerIds: [ownerId]})
    ])
        .then(([list, totalCount]) => response.status(200).json({entities: list.entities, totalCount}));
};


const updateHousing = async (request: JWTRequest, response: Response): Promise<Response> => {

    const id = request.params.id;

    console.log('Update housing', id)

    const establishmentId = (<RequestUser>request.auth).establishmentId;
    const userId = (<RequestUser>request.auth).userId;
    const housingUpdateApi = <HousingUpdateApi>request.body.housingUpdate;

    const housing = await housingRepository.get(id);

    const campaignList = await campaignRepository.listCampaigns(establishmentId)

    const lastCampaignId = housing.campaignIds.length ?
        campaignList.filter(_ => housing.campaignIds.indexOf(_.id) !== -1).reverse()[0].id :
        campaignList.filter(_ => _.campaignNumber === 0)[0].id

    if (!housing.campaignIds.length) {
        await campaignHousingRepository.insertHousingList(lastCampaignId, [housing.id])
    }

    await eventRepository.insertList([<EventApi>{
        housingId: housing.id,
        ownerId: housing.owner.id,
        kind: EventKinds.StatusChange,
        campaignId: lastCampaignId,
        contactKind: housingUpdateApi.contactKind,
        content: [
            getStatusLabel(housing, housingUpdateApi),
            housingUpdateApi.comment
        ]
            .filter(_ => _ !== null && _ !== undefined)
            .join('. '),
        createdBy: userId
    }])

    const updatedHousingList = await housingRepository.updateHousingList(
        [housing.id],
        housingUpdateApi.status,
        housingUpdateApi.subStatus,
        housingUpdateApi.precisions,
        housingUpdateApi.vacancyReasons
    )

    return response.status(200).json(updatedHousingList);
};

const updateHousingList = async (request: JWTRequest, response: Response): Promise<Response> => {

    console.log('Update campaign housing list')

    const establishmentId = (<RequestUser>request.auth).establishmentId;
    const userId = (<RequestUser>request.auth).userId;
    const housingUpdateApi = <HousingUpdateApi>request.body.housingUpdate;
    const campaignIds = request.body.campaignIds;
    const allHousing = <boolean>request.body.allHousing;
    const housingIds = request.body.housingIds;
    const currentStatus = request.body.currentStatus;
    const query = request.body.query;

    const housingList =
        await housingRepository.listWithFilters( {establishmentIds: [establishmentId], campaignIds, status: [currentStatus], query})
            .then(_ => _.entities
                .filter(housing => allHousing ? housingIds.indexOf(housing.id) === -1 : housingIds.indexOf(housing.id) !== -1)
            );

    const campaignList = await campaignRepository.listCampaigns(establishmentId)

    await eventRepository.insertList(housingList.map(housing => (<EventApi>{
        housingId: housing.id,
        ownerId: housing.owner.id,
        kind: EventKinds.StatusChange,
        campaignId: campaignList.filter(_ => housing.campaignIds.indexOf(_.id) !== -1).reverse()[0].id,
        contactKind: housingUpdateApi.contactKind,
        content: [
            getStatusLabel(housing, housingUpdateApi),
            housingUpdateApi.comment
        ]
            .filter(_ => _ !== null && _ !== undefined)
            .join('. '),
        createdBy: userId
    })))

    const updatedHousingList = await housingRepository.updateHousingList(
        housingList.map(_ => _.id),
        housingUpdateApi.status,
        housingUpdateApi.subStatus,
        housingUpdateApi.precisions,
        housingUpdateApi.vacancyReasons
    )

    return response.status(200).json(updatedHousingList);
};

const getStatusLabel = (housingApi: HousingApi, housingUpdateApi: HousingUpdateApi) => {

    return (housingApi.status !== housingUpdateApi.status ||
        housingApi.subStatus != housingUpdateApi.subStatus ||
        housingApi.precisions != housingUpdateApi.precisions) ?
        [
            'Passage à ' + getHousingStatusApiLabel(housingUpdateApi.status),
            housingUpdateApi.subStatus,
            housingUpdateApi.precisions?.join(', ')
        ].filter(_ => _?.length).join(' - ') : undefined
}

const exportHousingByCampaignBundle = async (request: JWTRequest, response: Response): Promise<Response> => {

    const campaignNumber = request.params.campaignNumber;
    const reminderNumber = request.params.reminderNumber;
    const establishmentId = (<RequestUser>request.auth).establishmentId;

    console.log('Export housing by campaign bundle', establishmentId, campaignNumber, reminderNumber)

    const campaignApi = await campaignRepository.getCampaignBundle(establishmentId, campaignNumber, reminderNumber)

    if (!campaignApi) {
        return response.sendStatus(404)
    }

    const housingList = await housingRepository.listWithFilters( {establishmentIds: [establishmentId], campaignIds: campaignApi.campaignIds}).then(_ => _.entities)

    const fileName = `C${campaignApi.campaignNumber}.xlsx`;

    return await exportHousingList(housingList, fileName, response);

}

const exportHousingWithFilters = async (request: JWTRequest, response: Response): Promise<Response> => {

    console.log('Export housing with filters')

    const establishmentId = (<RequestUser>request.auth).establishmentId;

    const filters = <HousingFiltersApi> request.body.filters ?? {};
    const allHousing = request.body.allHousing;

    const userLocalities = await localityRepository.listByEstablishmentId(establishmentId).then(_ => _.map(_ => _.geoCode))
    const filterLocalities = (filters.localities ?? []).length ? userLocalities.filter(l => (filters.localities ?? []).indexOf(l) !== -1) : userLocalities

    const housingIds = allHousing ?
        await housingRepository.listWithFilters({...filters, establishmentIds: [establishmentId], localities: filterLocalities})
            .then(_ => _.entities
                .map(_ => _.id)
                .filter(id => request.body.housingIds.indexOf(id) === -1)
            ):
        request.body.housingIds;

    const housingList = await housingRepository.listByIds(housingIds)

    const fileName = `export_${(new Date()).toDateString()}.xlsx`;

    return await exportHousingList(housingList, fileName, response);

}

const exportHousingList = async (housingList: HousingApi[], fileName: string, response: Response): Promise<Response> => {

    const workbook = new ExcelJS.Workbook();
    const housingWorksheet = workbook.addWorksheet('Logements');
    const ownerWorksheet = workbook.addWorksheet('Propriétaires');

    housingWorksheet.columns = [
        { header: 'Invariant', key: 'invariant' },
        { header: 'Référence cadastrale', key: 'cadastralReference' },
        { header: 'Propriétaire', key: 'owner' },
        { header: 'Adresse LOVAC du propriétaire', key: 'ownerRawAddress' },
        { header: 'Adresse BAN du propriétaire - Numéro', key: 'ownerAddressHouseNumber' },
        { header: 'Adresse BAN du propriétaire - Rue', key: 'ownerAddressStreet' },
        { header: 'Adresse BAN du propriétaire - Code postal', key: 'ownerAddressPostalCode' },
        { header: 'Adresse BAN du propriétaire - Ville', key: 'ownerAddressCity' },
        { header: 'Adresse LOVAC du logement', key: 'housingRawAddress' },
        { header: 'Adresse BAN du logement', key: 'housingAddress' }
    ];

    housingList.map((housing: HousingApi) => {
        housingWorksheet.addRow({
            invariant: housing.invariant,
            cadastralReference: housing.cadastralReference,
            owner: housing.owner.fullName,
            ownerRawAddress: reduceRawAddress(housing.owner.rawAddress),
            ownerAddressHouseNumber: housing.owner.address.houseNumber,
            ownerAddressStreet: housing.owner.address.street,
            ownerAddressPostalCode: housing.owner.address.postalCode,
            ownerAddressCity: housing.owner.address.city,
            housingRawAddress: reduceRawAddress(housing.rawAddress),
            housingAddress: reduceAddressApi(housing.address)
        });
    })

    const housingListByOwner = housingList.reduce((ownersHousing: {owner: OwnerApi, housingList: HousingApi[]}[], housing) => [
        ...ownersHousing.filter(_ => _.owner.id !== housing.owner.id),
        {
            owner: housing.owner,
            housingList: [
                ...(ownersHousing.find(_ => _.owner.id === housing.owner.id)?.housingList ?? []),
                housing
            ]
        }
    ], [])

    const maxHousingCount = Math.max(...housingListByOwner.map(_ => _.housingList.length))

    ownerWorksheet.columns = [
        { header: 'Propriétaire', key: 'owner' },
        { header: 'Adresse LOVAC du propriétaire', key: 'ownerRawAddress' },
        { header: 'Adresse BAN du propriétaire - Numéro', key: 'ownerAddressHouseNumber' },
        { header: 'Adresse BAN du propriétaire - Rue', key: 'ownerAddressStreet' },
        { header: 'Adresse BAN du propriétaire - Code postal', key: 'ownerAddressPostalCode' },
        { header: 'Adresse BAN du propriétaire - Ville', key: 'ownerAddressCity' },
        ...[...Array(maxHousingCount).keys()].map(index => [
            { header: `Adresse LOVAC du logement ${index + 1}`, key: `housingRawAddress_${index}` },
            { header: `Adresse BAN du logement ${index + 1}`, key: `housingAddress_${index}` },
        ]).flat()
    ];

    housingListByOwner.map((ownerHousing: {owner: OwnerApi, housingList: HousingApi[]}) => {
        const row: any = {
            owner: ownerHousing.owner.fullName,
            ownerRawAddress: reduceRawAddress(ownerHousing.owner.rawAddress),
            ownerAddressHouseNumber: ownerHousing.owner.address.houseNumber,
            ownerAddressStreet: ownerHousing.owner.address.street,
            ownerAddressPostalCode: ownerHousing.owner.address.postalCode,
            ownerAddressCity: ownerHousing.owner.address.city,
        }

        ownerHousing.housingList.forEach((housing, index) => {
            row[`housingRawAddress_${index}`] = reduceRawAddress(ownerHousing.housingList[index]?.rawAddress);
            row[`housingAddress_${index}`] = reduceAddressApi(housing.address)
        })

        ownerWorksheet.addRow(row);
    })

    return exportFileService.sendWorkbook(workbook, fileName, response);

}

const normalizeAddresses = async (request: Request, response: Response): Promise<Response> => {

    console.log('Normalize address')

    const establishmentId = request.params.establishmentId;
    const page = request.params.page ? Number(request.params.page) : 1;
    const perPage = request.params.perPage ? Number(request.params.perPage) : 10000;

    const localities = await localityRepository.listByEstablishmentId(establishmentId)

    const housingList = await housingRepository.listWithFilters( {establishmentIds: [establishmentId], localities: localities.map(_ => _.geoCode)}, page, perPage)

    const housingAdresses = await addressService.normalizeAddresses(
        housingList.entities.map((housing: HousingApi) => ({
            addressId: housing.id,
            rawAddress: housing.rawAddress,
            inseeCode: housing.inseeCode
        }))
    )
    await housingRepository.updateAddressList(housingAdresses)

    const ownerAdresses = await addressService.normalizeAddresses(
        housingList.entities.map((housing: HousingApi) => ({
            addressId: housing.owner.id,
            rawAddress: housing.owner.rawAddress
        }))
    )

    await ownerRepository.updateAddressList(ownerAdresses)

    return response.sendStatus(200)

}


const reduceAddressApi = (addressApi?: AddressApi) => {
    return addressApi ? [addressApi.houseNumber, addressApi.street, addressApi.postalCode, addressApi.city].filter(_ => _).join(' ') : addressApi
}

const reduceRawAddress = (rawAddress?: string[]) => {
    return rawAddress ? rawAddress.filter(_ => _).join(String.fromCharCode(10)) : rawAddress
}

const housingController =  {
    get,
    list,
    listByOwner,
    updateHousing,
    updateHousingList,
    exportHousingByCampaignBundle,
    exportHousingWithFilters,
    normalizeAddresses
};

export default housingController;
