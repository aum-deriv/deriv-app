import React, { useMemo } from 'react';
import { useActiveWalletAccount, useCFDAccountsList, useCFDCompareAccounts } from '@deriv/api-v2';
import { CompareAccountsCarousel } from '../../components';
import CompareAccountsCard from './CompareAccountsCard';
import { isCTraderAccountAdded, isDxtradeAccountAdded } from './compareAccountsConfig';
import CompareAccountsHeader from './CompareAccountsHeader';
import './CompareAccountsScreen.scss';

const CompareAccountsScreen = () => {
    const { data: activeWallet } = useActiveWalletAccount();
    // Temporary false until we have useIsEuRegion() ready
    const isEuRegion = false;
    const { is_malta_wallet: isEuUser = false, is_virtual: isDemo = false } = activeWallet || {};

    const { data: compareAccounts, hasCTraderAccountAvailable, hasDxtradeAccountAvailable } = useCFDCompareAccounts();
    const { data: cfdAccounts } = useCFDAccountsList();

    const { ctraderAccount, dxtradeAccount, mt5Accounts } = compareAccounts;

    const isDxtradeAdded = useMemo(
        () => !!cfdAccounts && isDxtradeAccountAdded(cfdAccounts.dxtrade, isDemo),
        [cfdAccounts, isDemo]
    );

    const isCtraderAdded = useMemo(
        () => !!cfdAccounts && isCTraderAccountAdded(cfdAccounts.ctrader, isDemo),
        [cfdAccounts, isDemo]
    );

    return (
        <div className='wallets-compare-accounts'>
            <CompareAccountsHeader isDemo={isDemo} isEuRegion={isEuRegion} />
            <div className='wallets-compare-accounts__card-list'>
                <CompareAccountsCarousel>
                    {mt5Accounts?.map(item => (
                        <CompareAccountsCard
                            isAccountAdded={item?.is_added}
                            isDemo={isDemo}
                            isEuRegion={isEuRegion}
                            isEuUser={isEuUser}
                            key={`${item?.market_type} ${item?.shortcode}`}
                            marketType={item?.market_type}
                            platform={item?.platform}
                            shortCode={item?.shortcode}
                        />
                    ))}
                    {/* Renders cTrader data */}
                    {mt5Accounts?.length && hasCTraderAccountAvailable && ctraderAccount && (
                        <CompareAccountsCard
                            isAccountAdded={isCtraderAdded}
                            isDemo={isDemo}
                            isEuRegion={isEuRegion}
                            isEuUser={isEuUser}
                            marketType={ctraderAccount.market_type}
                            platform={ctraderAccount.platform}
                            shortCode={ctraderAccount.shortcode}
                        />
                    )}
                    {/* Renders Deriv X data */}
                    {mt5Accounts?.length && hasDxtradeAccountAvailable && dxtradeAccount && (
                        <CompareAccountsCard
                            isAccountAdded={isDxtradeAdded}
                            isDemo={isDemo}
                            isEuRegion={isEuRegion}
                            isEuUser={isEuUser}
                            marketType={dxtradeAccount.market_type}
                            platform={dxtradeAccount.platform}
                            shortCode={dxtradeAccount.shortcode}
                        />
                    )}
                </CompareAccountsCarousel>
            </div>
        </div>
    );
};

export default CompareAccountsScreen;
