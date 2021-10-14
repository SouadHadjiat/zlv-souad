import React, { ChangeEvent, useState } from 'react';
import { Button, Modal, ModalClose, ModalContent, ModalFooter, ModalTitle, Text, TextInput } from '@dataesr/react-dsfr';


const CampaignCreationModal = ({housingCount, ownerCount, onSubmit, onClose}: {housingCount: number, ownerCount: number, onSubmit: (name: string) => void, onClose: () => void}) => {

    const [campaignName, setCampaignName] = useState('');
    const [campaignNameError, setCampaignNameError] = useState<string>();

    const create = () => {
        setCampaignNameError(undefined);
        if (!campaignName.length) {
            setCampaignNameError('Le nom de la campagne est obligatoire');
        } else {
            onSubmit(campaignName);
        }
    }

    return (
        <Modal isOpen={true}
               hide={() => onClose()}
               data-testid="campaign-creation-modal">
            <ModalClose hide={() => onClose()} title="Fermer la fenêtre">Fermer</ModalClose>
            <ModalTitle>Créer la campagne</ModalTitle>
            <ModalContent>
                <Text size="md">
                    <div>{housingCount} logements</div>
                    <div>{ownerCount} propriétaires</div>
                </Text>
                <TextInput
                    value={campaignName}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setCampaignName(e.target.value)}
                    required
                    label="Nom de la campagne"
                    hint="20 caractères maximum"
                    maxLength="20"
                    messageType={campaignNameError ? 'error' : ''}
                    message={campaignNameError}
                    data-testid="campaign-name-input"
                />
            </ModalContent>
            <ModalFooter>
                <Button title="title"
                        secondary
                        className="fr-mr-2w"
                        onClick={() => onClose()}>
                    Annuler
                </Button>
                <Button title="title"
                        onClick={() => create()}
                        data-testid="create-button">
                    Enregistrer
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default CampaignCreationModal;

