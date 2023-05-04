import React from 'react';
import classNames from 'classnames';
import { Icon, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import './alert-banner.scss';

type TAlertBanner = {
    className?: string;
    icon: string;
    message: JSX.Element | string;
};

const AlertBanner = ({ className, icon, message }: TAlertBanner) => {
    return (
        <div className={classNames('alert-banner', className)}>
            <Icon size={16} icon={icon} />
            <Text as='p' align='center' size='xs'>
                {message}
            </Text>
        </div>
    );
};

export default AlertBanner;
