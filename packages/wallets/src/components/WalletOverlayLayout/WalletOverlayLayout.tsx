import React from 'react';
import './WalletOverlayLayout.scss';

const WalletOverlayLayout = ({ children, sidePane }) => {
    return (
        <div className='wallets-overlay-layout'>
            <div className='wallets-overlay-layout__content'>{children}</div>
            {sidePane && <div className='wallets-overlay-layout__side-pane'>{sidePane}</div>}
        </div>
    );
};

export default WalletOverlayLayout;
