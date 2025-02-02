import React, { ChangeEvent, useEffect, useState } from 'react';

import { Button, Checkbox, Pagination, Table } from '@dataesr/react-dsfr';
import { Housing, SelectedHousing } from '../../models/Housing';
import { capitalize } from '../../utils/stringUtils';
import { Link, useLocation } from 'react-router-dom';
import { PaginatedResult } from '../../models/PaginatedResult';
import styles from './housing-list.module.scss';
import { HousingFilters } from '../../models/HousingFilters';
import classNames from 'classnames';
import { useCampaignList } from '../../hooks/useCampaignList';
import { CampaignNumberSort, campaignPartialName } from '../../models/Campaign';
import { getHousingState } from '../../models/HousingState';
import _ from 'lodash';


export enum HousingDisplayKey {
    Housing, Owner
}

const HousingList = (
    {
        paginatedHousing,
        onChangePagination,
        filters,
        displayKind,
        onSelectHousing,
        additionalColumns,
        tableClassName
    }: {
        paginatedHousing: PaginatedResult<Housing>,
        onChangePagination: (page: number, perPage: number) => void,
        filters?: HousingFilters,
        displayKind: HousingDisplayKey,
        onSelectHousing?: (selectedHousing: SelectedHousing) => void,
        additionalColumns?: any[],
        tableClassName?: string
    }) => {

    const location = useLocation();
    const campaignList = useCampaignList();

    const [checkedIds, setCheckedIds] = useState<string[]>([]);
    const [allChecked, setAllChecked] = useState<boolean>(false);

    const checkAll = (checked: boolean) => {
        const selectedHousing = {all: checked, ids: []}
        setAllChecked(selectedHousing.all);
        setCheckedIds(selectedHousing.ids);
        if (onSelectHousing) {
            onSelectHousing(selectedHousing)
        }
    }

    const checkOne = (id: string) => {
        const updatedCheckIds = (checkedIds.indexOf(id) === -1) ? [...checkedIds, id] : checkedIds.filter(f => f !== id)
        setCheckedIds(updatedCheckIds)
        if (onSelectHousing) {
            onSelectHousing({all: allChecked, ids: updatedCheckIds})
        }
    }

    useEffect(() => {
        if (filters) {
            setAllChecked(false)
            setCheckedIds([])
            if (onSelectHousing) {
                onSelectHousing({all: false, ids: []})
            }
        }
    }, [filters]) //eslint-disable-line react-hooks/exhaustive-deps

    const changePerPage = (perPage: number) => {
        onChangePagination(1, perPage)
    }

    const changePage = (page: number) => {
        onChangePagination(page, paginatedHousing.perPage)
    }

    const selectColumn = {
        name: 'select',
        headerRender: () =>
            <Checkbox onChange={(e: ChangeEvent<any>) => checkAll(e.target.checked)}
                      checked={(allChecked && checkedIds.length === 0) || (!allChecked && checkedIds.length === paginatedHousing.totalCount)}
                      className={checkedIds.length !== 0 ? styles.indeterminate : ''}
                      label="">
            </Checkbox>,
        render: ({ id }: Housing) =>
            <Checkbox value={id}
                      onChange={(e: ChangeEvent<any>) => checkOne(e.target.value)}
                      checked={(allChecked && checkedIds.indexOf(id) === -1) || (!allChecked && checkedIds.indexOf(id) !== -1)}
                      data-testid={'housing-check-' + id}
                      label="">
            </Checkbox>
    };

    const rowNumberColumn = {
        name: 'number',
        render: ({ rowNumber }: any) => <>#{rowNumber}</>
    }

    const addressColumn = {
        name: 'address',
        label: 'Adresse',
        render: ({ id, rawAddress }: Housing) =>
            <>
                {rawAddress.map((line, lineIdx) =>
                    <div key={id + '-rawAddress-' + lineIdx} className="capitalize">{capitalize(line)}</div>
                )}
            </>
    };

    const ownerColumn = {
        name: 'owner',
        label: 'Propriétaire',
        render: ({ owner }: Housing) =>
            <>
                <div>{owner.fullName}</div>
                {owner.administrator &&
                    <div>
                        ({owner.administrator})
                    </div>
                }
            </>
    };

    const ownerAddressColumn = {
        name: 'ownerAddress',
        label: 'Adresse du propriétaire',
        render: ({ owner }: Housing) =>
            <>
                {owner.rawAddress.map((line, lineIdx) =>
                    <div key={owner.id + '-rawAddress-' + lineIdx} className="capitalize">{capitalize(line)}</div>
                )}
            </>
    };

    const campaignColumn = {
        name: 'campaign',
        label: 'Campagne',
        render: ({ campaignIds, id } : Housing) =>
            <>
                {campaignIds?.length ?
                    _.uniq(campaignIds
                        .map(campaignId => campaignList?.find(c => c.id === campaignId))
                        .sort(CampaignNumberSort)
                        .map(campaign => campaign ? campaignPartialName(campaign?.startMonth, campaign?.campaignNumber) : '')
                    ).map((campaignName, campaignIdx) =>
                        <div key={id + '-campaign-' + campaignIdx}>
                            {campaignName}
                        </div>
                    ) :
                    'Jamais contacté'
                }
            </>
    };

    const statusColumn = {
        name: 'status',
        label: 'Statut',
        render: ({ status } : Housing) =>
            status &&
            <span style={{
                backgroundColor: `var(${getHousingState(status).bgcolor})`,
                color: `var(${getHousingState(status).color})`,
            }}
                  className='status-label'>
                {getHousingState(status).title}
            </span>

    };

    const viewColumn = {
        name: 'view',
        headerRender: () => '',
        render: ({ id }: Housing) =>
            <Link title="Afficher" to={location.pathname + '/logements/' + id} className="ds-fr--inline fr-link">
                Afficher<span className="ri-1x icon-right ri-arrow-right-line ds-fr--v-middle" />
            </Link>
    }

    const columns = () => {
        switch (displayKind) {
            case HousingDisplayKey.Housing :
                return [...onSelectHousing ? [selectColumn] : [], rowNumberColumn, addressColumn, ownerColumn, ownerAddressColumn, campaignColumn, statusColumn, ...additionalColumns ?? [], viewColumn];
            case HousingDisplayKey.Owner :
                return [...onSelectHousing ? [selectColumn] : [], rowNumberColumn, ownerColumn, { ...addressColumn, label: 'Logement' }, campaignColumn, ...additionalColumns ?? [], viewColumn];
        }
    }

    return (
        <>
            { paginatedHousing.entities?.length > 0 && <>
                <Table
                    caption="Logements"
                    captionPosition="none"
                    rowKey="id"
                    data={paginatedHousing.entities.map((_, index) => ({..._, rowNumber: (paginatedHousing.page - 1) * paginatedHousing.perPage + index + 1}) )}
                    columns={columns()}
                    fixedLayout={true}
                    className={classNames('zlv-table-with-view', 'with-row-number', { 'with-select': onSelectHousing }, tableClassName)}
                    data-testid="housing-table"
                />
                <div className="fr-react-table--pagination-center nav">
                    <Pagination onClick={changePage}
                                currentPage={paginatedHousing.page}
                                pageCount={Math.ceil(paginatedHousing.totalCount / paginatedHousing.perPage)}/>
                </div>
                <div style={{textAlign: 'center'}}>
                    <Button
                        onClick={() => changePerPage(50)}
                        secondary
                        disabled={paginatedHousing.perPage === 50}
                        title="Afficher 50 résultats par page">50 résultats par page
                    </Button>
                    <Button
                        onClick={() => changePerPage(200)}
                        className="fr-mx-3w"
                        secondary
                        disabled={paginatedHousing.perPage === 200}
                        title="Afficher 200 résultats par page">200 résultats par page
                    </Button>
                    <Button
                        onClick={() => changePerPage(500)}
                        secondary
                        disabled={paginatedHousing.perPage === 500}
                        title="Afficher 500 résultats par page">500 résultats par page
                    </Button>
                </div>
            </>}
        </>
    );
};

export default HousingList;

