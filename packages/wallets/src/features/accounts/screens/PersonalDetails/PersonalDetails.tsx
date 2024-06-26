import React, { ReactNode, useMemo } from 'react';
import { Formik } from 'formik';
import { useResidenceList } from '@deriv/api-v2';
import { FormField, InlineMessage, Loader, WalletDropdown, WalletText } from '../../../../components';
import { THooks } from '../../../../types';
import { accountOpeningReasonList } from './constants';
import { getTinValidatorSchema } from './personalDetailsValidationSchema';
import './PersonalDetails.scss';

type TPersonalDetailsProps = {
    settings: THooks.AccountSettings;
};

const PersonalDetails: React.FC<TPersonalDetailsProps> = ({ settings }) => {
    const { data: residenceList } = useResidenceList();
    const initialValues = useMemo(
        () => ({
            accountOpeningReason: settings.account_opening_reason,
            citizenship: settings.citizen,
            placeOfBirth: settings.place_of_birth,
            taxIdentificationNumber: settings.tax_identification_number ?? '',
            taxResidence: settings.tax_residence,
        }),
        [
            settings.account_opening_reason,
            settings.citizen,
            settings.place_of_birth,
            settings.tax_identification_number,
            settings.tax_residence,
        ]
    );

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={() => {
                null;
            }}
            validationSchema={getTinValidatorSchema({
                residenceList,
                taxResidence: settings.tax_residence ?? '',
            })}
        >
            {({ errors, setFieldValue, values }) => {
                return (
                    <div className='wallets-personal-details'>
                        {!residenceList && <Loader />}
                        {residenceList && (
                            <>
                                <div className='wallets-personal-details__header'>
                                    <WalletText align='center' as='h2' color='prominent' weight='bold'>
                                        Complete your personal details
                                    </WalletText>
                                    <WalletText align='center' size='xs'>
                                        Any information you provide is confidential and will be used for verification
                                        purposes only.
                                    </WalletText>
                                </div>
                                <div className='wallets-personal-details__inline'>
                                    <InlineMessage type='information' variant='contained'>
                                        <WalletText size='xs'>
                                            Need help with tax info? Let us know via{' '}
                                            <button
                                                className='wallets-link wallets-link__variant--bold'
                                                onClick={() => window.LC_API.open_chat_window()}
                                            >
                                                live chat
                                            </button>
                                            .
                                        </WalletText>
                                    </InlineMessage>
                                </div>
                                <div className='wallets-personal-details__form'>
                                    <WalletDropdown
                                        label='Citizenship*'
                                        list={residenceList.map(residence => ({
                                            text: residence.text as ReactNode,
                                            value: residence.value ?? '',
                                        }))}
                                        listHeight='sm'
                                        name='wallets-personal-details__dropdown-citizenship'
                                        onSelect={selectedItem => setFieldValue('citizenship', selectedItem)}
                                        value={values?.citizenship}
                                        variant='comboBox'
                                    />
                                    <WalletDropdown
                                        disabled={settings?.place_of_birth !== ''}
                                        label='Place of birth*'
                                        list={residenceList.map(residence => ({
                                            text: residence.text as ReactNode,
                                            value: residence.value ?? '',
                                        }))}
                                        listHeight='sm'
                                        name='wallets-personal-details__dropdown-pob'
                                        onSelect={selectedItem => setFieldValue('placeOfBirth', selectedItem)}
                                        value={values.placeOfBirth ?? ''}
                                        variant='comboBox'
                                    />
                                    <WalletDropdown
                                        errorMessage={'Tax residence is required'}
                                        isRequired
                                        label='Tax residence*'
                                        list={residenceList.map(residence => ({
                                            text: residence.text as ReactNode,
                                            value: residence.value ?? '',
                                        }))}
                                        listHeight='sm'
                                        name='wallets-personal-details__dropdown-tax-residence'
                                        onChange={inputValue => {
                                            residenceList.forEach(residence => {
                                                if (residence.text?.toLowerCase() === inputValue.toLowerCase()) {
                                                    setFieldValue('taxResidence', residence.value);
                                                }
                                            });
                                        }}
                                        onSelect={selectedItem => {
                                            setFieldValue('taxResidence', selectedItem);
                                        }}
                                        value={values?.taxResidence ?? ''}
                                        variant='comboBox'
                                    />
                                    <FormField
                                        errorMessage={errors.taxIdentificationNumber}
                                        label='Tax identification number*'
                                        name='taxIdentificationNumber'
                                    />
                                    <WalletDropdown
                                        label='Account opening reason*'
                                        list={accountOpeningReasonList}
                                        name='wallets-personal-details__dropdown-opening-reason'
                                        onSelect={selectedItem => setFieldValue('accountOpeningReason', selectedItem)}
                                        value={values?.accountOpeningReason ?? ''}
                                        variant='comboBox'
                                    />
                                </div>
                            </>
                        )}
                    </div>
                );
            }}
        </Formik>
    );
};

export default PersonalDetails;
