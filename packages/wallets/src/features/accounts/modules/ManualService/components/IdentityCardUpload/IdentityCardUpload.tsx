import React, { useState } from 'react';
import { Formik } from 'formik';
import moment from 'moment';
import { Divider } from '@deriv-com/ui';
import { DatePicker, Dropzone, FormField, ModalStepWrapper, WalletText } from '../../../../../../components';
import IdentityCardBack from '../../../../../../public/images/accounts/document-back.svg';
import IdentityCardFront from '../../../../../../public/images/accounts/identity-card-front.svg';
import { Footer } from '../../../components';
import { GeneralDocumentRules, TManualDocumentComponent } from '../../utils';
import { DocumentRules } from '../DocumentRules';
import { ManualUploadErrorMessage } from '../ManualUploadErrorMessage';
import { SelfieUpload } from '../SelfieUpload';
import { useIdentityCardUpload } from './hooks';
import { identityCardUploadValidator } from './utils';
import './IdentityCardUpload.scss';

const IdentityCardUpload: TManualDocumentComponent = ({ documentIssuingCountryCode, onClickBack, onCompletion }) => {
    const { error, initialValues, isSuccess, resetError, upload } = useIdentityCardUpload(documentIssuingCountryCode);
    const [showSelfieUpload, setShowSelfieUpload] = useState(false);

    if (!error && isSuccess && onCompletion) {
        onCompletion();
    }

    return (
        <Formik initialValues={initialValues} onSubmit={upload} validationSchema={identityCardUploadValidator}>
            {({ dirty, errors, handleSubmit, setFieldValue, values }) => {
                const isIdentityCardFormValid =
                    dirty &&
                    !errors.identityCardNumber &&
                    !errors.identityCardExpiryDate &&
                    !errors.identityCardBack &&
                    !errors.identityCardFront;

                const handleOnClickNext = () => {
                    if (isIdentityCardFormValid) {
                        setShowSelfieUpload(true);
                    }
                };

                if (error) {
                    return <ManualUploadErrorMessage errorCode={error?.code} onRetry={resetError} />;
                }

                if (showSelfieUpload) {
                    return (
                        <SelfieUpload
                            onClickBack={() => {
                                setShowSelfieUpload(false);
                            }}
                            onCompletion={handleSubmit}
                        />
                    );
                }

                return (
                    <ModalStepWrapper
                        disableAnimation
                        renderFooter={() => (
                            <Footer
                                disableNext={!isIdentityCardFormValid}
                                onClickBack={onClickBack}
                                onClickNext={handleOnClickNext}
                            />
                        )}
                        title='Add a real MT5 account'
                    >
                        <div
                            className='wallets-identity-card-document-upload'
                            data-testid='dt_identity-card-document-upload'
                        >
                            <WalletText>First, enter your Identity card number and the expiry date.</WalletText>
                            <div className='wallets-identity-card-document-upload__input-group'>
                                <FormField
                                    defaultValue={values.identityCardNumber ?? ''}
                                    label='Identity card number*'
                                    name='identityCardNumber'
                                />
                                <DatePicker
                                    defaultValue={values.identityCardExpiryDate ?? ''}
                                    label='Expiry date*'
                                    minDate={moment().add(2, 'days').toDate()}
                                    name='identityCardExpiryDate'
                                    placeholder='DD/MM/YYYY'
                                />
                            </div>
                            <Divider color='var(--border-divider)' height={2} />
                            <div className='wallets-identity-card-document-upload__document-upload'>
                                <WalletText>Next, upload the front and back of your identity card.</WalletText>
                                <div className='wallets-identity-card-document-upload__dropzone'>
                                    <Dropzone
                                        buttonText='Drop file or click here to upload'
                                        defaultFile={values.identityCardFront}
                                        description='Upload the front of your identity card.'
                                        fileFormats={[
                                            'image/jpeg',
                                            'image/jpg',
                                            'image/png',
                                            'image/gif',
                                            'application/pdf',
                                        ]}
                                        icon={<IdentityCardFront />}
                                        maxSize={8388608}
                                        noClick
                                        onFileChange={(file?: File) => setFieldValue('identityCardFront', file)}
                                    />
                                    <Dropzone
                                        buttonText='Drop file or click here to upload'
                                        defaultFile={values.identityCardBack}
                                        description='Upload the back of your identity card.'
                                        fileFormats={[
                                            'image/jpeg',
                                            'image/jpg',
                                            'image/png',
                                            'image/gif',
                                            'application/pdf',
                                        ]}
                                        icon={<IdentityCardBack />}
                                        maxSize={8388608}
                                        noClick
                                        onFileChange={(file?: File) => setFieldValue('identityCardBack', file)}
                                    />
                                </div>
                                <DocumentRules hints={GeneralDocumentRules} />
                            </div>
                        </div>
                    </ModalStepWrapper>
                );
            }}
        </Formik>
    );
};

export default IdentityCardUpload;
