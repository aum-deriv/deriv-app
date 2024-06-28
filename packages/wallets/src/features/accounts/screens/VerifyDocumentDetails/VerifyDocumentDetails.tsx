import React, { useMemo } from 'react';
import classNames from 'classnames';
import { Field, Formik } from 'formik';
import moment from 'moment';
import { useSettings } from '@deriv/api-v2';
import { DerivLightNameDobPoiIcon } from '@deriv/quill-icons';
import { DatePicker, FormField, InlineMessage, ModalStepWrapper, WalletText } from '../../../../components';
import { getFormattedDateString } from '../../../../utils/utils';
import verifyPersonalDetailsValidationSchema from './verifyPersonalDetailsValidationSchema';
import './VerifyDocumentDetails.scss';

type TVerifyDocumentDetailsProps = {
    onVerified?: () => void;
};

const VerifyDocumentDetails: React.FC<React.PropsWithChildren<TVerifyDocumentDetailsProps>> = ({
    children,
    onVerified,
}) => {
    const { data: settings, update } = useSettings();
    const initialValues = useMemo(
        () => ({
            areDetailsVerified: false,
            dateOfBirth: getFormattedDateString(new Date(settings.date_of_birth ? settings.date_of_birth * 1000 : 0)),
            firstName: settings.first_name,
            lastName: settings.last_name,
        }),
        [settings.date_of_birth, settings.first_name, settings.last_name]
    );
    const isOnfido = onVerified;
    const dateDisplayFormat = 'DD-MM-YYYY';

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={() => {
                null;
            }}
            validationSchema={verifyPersonalDetailsValidationSchema}
        >
            {({ dirty, isValid, setFieldValue, values }) => {
                const handleTNCChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
                    if (event.target.checked && dirty && isOnfido && isValid && values.dateOfBirth) {
                        update({
                            date_of_birth: getFormattedDateString(values.dateOfBirth),
                            first_name: values.firstName,
                            last_name: values.lastName,
                        });
                        setFieldValue('areDetailsVerified', true);
                    }
                    if (onVerified) onVerified();
                };

                const handleDateChange = (dateString: string | null) => {
                    setFieldValue('dateOfBirth', dateString);
                };

                return (
                    <ModalStepWrapper title='Add a real MT5 account'>
                        <div
                            className={classNames('wallets-verify-document-details__wrapper', {
                                'wallets-verify-document-details__wrapper--reverse': !isOnfido,
                            })}
                        >
                            {values.areDetailsVerified && isOnfido && (
                                <div
                                    className='wallets-verify-document-details__placeholder'
                                    data-testid='dt_wallets_verify_document_details__placeholder'
                                />
                            )}
                            {!values.areDetailsVerified && (
                                <div className='wallets-verify-document-details'>
                                    <InlineMessage>
                                        <WalletText size='sm'>
                                            To avoid delays, enter your <strong>name</strong> and{' '}
                                            <strong>date of birth</strong> exactly as it appears on your identity
                                            document.
                                        </WalletText>
                                    </InlineMessage>
                                    <div className='wallets-verify-document-details__body'>
                                        <div className='wallets-verify-document-details__content'>
                                            <FormField
                                                disabled={values.areDetailsVerified}
                                                label='First name*'
                                                message='Your first name as in your identity document'
                                                name='firstName'
                                                showMessage
                                                width='100%'
                                            />
                                            <FormField
                                                disabled={values.areDetailsVerified}
                                                label='Last name*'
                                                message='Your last name as in your identity document'
                                                name='lastName'
                                                showMessage
                                                width='100%'
                                            />
                                            <DatePicker
                                                disabled={values.areDetailsVerified}
                                                displayFormat={dateDisplayFormat}
                                                label='Date of birth*'
                                                maxDate={moment().subtract(18, 'years').toDate()}
                                                message='Your date of birth as in your identity document'
                                                minDate={moment().subtract(100, 'years').toDate()}
                                                mobileAlignment='above'
                                                name='dateOfBirth'
                                                onDateChange={handleDateChange}
                                                showMessage
                                            />
                                        </div>
                                        <div className='wallets-verify-document-details__sidenote'>
                                            <WalletText size='xs' weight='bold'>
                                                Example
                                            </WalletText>
                                            <DerivLightNameDobPoiIcon height={195} width={288} />
                                        </div>
                                    </div>
                                    <div
                                        className={classNames('wallets-verify-document-details__checkbox', {
                                            'wallets-verify-document-details__checkbox--disabled': !isValid,
                                        })}
                                    >
                                        <Field
                                            disabled={!isValid}
                                            id='idv-checkbox'
                                            name='areDetailsVerified'
                                            onClick={handleTNCChecked}
                                            type='checkbox'
                                        />
                                        <label htmlFor='idv-checkbox'>
                                            <WalletText lineHeight='2xs' size='sm'>
                                                I confirm that the name and date of birth above match my chosen identity
                                                document
                                            </WalletText>
                                        </label>
                                    </div>
                                </div>
                            )}
                            {children}
                        </div>
                    </ModalStepWrapper>
                );
            }}
        </Formik>
    );
};

export default VerifyDocumentDetails;
