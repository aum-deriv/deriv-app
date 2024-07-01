import React from 'react';
import classNames from 'classnames';
import { ModalStepWrapper } from '../../../../components';
import { THooks } from '../../../../types';
import { VerifyPersonalDetails } from './components';

const DocumentService = ({ service }: { service: keyof THooks.POI['services'] }) => {
    const isOnfido = service === 'onfido';

    return (
        <ModalStepWrapper>
            <div
                className={classNames('wallets-document-service', {
                    'wallets-document-service--reverse': isOnfido,
                })}
            >
                <VerifyPersonalDetails />
            </div>
        </ModalStepWrapper>
    );
};

export default DocumentService;
