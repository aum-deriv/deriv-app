import React from 'react';
import { mockStore } from '@deriv/stores';
import { fireEvent, render, screen } from '@testing-library/react';
import CashierOnboardingPaymentAgentCard from '../cashier-onboarding-payment-agent-card';
import CashierProviders from '../../../../../cashier-providers';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    usePaymentAgentList: () => ({ data: ['PA1', 'PA2'] }),
}));

describe('CashierOnboardingPaymentAgentCard', () => {
    test('should call the onClick callback when clicked', async () => {
        const mock = mockStore({
            modules: {
                cashier: {
                    general_store: {
                        setDepositTarget: jest.fn(),
                        setShouldShowAllAvailableCurrencies: jest.fn(),
                    },
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <CashierProviders store={mock}>{children}</CashierProviders>
        );
        render(<CashierOnboardingPaymentAgentCard />, { wrapper });

        const container = screen.getByTestId('dt_cashier_onboarding_card_container');

        fireEvent.click(container);

        expect(mock.modules.cashier.general_store.setDepositTarget).toBeCalledTimes(1);
        expect(mock.modules.cashier.general_store.setShouldShowAllAvailableCurrencies).toBeCalledTimes(1);
        expect(mock.ui.openRealAccountSignup).toBeCalledTimes(1);
        expect(mock.ui.shouldNavigateAfterChooseCrypto).toBeCalledTimes(1);
    });
});
