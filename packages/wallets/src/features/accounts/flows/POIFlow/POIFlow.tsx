import React from 'react';
import { ModalStepWrapper } from '../../../../components';
import { THooks } from '../../../../types';
import { Onfido } from '../../../cfd';
import { IDVDocumentUpload, ManualDocumentUpload } from '../../screens';

type TPOIFlowProps = {
    poi?: THooks.POI;
};

const POIFlow: React.FC<TPOIFlowProps> = ({ poi }) => {
    const service = poi?.current.service as keyof THooks.POI['services'];

    if (service === 'idv') return <IDVDocumentUpload />;
    if (service === 'onfido') return <Onfido />;
    if (service === 'manual') return <ManualDocumentUpload />;

    return (
        <ModalStepWrapper>
            <IDVDocumentUpload />
        </ModalStepWrapper>
    );
};

export default POIFlow;
