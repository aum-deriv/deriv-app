import React from 'react';
import { Localize } from '@deriv-com/translations';
import { Checkbox, Text, useDevice } from '@deriv-com/ui';
import { WalletLink } from '../../../../components/Base';
import { useModal } from '../../../../components/ModalProvider';
import { companyNamesAndUrls } from '../../constants';
import './CFDPasswordModalTnc.scss';

export type TCFDPasswordModalTncProps = {
    checked: boolean;
    onChange: () => void;
};

const CFDPasswordModalTnc = ({ checked, onChange }: TCFDPasswordModalTncProps) => {
    const { isDesktop } = useDevice();
    const { getModalState } = useModal();
    const selectedJurisdiction = getModalState('selectedJurisdiction');
    const selectedCompany = companyNamesAndUrls[selectedJurisdiction as keyof typeof companyNamesAndUrls];

    return (
        <div className='wallets-cfd-modal-tnc'>
            <Checkbox
                checked={checked}
                data-testid='dt_wallets_tnc_checkbox'
                label={
                    <Text size={isDesktop ? 'xs' : 'sm'}>
                        <Localize
                            components={[<WalletLink key={0} staticUrl={selectedCompany.tncUrl} variant='bold' />]}
                            i18n_default_text="I confirm and accept {{company}}'s <0>terms and conditions</0>"
                            values={{
                                company: selectedCompany.name,
                            }}
                        />
                    </Text>
                }
                name='zerospread-checkbox'
                onChange={onChange}
            />
        </div>
    );
};

export default CFDPasswordModalTnc;
