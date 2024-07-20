import { FormikValues } from 'formik';
import { useDocumentUpload } from '@deriv/api-v2';
import { THooks } from '../../../../../../../types';
import { TSelfieUploadValues } from '../types';

const useSelfieUpload = (documentIssuingCountryCode: THooks.AccountSettings['country_code']) => {
    const { error, isLoading, isSuccess, reset, upload: _upload } = useDocumentUpload();

    const upload = (values: FormikValues) => {
        return _upload({
            document_issuing_country: documentIssuingCountryCode ?? undefined,
            document_type: 'selfie_with_id',
            file: values.selfieFile,
        });
    };

    const initialValues = {} as TSelfieUploadValues;

    return {
        /** contains error data if any error encountered during selfie upload */
        error: error?.error,

        /** initial values for the selfie forms */
        initialValues,
        isLoading,

        /** `true` if successfully uploaded selfie files */
        isSuccess,

        /** reset selfie upload API errors */
        resetError: reset,

        /** upload selfie file */
        upload,
    };
};

export default useSelfieUpload;
