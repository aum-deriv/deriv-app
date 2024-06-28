import React from 'react';
import classNames from 'classnames';
import { ModalStepWrapper } from '../../../../components';
import { THooks } from '../../../../types';
import { Onfido } from '../../../cfd/screens/Onfido';
import { IDVDocumentUpload } from '../IDVDocumentUpload';
import { VerifyDocumentDetails } from '../VerifyDocumentDetails';

const DocumentService = ({ service }: { service: keyof THooks.POI['services'] }) => {
    const isOnfido = service === 'onfido';
    const selectedService = isOnfido ? <Onfido /> : <IDVDocumentUpload />;

    return (
        <ModalStepWrapper>
            <div
                className={classNames('wallets-document-service', {
                    'wallets-document-service--reverse': isOnfido,
                })}
            >
                <VerifyDocumentDetails />
                {selectedService}
            </div>
        </ModalStepWrapper>
    );
};

export default DocumentService;
