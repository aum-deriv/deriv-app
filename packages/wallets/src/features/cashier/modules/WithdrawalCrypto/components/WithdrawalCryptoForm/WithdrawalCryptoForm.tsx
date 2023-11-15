import React, { useEffect } from 'react';
import { Field, FieldProps, Formik } from 'formik';
import { useActiveWalletAccount, useCryptoWithdrawal, useCurrencyConfig, useExchangeRate } from '@deriv/api';
import { WalletButton, WalletTextField, WalletsPercentageSelector } from '../../../../../../components';
import { WithdrawalCryptoAmountConverter } from './components/WithdrawalCryptoAmountConverter';
import './WithdrawalCryptoForm.scss';

const MIN_ADDRESS_LENGTH = 25;
const MAX_ADDRESS_LENGTH = 64;

export type TForm = {
    cryptoAddress: string;
    cryptoAmount: string;
    fiatAmount: string;
};

type TWithdrawalCryptoFormProps = {
    verificationCode?: string;
};

const validateCryptoAddress = (address: string) => {
    if (!address) return 'This field is required.';

    if (address.length < MIN_ADDRESS_LENGTH || address.length > MAX_ADDRESS_LENGTH) {
        return 'Your wallet address should have 25 to 64 characters.';
    }

    return undefined;
};

const WithdrawalCryptoForm: React.FC<TWithdrawalCryptoFormProps> = ({ verificationCode }) => {
    const { data: activeWallet } = useActiveWalletAccount();
    const { getConfig } = useCurrencyConfig();
    const { data: exchangeRate, subscribe, unsubscribe } = useExchangeRate();
    const { mutate } = useCryptoWithdrawal();
    const FRACTIONAL_DIGITS_CRYPTO = activeWallet?.currency ? getConfig(activeWallet?.currency)?.fractional_digits : 2;
    const FRACTIONAL_DIGITS_FIAT = getConfig('USD')?.fractional_digits;

    useEffect(() => {
        if (activeWallet?.currency)
            subscribe({
                base_currency: 'USD',
                loginid: activeWallet.loginid,
                target_currency: activeWallet.currency,
            });
        return () => unsubscribe();
    }, []);

    return (
        <Formik
            initialValues={{
                cryptoAddress: '',
                cryptoAmount: '',
                fiatAmount: '',
            }}
            onSubmit={values =>
                mutate({
                    address: values.cryptoAddress,
                    amount: parseFloat(parseFloat(values.cryptoAmount).toFixed(FRACTIONAL_DIGITS_CRYPTO)),
                    verification_code: verificationCode,
                })
            }
        >
            {({ errors, handleSubmit, isSubmitting, setValues, values }) => {
                return (
                    <form autoComplete='off' className='wallets-withdrawal-crypto-form' onSubmit={handleSubmit}>
                        <div className='wallets-withdrawal-crypto-address'>
                            <Field name='cryptoAddress' validate={validateCryptoAddress}>
                                {({ field }: FieldProps<string>) => (
                                    <WalletTextField
                                        {...field}
                                        label='Your BTC Wallet address'
                                        message={errors.cryptoAddress}
                                        showMessage
                                    />
                                )}
                            </Field>
                        </div>
                        <WalletsPercentageSelector
                            amount={
                                !Number.isNaN(parseFloat(values.cryptoAmount)) ? parseFloat(values.cryptoAmount) : 0
                            }
                            balance={activeWallet?.balance || 0}
                            onChangePercentage={percentage => {
                                const fraction = percentage / 100;

                                return setValues({
                                    ...values,
                                    cryptoAmount:
                                        !!fraction && activeWallet?.balance
                                            ? (fraction * activeWallet?.balance).toFixed(FRACTIONAL_DIGITS_CRYPTO)
                                            : '',
                                    fiatAmount:
                                        !!fraction &&
                                        activeWallet?.balance &&
                                        activeWallet?.currency &&
                                        exchangeRate?.rates
                                            ? (
                                                  (fraction * activeWallet?.balance) /
                                                  exchangeRate?.rates[activeWallet.currency]
                                              ).toFixed(FRACTIONAL_DIGITS_FIAT)
                                            : '',
                                });
                            }}
                        />
                        <WithdrawalCryptoAmountConverter
                            activeWallet={activeWallet}
                            exchangeRate={exchangeRate}
                            getCurrencyConfig={getConfig}
                        />
                        <div className='wallets-withdrawal-crypto-form__submit'>
                            <WalletButton
                                disabled={Object.keys(errors).length !== 0 || !values.cryptoAmount || isSubmitting}
                                size='lg'
                                text='Withdraw'
                                type='submit'
                            />
                        </div>
                    </form>
                );
            }}
        </Formik>
    );
};

export default WithdrawalCryptoForm;
