import React, { useMemo } from 'react';
import classNames from 'classnames';
import { Field, Formik } from 'formik';
import moment from 'moment';
import { useSettings } from '@deriv/api-v2';
import { DerivLightNameDobPoiIcon } from '@deriv/quill-icons';
import { DatePicker, FormField, InlineMessage, WalletText } from '../../../../../../components';
import { getFormattedDateString } from '../../../../../../utils/utils';
import verifyPersonalDetailsValidationSchema from './verifyPersonalDetailsValidationSchema';
import './VerifyPersonalDetails.scss';

type TVerifyPersonalDetailsProps = {
    onVerified?: () => void;
};

const VerifyPersonalDetails: React.FC<TVerifyPersonalDetailsProps> = ({ onVerified }) => {
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

                if (values.areDetailsVerified && isOnfido) {
                    return (
                        <div
                            className='wallets-verify-personal-details__placeholder'
                            data-testid='dt_wallets_verify_personal_details__placeholder'
                        />
                    );
                }

                return (
                    <div className='wallets-verify-personal-details'>
                        <InlineMessage>
                            <WalletText size='sm'>
                                To avoid delays, enter your <strong>name</strong> and <strong>date of birth</strong>{' '}
                                exactly as it appears on your identity document.
                            </WalletText>
                        </InlineMessage>
                        <div className='wallets-verify-personal-details__body'>
                            <div className='wallets-verify-personal-details__content'>
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
                            <div className='wallets-verify-personal-details__sidenote'>
                                <WalletText size='xs' weight='bold'>
                                    Example
                                </WalletText>
                                <DerivLightNameDobPoiIcon height={195} width={288} />
                            </div>
                        </div>
                        <div
                            className={classNames('wallets-verify-personal-details__checkbox', {
                                'wallets-verify-personal-details__checkbox--disabled': !isValid,
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
                                    I confirm that the name and date of birth above match my chosen identity document
                                </WalletText>
                            </label>
                        </div>
                    </div>
                );
            }}
        </Formik>
    );
};

export default VerifyPersonalDetails;
