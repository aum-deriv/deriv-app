import React, { useEffect } from 'react';
import classNames from 'classnames';
import { useFormikContext } from 'formik';
import { useOnfido, usePOA } from '@deriv/api-v2';
import { InlineMessage } from '../../../../components';
import { VerifyDocumentDetails } from '../../../accounts';
import './Onfido.scss';

const Onfido = () => {
    const {
        data: { hasSubmitted, onfidoContainerId, onfidoRef },
        isServiceTokenLoading,
    } = useOnfido();
    // const { switchScreen } = useFlow;
    const { data: poaStatus } = usePOA();
    const { setFieldValue, values } = useFormikContext();
    // if the user goes back and already submitted Onfido, check the form store first

    useEffect(() => {
        if (hasSubmitted) {
            setFieldValue('hasSubmittedOnfido', hasSubmitted);
            onfidoRef?.current?.safeTearDown();
            // @ts-expect-error as the prop verified_jurisdiction is not yet present in GetAccountStatusResponse type
            // if (!poaStatus?.is_pending && !poaStatus?.verified_jurisdiction?.[formValues.selectedJurisdiction]) {
            //     switchScreen('poaScreen');
            // } else {
            //     switchScreen('poiPoaDocsSubmitted');
            // }
        }
    }, [hasSubmitted, poaStatus, values.selectedJurisdiction, setFieldValue, onfidoRef]);

    return (
        <div className='wallets-onfido'>
            <VerifyDocumentDetails />
            {!isServiceTokenLoading && (
                <div
                    className={classNames('wallets-onfido__wrapper', {
                        'wallets-onfido__wrapper--animate': values.verifiedDocumentDetails,
                    })}
                >
                    <div className='wallets-onfido__wrapper-onfido-container' id={onfidoContainerId} />
                    {!values.verifiedDocumentDetails ? (
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
    );
};

export default Onfido;
