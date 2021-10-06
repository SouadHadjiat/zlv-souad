import React, { ChangeEvent, useEffect, useState } from 'react';

import { Button, Checkbox, Col, Container, Row, Table, Tag, Text, Title } from '@dataesr/react-dsfr';
import { useDispatch, useSelector } from 'react-redux';
import { ApplicationState } from '../../store/reducers/applicationReducers';
import { Housing } from '../../models/Housing';
import { capitalize } from '../../utils/stringUtils';
import LoadingBar from 'react-redux-loading-bar';
import styles from './housing-list.module.scss';
import HousingListFilterMenu from './HousingListFilterMenu';
import { updateWithValue } from '../../utils/arrayUtils';
import AppSearchBar from '../../components/AppSearchBar/AppSearchBar';
import { Link } from 'react-router-dom';
import { searchHousing } from '../../store/actions/housingAction';


const HousingListView = () => {

    const dispatch = useDispatch();

    const maxRecords = 500;

    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState<number>(50);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const { housingList } = useSelector((state: ApplicationState) => state.housing);

    useEffect(() => {
        setSelectedIds([]);
    }, [housingList])

    const currentPageIds = (checked: boolean) => {
        if (checked) {
            return housingList.map(_ => _.id).slice((page - 1) * perPage, page * perPage);
        } else {
            return[];
        }
    }

    const columns: any[] = [
        {
            name: 'select',
            headerRender: () =>
                <Checkbox onChange={(e: ChangeEvent<any>) => setSelectedIds(currentPageIds(e.target.checked))}
                          className={selectedIds.length > 0 && selectedIds.length < perPage ? styles.indeterminate : ''}
                          label="">
                </Checkbox>,
            render: ({ id }: Housing) =>
                <Checkbox value={id}
                          onChange={(e: ChangeEvent<any>) => setSelectedIds(updateWithValue(selectedIds, e.target.value, e.target.checked))}
                          checked={selectedIds.indexOf(id) !== -1}
                          label="">
                </Checkbox>
        },
        {
            name: 'address',
            label: 'Adresse',
            render: ({ address, municipality }: Housing) =>
                <>
                    <div className="capitalize">{capitalize(address)}</div>
                    <div>{capitalize(municipality)}</div>
                </>
        },
        {
            name: 'owner',
            label: 'Propriétaire',
            render: ({ ownerFullName }: Housing) => capitalize(ownerFullName)
        },
        {
            name: 'tags',
            label: 'Caractéristiques',
            render: ({ tags }: Housing) => tags.map(tag => <Tag key={tag}>{tag}</Tag>)
        },
        {
            name: 'view',
            headerRender: () => '',
            render: ({ ownerId }: Housing) =>
                <Link title="Voir" to={'/proprietaires/' + ownerId} className="ds-fr--inline fr-link">
                    Voir<span className="ri-1x icon-right ri-arrow-right-line ds-fr--v-middle"></span>
                </Link>
        }
    ];

    return (
        <Container spacing="py-4w">
            <Row className="fr-grid-row--center">
                <Col n="3">
                    <HousingListFilterMenu></HousingListFilterMenu>
                </Col>
                <Col>
                    <Title as="h1">Logements</Title>
                    <Row>
                        <Col n="6">
                            <AppSearchBar onSearch={(input: string) => {dispatch(searchHousing(input))}} />
                        </Col>

                    </Row>
                    <LoadingBar className={styles.loading} updateTime={100} maxProgress={100} progressIncrease={10}/>
                    <Text className="fr-my-2w">
                        <b>{housingList.length >= maxRecords ? 'Plus de ' + maxRecords : housingList.length }</b> logements
                    </Text>
                    { housingList && housingList.length > 0 &&
                        <Table
                            caption="Logements"
                            captionPosition="none"
                            rowKey="id"
                            data={housingList}
                            columns={columns}
                            pagination
                            paginationPosition="center"
                            setPage={setPage} page={page}
                            perPage={perPage}
                            fixedLayout={true}
                            className="zlv-table-with-view zlv-table-with-select"
                        />
                    }
                    <div style={{textAlign: 'center'}}>
                        <Button
                            onClick={() => setPerPage(20)}
                            secondary
                            disabled={perPage === 20}
                            title="title">20 résultats par pages
                        </Button>
                        <Button
                            onClick={() => setPerPage(50)}
                            className="fr-mx-3w"
                            secondary
                            disabled={perPage === 50}
                            title="title">50 résultats par pages
                        </Button>
                        <Button
                            onClick={() => setPerPage(100)}
                            secondary
                            disable={perPage === 100}
                            title="title">100 résultats par pages
                        </Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default HousingListView;

