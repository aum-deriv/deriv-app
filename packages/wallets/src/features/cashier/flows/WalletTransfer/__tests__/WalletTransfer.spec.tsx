import React from 'react';
import { useTransferBetweenAccounts } from '@deriv/api';
import { render, screen } from '@testing-library/react';
import WalletTransfer from '../WalletTransfer';

jest.mock('../../../../../components', () => ({
    ...jest.requireActual('../../../../../components'),
    Loader: jest.fn(() => <div>Loading</div>),
}));

jest.mock('../../../modules', () => ({
    ...jest.requireActual('../../../modules'),
    TransferModule: jest.fn(() => <div>TransferModule</div>),
}));

jest.mock('../../../screens/TransferNotAvailable', () => ({
    ...jest.requireActual('../../../screens/TransferNotAvailable'),
    TransferNotAvailable: jest.fn(({ children }) => (
        <>
            <div>TransferNotAvailable</div>
            <div>{children}</div>
        </>
    )),
}));

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useTransferBetweenAccounts: jest.fn(),
}));

const mockUseTransferBetweenAccounts = useTransferBetweenAccounts as jest.MockedFunction<
    typeof useTransferBetweenAccounts
>;

describe('<WalletTransfer />', () => {
    it('should show the loader if the API response has not yet arrived', () => {
        // @ts-expect-error - since this is a mock, we only need partial properties of the hook
        mockUseTransferBetweenAccounts.mockReturnValue({
            isLoading: true,
            mutate: jest.fn(),
        });

        render(<WalletTransfer />);
        expect(screen.getByText('Loading')).toBeInTheDocument();
    });

    it('should render the TransferNotAvailable screen and its children as the API response is received', () => {
        mockUseTransferBetweenAccounts.mockReturnValue({
            data: {
                // @ts-expect-error - since this is a mock, we only need partial properties of the hook
                accounts: {},
            },
            mutate: jest.fn(),
        });

        render(<WalletTransfer />);
        expect(screen.getByText('TransferNotAvailable')).toBeInTheDocument();
        expect(screen.getByText('TransferModule')).toBeInTheDocument();
    });
});
