import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Formik, FormikValues } from 'formik';
import { useOnfido } from '@deriv/api-v2';
import { TSocketError } from '@deriv/api-v2/types';
import { LegacyArrowLeft2pxIcon } from '@deriv/quill-icons';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Loader, Text } from '@deriv-com/ui';
import { InlineMessage, ModalStepWrapper } from '../../../../../../components';
import { useVerifyPersonalDetails, VerifyPersonalDetails } from '../VerifyPersonalDetails';
import './Onfido.scss';

type TOnfidoProps = {
    onClickBack?: VoidFunction;
    onCompletion?: VoidFunction;
};

const Onfido: React.FC<TOnfidoProps> = ({ onClickBack, onCompletion }) => {
    const { localize } = useTranslations();
    const { data: onfidoData, isLoading: isOnfidoLoading } = useOnfido();
    const { hasSubmitted: isOnfidoSubmissionSuccessful, onfidoContainerId } = onfidoData;
    const [errorVerifyPersonalDetails, setErrorVerifyPersonalDetails] =
        useState<TSocketError<'set_settings'>['error']>();
    const {
        initialValues: initialPersonalDetailsValues,
        isLoading: isPersonalDetailsDataLoading,
        isSubmitted: isPersonalDetailsSubmitted,
        submit: submitPersonalDetails,
    } = useVerifyPersonalDetails();

    const isLoading = isPersonalDetailsDataLoading || isOnfidoLoading;

    useEffect(() => {
        if (isOnfidoSubmissionSuccessful && isPersonalDetailsSubmitted && onCompletion) {
            onCompletion();
        }
    }, [isOnfidoSubmissionSuccessful, isPersonalDetailsSubmitted, onCompletion]);

    const onSubmit = async (values: FormikValues) => {
        try {
            await submitPersonalDetails(values);
        } catch (error) {
            setErrorVerifyPersonalDetails(error as TSocketError<'set_settings'>['error']);
        }
    };

    if (isLoading) return <Loader />;

    return (
        <ModalStepWrapper disableAnimation={!!onClickBack} title={localize('Add a real MT5 account')}>
            {onClickBack && (
                <button className='wallets-onfido__back-button' onClick={onClickBack}>
                    <LegacyArrowLeft2pxIcon iconSize='xs' />
                    <Text weight='bold'>
                        <Localize i18n_default_text='Back' />
                    </Text>
                </button>
            )}
            <div className='wallets-onfido'>
                {!isPersonalDetailsSubmitted && (
                    <Formik initialValues={initialPersonalDetailsValues} onSubmit={onSubmit}>
                        {({ handleSubmit }) => {
                            return (
                                <VerifyPersonalDetails
                                    error={errorVerifyPersonalDetails}
                                    onVerification={handleSubmit}
                                />
                            );
                        }}
                    </Formik>
                )}
                <div
                    className={classNames('wallets-onfido__wrapper', {
                        'wallets-onfido__wrapper--animate': isPersonalDetailsSubmitted,
                    })}
                >
                    <div className='wallets-onfido__wrapper-onfido-container' id={onfidoContainerId} />
                    {!isPersonalDetailsSubmitted ? (
                        <div className='wallets-onfido__wrapper-overlay'>
                            <InlineMessage
                                message={localize('Hit the checkbox above to choose your document.')}
                                size='sm'
                                type='information'
                            />
                        </div>
                    ) : (
                        <InlineMessage
                            message={localize('Your personal details have been saved successfully.')}
                            size='sm'
                            type='announcement'
                        />
                    )}
                </div>
            </div>
        </ModalStepWrapper>
    );
};

export default Onfido;
