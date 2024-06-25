import React from 'react';
import { useFormikContext } from 'formik';
import { DocumentSelection } from './components/DocumentSelection';
import {
    DrivingLicenseDocumentUpload,
    IdentityCardDocumentUpload,
    NIMCSlipDocumentUpload,
    PassportDocumentUpload,
} from './components';
import './ManualDocumentUpload.scss';

const ManualDocumentUploadContent = () => {
    const { setFieldValue, values } = useFormikContext();

    if (values.selectedManualDocument === 'passport') {
        return <PassportDocumentUpload />;
    } else if (values.selectedManualDocument === 'driving-license') {
        return <DrivingLicenseDocumentUpload />;
    } else if (values.selectedManualDocument === 'identity-card') {
        return <IdentityCardDocumentUpload />;
    } else if (values.selectedManualDocument === 'nimc-slip') {
        return <NIMCSlipDocumentUpload />;
    }

    return <DocumentSelection setSelectedDocument={(doc: string) => setFieldValue('selectedManualDocument', doc)} />;
};

const ManualDocumentUpload = () => {
    return (
        <div className='wallets-manual-document-upload'>
            <ManualDocumentUploadContent />
        </div>
    );
};

export default ManualDocumentUpload;
