import React, { lazy, useEffect } from 'react';
import { useAuthorize, useBalanceSubscription } from '@deriv/api-v2';
import {
    WalletListHeader,
    WalletsAddMoreCarousel,
    WalletsCardLoader,
    WalletsResponsiveLoader,
    WalletTourGuide,
} from '../../components';
import ResetMT5PasswordHandler from '../../features/cfd/ResetMT5PasswordHandler';
import useDevice from '../../hooks/useDevice';
import BalanceProvider from '../../providers/BalanceProvider';
import './WalletsListingRoute.scss';

const LazyWalletsCarousel = lazy(() => import('../../components/WalletsCarousel/WalletsCarousel'));
const LazyDesktopWalletsList = lazy(() => import('../../components/DesktopWalletsList/DesktopWalletsList'));

const WalletsListingRoute: React.FC = () => {
    const { isMobile } = useDevice();
    const { subscribe, unsubscribe, ...rest } = useBalanceSubscription();
    const { isSuccess } = useAuthorize();
    useEffect(() => {
        if (!isSuccess) return;
        subscribe({
            account: 'all',
        });
        return () => {
            unsubscribe();
        };
    }, [isSuccess, subscribe, unsubscribe]);

    return (
        <BalanceProvider balanceData={rest}>
            <div className='wallets-listing-route'>
                <WalletListHeader />
                {isMobile ? (
                    <React.Suspense fallback={<WalletsResponsiveLoader />}>
                        <LazyWalletsCarousel />
                    </React.Suspense>
                ) : (
                    <React.Suspense fallback={<WalletsCardLoader />}>
                        <LazyDesktopWalletsList />
                    </React.Suspense>
                )}
                <WalletsAddMoreCarousel />
                <ResetMT5PasswordHandler />
                <WalletTourGuide />
            </div>
        </BalanceProvider>
    );
};

export default WalletsListingRoute;
