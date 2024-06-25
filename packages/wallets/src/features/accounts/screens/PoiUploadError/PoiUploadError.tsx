import React from 'react';
import { useFormikContext } from 'formik';
import { DerivLightDeclinedPoiIcon } from '@deriv/quill-icons';
import { WalletButton } from '../../../../components/Base';
import { WalletsActionScreen } from '../../../../components/WalletsActionScreen';
import { ErrorCode } from '../../constants';
import './PoiUploadError.scss';

type PoiUploadErrorProps = {
    errorCode: keyof typeof ErrorCode;
};

const errorCodeToDescriptionMapper: Record<keyof typeof ErrorCode, string> = {
    DuplicateUpload: 'It seems you’ve submitted this document before. Upload a new document.',
};

const PoiUploadError = ({ errorCode }: PoiUploadErrorProps) => {
    const { setFieldValue, values } = useFormikContext();

    // clears the form values to navigate back to document selection
    const switchBackToDocumentSelection = () => {
        if (values.selectedManualDocument === 'passport') {
            setFieldValue('passportNumber', '');
            setFieldValue('passportExpiryDate', '');
            setFieldValue('passportCard', '');
        } else if (values.selectedManualDocument === 'driving-license') {
            setFieldValue('drivingLicenseNumber', '');
            setFieldValue('drivingLicenseExpiryDate', '');
            setFieldValue('drivingLicenseCardFront', '');
            setFieldValue('drivingLicenseCardBack', '');
        } else if (values.selectedManualDocument === 'identity-card') {
            setFieldValue('identityCardNumber', '');
            setFieldValue('identityCardExpiryDate', '');
            setFieldValue('identityCardFront', '');
            setFieldValue('identityCardBack', '');
        } else if (values.selectedManualDocument === 'nimc-slip') {
            setFieldValue('nimcNumber', '');
            setFieldValue('nimcCardFront', '');
            setFieldValue('nimcCardBack', '');
        }

        setFieldValue('selectedManualDocument', '');
        // switchScreen('manualScreen');
    };

    return (
        <div className='wallets-poi-upload-error'>
            <WalletsActionScreen
                description={errorCodeToDescriptionMapper[errorCode]}
                icon={<DerivLightDeclinedPoiIcon height={120} width={120} />}
                renderButtons={() => (
                    <WalletButton onClick={switchBackToDocumentSelection} size='lg'>
                        Try again
                    </WalletButton>
                )}
                title='Proof of identity documents upload failed'
            />
        </div>
    );
};

export default PoiUploadError;
