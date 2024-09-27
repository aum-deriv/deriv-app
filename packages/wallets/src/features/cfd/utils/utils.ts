import { TModifiedMT5Accounts } from '../types';

export const getClientVerification = (account: TModifiedMT5Accounts) => {
    const hasClientKycStatus = 'client_kyc_status' in account;
    const statuses = account.client_kyc_status;

    const hasPoiStatus = hasClientKycStatus && 'poi_status' in statuses;
    const hasPoaStatus = hasClientKycStatus && 'poa_status' in statuses;
    const hasTinStatus = hasClientKycStatus && 'valid_tin' in statuses;

    const requiredStatuses = ['expired', 'none', 'rejected', 'suspected'];

    const isPoiRequired = hasPoiStatus && requiredStatuses.includes(statuses.poi_status);
    const isPoaRequired = hasPoaStatus && requiredStatuses.includes(statuses.poa_status);
    const isTinRequired = hasTinStatus && !statuses.valid_tin;

    return {
        hasClientKycStatus,
        hasPoaStatus,
        hasPoiStatus,
        hasTinStatus,
        isPoaRequired,
        isPoiRequired,
        isTinRequired,
        isVerificationRequired: isPoiRequired || isPoaRequired || isTinRequired,
        statuses,
    };
};
