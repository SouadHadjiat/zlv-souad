import React from 'react';
import { Col, Container, Row, Text, Title } from '@dataesr/react-dsfr';
import building from '../../assets/images/building.svg'
import new_message from '../../assets/images/new_message.svg'
import people_search from '../../assets/images/people_search.svg'
import sync_files from '../../assets/images/sync_files.svg'
import statistic_chart from '../../assets/images/statistic_chart.svg'
import location_review from '../../assets/images/location_review.svg'
import real_time_collaboration from '../../assets/images/real_time_collaboration.svg'
import quote from '../../assets/images/quote.svg'
import collaboration from '../../assets/images/collaboration.svg'
import { Link } from 'react-router-dom';
import styles from './home.module.scss';


const HomeView = () => {

    return (
        <>
            <Container spacing="py-4w mb-4w">
                <Title as="h1" look="h4">
                    Vous êtes une collectivité ?
                </Title>
                <Row>
                    <Col>
                        <Title as="h2">
                            Diminuez la vacance de logements sur votre territoire
                        </Title>
                        <Text size="lg">
                            Zéro Logement Vacant aide les collectivités à mobiliser les propriétaires de logements vacants et à mieux les accompagner dans la remise sur le marché de leur logement.
                        </Text>
                        <Link title="S'inscrire" to={{ pathname: "https://www.demarches-simplifiees.fr/commencer/mad-donnees-lovac" }} target="_blank" className="fr-btn--md fr-btn">
                            S&apos;inscrire
                        </Link>
                    </Col>
                    <Col>
                        <img src={building} style={{maxWidth: "max-content"}} alt=""/>
                    </Col>
                </Row>
            </Container>
            <div className="bg-bf975">
                <Container spacing="py-4w mb-4w">
                    <Row>
                        <Col>
                            <Title as="h2" look="h4">
                                Concrètement, comment ça fonctionne ?
                            </Title>
                        </Col>
                    </Row>
                    <Row gutters>
                        <Col>
                            <div>
                                <img src={people_search} height="100%" alt=""/>
                            </div>
                            <Text size="lg">
                                Repérez et caractérisez les logements vacants puis élaborez votre stratégie de prise de contact des propriétaires.
                            </Text>
                        </Col>
                        <Col>
                            <div>
                                <img src={new_message} height="100%" alt=""/>
                            </div>
                            <Text size="lg">
                                Contactez les propriétaires en utilisant les messages les plus adaptés grâce à notre guide et notre base de courriers.
                            </Text>
                        </Col>
                        <Col>
                            <div>
                                <img src={sync_files} height="100%" alt=""/>
                            </div>
                            <Text size="lg">
                                Suivez chaque dossier avec votre équipe, étape par étape, jusqu’à la sortie de vacance du logement.
                            </Text>
                        </Col>
                    </Row>
                </Container>
            </div>
            <Container spacing="py-4w mb-4w">
                <Row>
                    <Col>
                        <Title as="h2" look="h4">
                            Les avantages de Zéro Logement Vacant
                        </Title>
                    </Col>
                </Row>
                <Row gutters>
                    <Col>
                        <div>
                            <img src={statistic_chart} height="100%" alt=""/>
                        </div>
                        <Title as="h3" look="h6">
                            Une vision globale de votre territoire
                        </Title>
                        <Text size="lg">
                            Accédez à la base de tous les logements vacants ainsi qu’à des statistiques agrégées sur votre activité
                        </Text>
                    </Col>
                    <Col>
                        <div>
                            <img src={location_review} height="100%" alt=""/>
                        </div>
                        <Title as="h3" look="h6">
                            Un historique du logement exhaustif
                        </Title>
                        <Text size="lg">
                            Ne perdez plus aucune information sur les logements, vos échanges avec les propriétaires
                        </Text>
                    </Col>
                    <Col>
                        <div>
                            <img src={collaboration} height="100%" alt=""/>
                        </div>
                        <Title as="h3" look="h6">
                            Un suivi centralisé des dossiers
                        </Title>
                        <Text size="lg">
                            Grâce au travail collaboratif et aux accès partenaires, suivez tous les dossiers au même endroit
                        </Text>
                    </Col>
                    <Col>
                        <div>
                            <img src={real_time_collaboration} height="100%" alt=""/>
                        </div>
                        <Title as="h3" look="h6">
                            Un accès à une large communauté de partage
                        </Title>
                        <Text size="lg">
                            Profitez de l’expérience de toute une communauté : bonnes pratiques, courriers envoyés...
                        </Text>
                    </Col>
                </Row>
            </Container>
            <div className="bg-bf975">
                <Container spacing="py-4w mb-4w">
                    <Row>
                        <Col>
                            <Title as="h2" look="h4">
                                Ce que notre communauté en dit
                            </Title>
                        </Col>
                    </Row>
                    <Row gutters>
                        <Col className={styles.quotation}>
                            <img src={quote} alt=""/>
                            <Text size="lg">
                                « Mettre témoignage avec accompagnement équipe. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dignissim cursus at ullamcorper mauris non. Integer aliquam. »
                            </Text>
                        </Col>
                        <Col className={styles.quotation}>
                            <img src={quote} alt=""/>
                            <Text size="lg">
                                « Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dignissim cursus at ullamcorper mauris non. collaboration chargés mission / opérateurs »
                            </Text>
                        </Col>
                        <Col className={styles.quotation}>
                            <img src={quote} alt=""/>
                            <Text size="lg">
                                « Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dignissim cursus at ullamcorper mauris non. Enclencher pol publique vacance avec tous acteurs concernés dont élus »
                            </Text>
                        </Col>
                    </Row>
                    <Row gutters justifyContent="center" className="fr-pt-2w">
                        <Link title="Rejoindre la communauté" to={{ pathname: "https://www.demarches-simplifiees.fr/commencer/mad-donnees-lovac" }} target="_blank" className="fr-btn--md fr-btn">
                            Rejoindre la communauté
                        </Link>
                    </Row>
                </Container>
            </div>
            <div className={styles.ownerContainer}>
                <Container spacing="py-4w mb-4w">
                    <Title as="h1" look="h4">
                        Vous êtes propriétaire ?
                    </Title>
                    <Row gutters>
                        <Col>
                            Vous avez reçu un courrier alors que votre logement n’est pas vacant ?
                        </Col>
                        <Col>
                            Votre logement est inoccupé et vous souhaitez connaître les aides financières disponibles ?
                        </Col>
                        <Col>
                            Vous souhaitez bénéficier d’un accompagnement personnalisé pour remettre votre logement sur le marché ?
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
};

export default HomeView;

