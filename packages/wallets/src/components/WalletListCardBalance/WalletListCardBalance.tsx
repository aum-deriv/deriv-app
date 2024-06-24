import React from 'react';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { displayMoney } from '@deriv/api-v2/src/utils';
import useSubscribedBalance from '../../hooks/useSubscribedBalance';
import { WalletText } from '../Base';
import './WalletListCardBalance.scss';

const WalletListCardBalance = () => {
    const { data: activeWallet, isInitializing: isActiveWalletInitializing } = useActiveWalletAccount();
    const { data: balanceData } = useSubscribedBalance();
    const balance = balanceData?.accounts?.[activeWallet?.loginid ?? '']?.balance;
    const showLoader = balance === undefined || isActiveWalletInitializing;

    return (
        <div className='wallets-balance__container'>
            {showLoader ? (
                <div
                    className='wallets-skeleton wallets-balance--loader'
                    data-testid='dt_wallet_list_card_balance_loader'
                />
            ) : (
                <WalletText align='right' size='xl' weight='bold'>
                    {displayMoney?.(balance, activeWallet?.currency ?? '', {
                        fractional_digits: activeWallet?.currency_config?.fractional_digits,
                    })}
                </WalletText>
            )}
        </div>
    );
};

export default WalletListCardBalance;
