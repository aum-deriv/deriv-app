import React, { ReactNode, useMemo } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useResidenceList, useSettings } from '@deriv/api-v2';
import {
    FormField,
    InlineMessage,
    Loader,
    ModalStepWrapper,
    WalletButton,
    WalletDropdown,
    WalletText,
} from '../../../../components';
import { accountOpeningReasonList } from './constants';
import './TaxInformation.scss';

const TaxInformation = () => {
    const { data: residenceList, isLoading, isSuccess: isResidenceListSuccess } = useResidenceList();
    const { data: settings, update } = useSettings();

    const countryCodeToPatternMapper = useMemo(() => {
        const countryCodeToPatternMapping: Record<string, string> = {};

        if (isResidenceListSuccess) {
            residenceList.forEach(residence => {
                if (residence.value && !(residence.value in countryCodeToPatternMapping)) {
                    countryCodeToPatternMapping[residence.value] = residence?.tin_format?.[0] ?? '';
                }
            });
        }
        return countryCodeToPatternMapping;
    }, [isResidenceListSuccess, residenceList]);

    const getTinValidator = (pattern: string) => {
        if (pattern) {
            return Yup.string()
                .required('Please fill in Tax identification number.')
                .matches(new RegExp(pattern), 'The format is incorrect.');
        }
    };

    const Footer = ({ disabled, onSubmit }: { disabled: boolean; onSubmit: () => void }) => {
        return (
            <div className='wallets-tax-information__footer'>
                <WalletButton disabled={disabled} onClick={onSubmit} type='submit'>
                    Next
                </WalletButton>
            </div>
        );
    };

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
            onSubmit={values => {
                if (
                    values &&
                    values.placeOfBirth &&
                    values.taxResidence &&
                    values.accountOpeningReason &&
                    values.taxIdentificationNumber
                )
                    update({
                        // @ts-expect-error broken api types for residenceList call
                        account_opening_reason: values.accountOpeningReason,
                        citizen: values.citizenship,
                        place_of_birth: values.placeOfBirth,
                        tax_identification_number: values.taxIdentificationNumber,
                        tax_residence: values.taxResidence,
                    });
            }}
        >
            {({ handleSubmit, isValid, setFieldValue, values }) => {
                return (
                    <ModalStepWrapper
                        renderFooter={() => <Footer disabled={!isValid} onSubmit={handleSubmit} />}
                        title='Add a real MT5 account'
                    >
                        <div className='wallets-tax-information'>
                            {isLoading && <Loader />}
                            {!isLoading && (
                                <>
                                    <div className='wallets-tax-information__header'>
                                        <WalletText align='center' as='h2' color='prominent' weight='bold'>
                                            Complete your personal details
                                        </WalletText>
                                        <WalletText align='center' size='xs'>
                                            Any information you provide is confidential and will be used for
                                            verification purposes only.
                                        </WalletText>
                                    </div>
                                    <div className='wallets-tax-information__inline'>
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
                                    <div className='wallets-tax-information__form'>
                                        <WalletDropdown
                                            label='Citizenship*'
                                            list={residenceList.map(residence => ({
                                                text: residence.text as ReactNode,
                                                value: residence.value ?? '',
                                            }))}
                                            listHeight='sm'
                                            name='citizenship'
                                            onSelect={selectedItem => setFieldValue('citizenship', selectedItem)}
                                            value={settings?.citizen ?? values?.citizenship}
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
                                            name='placeOfBirth'
                                            onSelect={selectedItem => setFieldValue('placeOfBirth', selectedItem)}
                                            value={settings?.place_of_birth ?? ''}
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
                                            name='taxResidence'
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
                                            value={values.taxResidence ?? ''}
                                            variant='comboBox'
                                        />
                                        <FormField
                                            label='Tax identification number*'
                                            name='taxIdentificationNumber'
                                            validationSchema={getTinValidator(
                                                countryCodeToPatternMapper[values.taxResidence ?? '']
                                            )}
                                        />
                                        <WalletDropdown
                                            label='Account opening reason*'
                                            list={accountOpeningReasonList}
                                            name='accountOpeningReason'
                                            onSelect={selectedItem =>
                                                setFieldValue('accountOpeningReason', selectedItem)
                                            }
                                            value={values.accountOpeningReason ?? ''}
                                            variant='comboBox'
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </ModalStepWrapper>
                );
            }}
        </Formik>
    );
};

export default TaxInformation;
