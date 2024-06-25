import React from 'react';
import { usePOA, usePOI, useSettings } from '@deriv/api-v2';
import { Loader, ModalStepWrapper } from '../../../../components';
import { THooks } from '../../../../types';
import { POIFlow } from '../../../accounts/flows';
import { PersonalDetails, PoaScreen } from '../../../accounts/screens';

type TClientVerificationProps = {
    selectedJurisdiction: THooks.AvailableMT5Accounts['shortcode'];
};

const Loading = () => {
    return (
        <div style={{ height: 400, width: 600 }}>
            <Loader />
        </div>
    );
};

const ClientVerification: React.FC<TClientVerificationProps> = ({ selectedJurisdiction }) => {
    const { data: poi, isLoading: isPoiLoading } = usePOI();
    const { data: poa, isLoading: isPoaLoading } = usePOA();
    const { data: settings, isLoading: isSettingsLoading } = useSettings();

    if (isPoiLoading || isPoaLoading || isSettingsLoading || !settings || !poi || !poi.status || !poa) {
        return (
            <ModalStepWrapper>
                <Loading />
            </ModalStepWrapper>
        );
    }

    const shouldSubmitPOI = ['none', 'rejected', 'expired'].includes(poi.status);

    // @ts-expect-error broken API types for get_account_status
    const shouldSubmitPOA = selectedJurisdiction ? !poa.verified_jurisdiction?.[selectedJurisdiction] : false;

    const shouldFillPersonalDetails = !settings?.has_submitted_personal_details;

    if (shouldSubmitPOI) {
        <ModalStepWrapper>
            <POIFlow />
        </ModalStepWrapper>;
    }

    if (shouldSubmitPOA) {
        <ModalStepWrapper>
            <PoaScreen />
        </ModalStepWrapper>;
    }

    if (shouldFillPersonalDetails) return <PersonalDetails />;

    return null;
};

export default ClientVerification;
