import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useInvalidateQuery, useOnfido } from '@deriv/api-v2';
import { InlineMessage, Loader, ModalStepWrapper } from '../../../../components';
import { VerifyDocumentDetails } from '../../../accounts';
import './Onfido.scss';

const Onfido = () => {
    const {
        data: { hasSubmitted, onfidoContainerId, onfidoRef },
        isServiceTokenLoading,
    } = useOnfido();
    const invalidate = useInvalidateQuery();
    const [areDetailsVerified, setAreDetailsVerified] = useState<boolean>(false);

    useEffect(() => {
        if (hasSubmitted) {
            onfidoRef?.current?.safeTearDown();
            invalidate('get_account_status');
        }
    }, [hasSubmitted, invalidate, onfidoRef]);

    return (
        <ModalStepWrapper title='Add a real MT5 account'>
            <div className='wallets-onfido'>
                <VerifyDocumentDetails
                    onVerified={() => {
                        setAreDetailsVerified(true);
                    }}
                />
                {isServiceTokenLoading ? (
                    <div className='wallets-onfido__loader'>
                        <Loader />
                    </div>
                ) : (
                    <div
                        className={classNames('wallets-onfido__wrapper', {
                            'wallets-onfido__wrapper--animate': areDetailsVerified,
                        })}
                    >
                        <div className='wallets-onfido__wrapper-onfido-container' id={onfidoContainerId} />
                        {!areDetailsVerified ? (
                            <div className='wallets-onfido__wrapper-overlay'>
                                <InlineMessage
                                    message='Hit the checkbox above to choose your document.'
                                    size='sm'
                                    type='information'
                                />
                            </div>
                        ) : (
                            <InlineMessage
                                message='Your personal details have been saved successfully.'
                                size='sm'
                                type='announcement'
                            />
                        )}
                    </div>
                )}
            </div>
        </ModalStepWrapper>
    );
};

export default Onfido;
