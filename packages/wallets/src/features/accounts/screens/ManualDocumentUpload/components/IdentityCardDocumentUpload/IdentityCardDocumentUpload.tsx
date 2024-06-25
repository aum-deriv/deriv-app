import React from 'react';
import { useFormikContext } from 'formik';
import moment from 'moment';
import { DatePicker, Divider, Dropzone, FormField, WalletText } from '../../../../../../components';
import IdentityCardBack from '../../../../../../public/images/accounts/document-back.svg';
import IdentityCardFront from '../../../../../../public/images/accounts/identity-card-front.svg';
import { documentRequiredValidator, expiryDateValidator } from '../../../../validations';
import { DocumentRuleHints } from '../DocumentRuleHints';
import './IdentityCardDocumentUpload.scss';

const IdentityCardDocumentUpload = () => {
    const { setFieldValue, values } = useFormikContext();

    const handleDateChange = (formattedDate: string | null) => {
        setFieldValue('identityCardExpiryDate', formattedDate);
    };
    return (
        <div className='wallets-identity-card-document-upload' data-testid='dt_identity-card-document-upload'>
            <WalletText>First, enter your Identity card number and the expiry date.</WalletText>
            <div className='wallets-identity-card-document-upload__input-group'>
                <FormField
                    defaultValue={values.identityCardNumber ?? ''}
                    label='Identity card number*'
                    name='identityCardNumber'
                    validationSchema={documentRequiredValidator('Identity card number')}
                />
                <DatePicker
                    defaultValue={values.identityCardExpiryDate ?? ''}
                    label='Expiry date*'
                    minDate={moment().add(2, 'days').toDate()}
                    name='identityCardExpiryDate'
                    onDateChange={handleDateChange}
                    placeholder='DD/MM/YYYY'
                    validationSchema={expiryDateValidator}
                />
            </div>
            <Divider />
            <div className='wallets-identity-card-document-upload__document-upload'>
                <WalletText>Next, upload the front and back of your identity card.</WalletText>
                <div className='wallets-identity-card-document-upload__dropzone'>
                    <Dropzone
                        buttonText='Drop file or click here to upload'
                        defaultFile={values.identityCardFront}
                        description='Upload the front of your identity card.'
                        fileFormats={['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf']}
                        icon={<IdentityCardFront />}
                        maxSize={8388608}
                        noClick
                        onFileChange={(file?: File) => setFieldValue('identityCardFront', file)}
                    />
                    <Dropzone
                        buttonText='Drop file or click here to upload'
                        defaultFile={values.identityCardBack}
                        description='Upload the back of your identity card.'
                        fileFormats={['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf']}
                        icon={<IdentityCardBack />}
                        maxSize={8388608}
                        noClick
                        onFileChange={(file?: File) => setFieldValue('identityCardBack', file)}
                    />
                </div>
                <DocumentRuleHints docType='identityCard' />
            </div>
        </div>
    );
};

export default IdentityCardDocumentUpload;
