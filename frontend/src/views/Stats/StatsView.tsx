import React, { useEffect } from 'react';
import { Col, Container, Row, Title } from '@dataesr/react-dsfr';
import { useDispatch, useSelector } from 'react-redux';
import { getContactedOwnersCount } from '../../store/actions/statisticAction';
import { ApplicationState } from '../../store/reducers/applicationReducers';


const StatsView = () => {

    const dispatch = useDispatch();

    const { contactedOwnersCount } = useSelector((state: ApplicationState) => state.statistic);


    useEffect(() => {
        dispatch(getContactedOwnersCount());
    }, [dispatch])

    return (
        <>
            <Container spacing="py-4w mb-4w">
                <Title as="h1">
                    Statistiques
                </Title>
                <Row>
                    <Col>
                        <Title as="h2" look="h4">
                            Nombre de propriétaires contactés
                            <br />
                            {contactedOwnersCount}
                        </Title>
                    </Col>
                    <Col>
                        <Title as="h2" look="h4">
                            Situations en cours de modifications
                        </Title>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default StatsView;

