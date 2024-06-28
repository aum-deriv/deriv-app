import React from 'react';
import { THooks } from '../../../../types';
import { DocumentService, ManualDocumentUpload } from '../../screens';

type TPOIFlowProps = {
    poi?: THooks.POI;
};

const POIFlow: React.FC<TPOIFlowProps> = ({ poi }) => {
    const service = poi?.current.service as keyof THooks.POI['services'];

    if (service === 'manual') return <ManualDocumentUpload />;

    return <DocumentService service={service} />;
};

export default POIFlow;
