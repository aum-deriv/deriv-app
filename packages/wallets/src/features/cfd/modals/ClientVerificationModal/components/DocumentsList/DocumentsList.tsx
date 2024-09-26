import React from 'react';
import { useHistory } from 'react-router-dom';
import { THooks } from '../../../../../../types';
import { ClientVerificationStatusBadge } from '../../../../components';
import { DocumentTile } from './components';
import './DocumentsList.scss';

type TDocumentsListProps = {
    statuses: THooks.SortedMT5Accounts['client_kyc_status'];
};

type TStatuses = 'expired' | 'none' | 'pending' | 'rejected' | 'suspected' | 'verified';

const getTileProps = (status: TStatuses): Pick<React.ComponentProps<typeof DocumentTile>, 'badge' | 'isDisabled'> => {
    return {
        expired: {
            badge: <ClientVerificationStatusBadge variant='failed' />,
            isDisabled: false,
        },
        none: {
            badge: undefined,
            isDisabled: false,
        },
        pending: {
            badge: <ClientVerificationStatusBadge variant='in_review' />,
            isDisabled: true,
        },
        rejected: {
            badge: <ClientVerificationStatusBadge variant='failed' />,
            isDisabled: false,
        },
        suspected: {
            badge: <ClientVerificationStatusBadge variant='failed' />,
            isDisabled: false,
        },
        verified: {
            badge: <ClientVerificationStatusBadge variant='verified' />,
            isDisabled: true,
        },
    }[status];
};

const DocumentsList: React.FC<TDocumentsListProps> = ({ statuses }) => {
    const history = useHistory();

    return (
        <div className='wallets-documents-list'>
            {'poi_status' in statuses && (
                <DocumentTile
                    {...getTileProps(statuses.poi_status)}
                    onClick={() => history.push('/account/proof-of-identity')}
                    title='Proof of identity'
                />
            )}
            {'poa_status' in statuses && (
                <DocumentTile
                    {...getTileProps(statuses.poa_status)}
                    onClick={() => history.push('/account/proof-of-address')}
                    title='Proof of address'
                />
            )}
            {'valid_tin' in statuses && !statuses.valid_tin && (
                <DocumentTile onClick={() => history.push('/account/personal-details')} title='Personal Details' />
            )}
        </div>
    );
};

export default DocumentsList;
