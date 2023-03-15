import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { isMobile } from '@deriv/shared';
import AccountTransferForm from '../account-transfer-form';
import CashierProviders from '../../../../cashier-providers';

jest.mock('@deriv/shared/src/utils/screen/responsive', () => ({
    ...jest.requireActual('@deriv/shared/src/utils/screen/responsive'),
    isMobile: jest.fn(),
}));

let mockRootStore;

describe('<AccountTransferForm />', () => {
    beforeEach(() => {
        mockRootStore = {
            client: {
                account_limits: {
                    daily_transfers: {
                        dxtrade: {},
                        internal: {},
                        mt5: {},
                    },
                },
                mt5_login_list: [
                    {
                        login: 'value',
                        market_type: 'gaming',
                        server_info: {
                            geolocation: {
                                region: 'region',
                                sequence: 0,
                            },
                        },
                    },
                ],
                getLimits: jest.fn(),
                is_dxtrade_allowed: false,
            },
            ui: {
                is_dark_mode_on: false,
            },
            modules: {
                cashier: {
                    general_store: {
                        is_crypto: false,
                    },
                    account_transfer: {
                        accounts_list: [
                            {
                                currency: 'USD',
                                is_mt: false,
                                is_dxtrade: false,
                                market_type: 'gaming',
                                value: 'value',
                            },
                        ],
                        minimum_fee: '0',
                        selected_from: {
                            currency: 'USD',
                            is_mt: false,
                            is_crypto: false,
                            is_dxtrade: false,
                            balance: 0,
                        },
                        selected_to: { currency: 'USD', is_mt: false, is_crypto: false, is_dxtrade: false, balance: 0 },
                        transfer_fee: 2,
                        transfer_limit: {
                            min: 0,
                            max: 1000,
                        },
                        requestTransferBetweenAccounts: jest.fn(),
                        error: {
                            setErrorMessage: jest.fn(),
                        },
                        setAccountTransferAmount: jest.fn(),
                    },
                    crypto_fiat_converter: {
                        resetConverter: jest.fn(),
                    },
                    transaction_history: {
                        onMount: jest.fn(),
                    },
                },
            },
            common: {
                is_from_derivgo: false,
            },
            traders_hub: {
                selected_account: {},
            },
        };
    });
    beforeAll(() => {
        const modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });
    afterAll(() => {
        const modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.removeChild(modal_root_el);
    });

    const props = {
        setSideNotes: jest.fn(),
        error: {
            code: 'testCode',
            message: 'testMessage',
        },
    };

    const renderAccountTransferForm = () => {
        render(<AccountTransferForm {...props} />, {
            wrapper: ({ children }) => <CashierProviders store={mockRootStore}>{children}</CashierProviders>,
        });
    };

    it('component should be rendered', () => {
        renderAccountTransferForm();

        expect(screen.getByTestId('dt_account_transfer_form_wrapper')).toBeInTheDocument();
        expect(screen.getByText('Transfer between your accounts in Deriv')).toBeInTheDocument();
    });

    it('should show loader if account_list.length === 0', () => {
        mockRootStore.modules.cashier.account_transfer.accounts_list = [];

        renderAccountTransferForm();

        expect(screen.getByTestId('dt_cashier_loader_wrapper')).toBeInTheDocument();
    });

    it('should show <Form /> component if account_list.length > 0', () => {
        mockRootStore.modules.cashier.account_transfer.accounts_list = [
            {
                currency: 'USD',
                is_mt: false,
                is_dxtrade: false,
                market_type: 'gaming',
                value: 'value',
            },
        ];

        renderAccountTransferForm();

        expect(screen.getByText('From')).toBeInTheDocument();
        expect(screen.getByText('To')).toBeInTheDocument();
        expect(screen.getByTestId('dt_account_transfer_form_drop_down_wrapper')).toBeInTheDocument();
        expect(screen.getByTestId('dt_account_transfer_form_drop_down')).toBeInTheDocument();
        expect(screen.getByTestId('dt_account_transfer_form_to_dropdown')).toBeInTheDocument();
        expect(screen.getByTestId('dt_account_transfer_form_submit')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Transfer' })).toBeInTheDocument();
    });

    it('should show an error if amount is not provided', async () => {
        renderAccountTransferForm();

        const submit_button = screen.getByRole('button', { name: 'Transfer' });
        fireEvent.change(screen.getByTestId('dt_account_transfer_form_input'), { target: { value: '1' } });
        fireEvent.change(screen.getByTestId('dt_account_transfer_form_input'), { target: { value: '' } });
        fireEvent.click(submit_button);

        expect(await screen.findByText('This field is required.')).toBeInTheDocument();
    });

    it('should show an error if transfer amount is greater than balance', async () => {
        mockRootStore.modules.cashier.account_transfer.selected_from.balance = 100;

        renderAccountTransferForm();

        const submit_button = screen.getByRole('button', { name: 'Transfer' });
        fireEvent.change(screen.getByTestId('dt_account_transfer_form_input'), { target: { value: '200' } });
        fireEvent.click(submit_button);

        expect(await screen.findByText('Insufficient balance')).toBeInTheDocument();
    });

    it('should not allow to do transfer if accounts from and to are same', () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        mockRootStore.modules.cashier.account_transfer.accounts_list[0].is_mt = true;
        mockRootStore.modules.cashier.account_transfer.selected_from.is_mt = true;
        mockRootStore.modules.cashier.account_transfer.selected_from.balance = 200;

        renderAccountTransferForm();

        fireEvent.change(screen.getByTestId('dt_account_transfer_form_input'), { target: { value: '100' } });
        fireEvent.click(screen.getByRole('button', { name: 'Transfer' }));

        expect(mockRootStore.modules.cashier.account_transfer.requestTransferBetweenAccounts).not.toHaveBeenCalled();
    });

    it('should show input if same currency', () => {
        renderAccountTransferForm();

        expect(screen.getByTestId('dt_account_transfer_form_input')).toBeInTheDocument();
    });

    it("should show 'Please verify your identity' error if error.code is Fiat2CryptoTransferOverLimit", () => {
        props.error = {
            code: 'Fiat2CryptoTransferOverLimit',
            message: 'testMessage',
        };

        renderAccountTransferForm();

        expect(screen.getByText('Please verify your identity')).toBeInTheDocument();
    });

    it("should show 'Cashier error' error if error.code is unexpected", () => {
        props.error = {
            code: 'testCode',
            message: 'testMessage',
        };

        renderAccountTransferForm();

        expect(screen.getByText('Cashier Error')).toBeInTheDocument();
    });

    it('should show <AccountTransferNote /> component', () => {
        (isMobile as jest.Mock).mockReturnValue(true);

        renderAccountTransferForm();

        expect(screen.getByText('Transfer limits may vary depending on the exchange rates.')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Transfers may be unavailable due to high volatility or technical issues and when the exchange markets are closed.'
            )
        ).toBeInTheDocument();
    });

    it('should show proper hint about mt5 remained transfers', () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        mockRootStore.client.account_limits = {
            daily_transfers: {
                dxtrade: {},
                internal: {},
                mt5: {
                    available: 1,
                },
            },
        };
        mockRootStore.modules.cashier.account_transfer.selected_from.is_mt = true;
        mockRootStore.modules.cashier.account_transfer.selected_to.is_mt = true;

        renderAccountTransferForm();

        expect(screen.getByText('You have 1 transfer remaining for today.')).toBeInTheDocument();
    });

    it('should show proper hint about dxtrade remained transfers', () => {
        (isMobile as jest.Mock).mockReturnValue(true);

        mockRootStore.client.account_limits = {
            daily_transfers: {
                dxtrade: {
                    available: 1,
                },
                internal: {},
                mt5: {},
            },
        };
        mockRootStore.modules.cashier.account_transfer.selected_from.is_dxtrade = true;
        mockRootStore.modules.cashier.account_transfer.selected_from.currency = 'USD';
        mockRootStore.modules.cashier.account_transfer.selected_to.is_dxtrade = true;
        mockRootStore.modules.cashier.account_transfer.selected_to.currency = 'USD';

        renderAccountTransferForm();

        expect(screen.getByText('You have 1 transfer remaining for today.')).toBeInTheDocument();
    });

    it('should show proper hint about internal remained transfers', () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        mockRootStore.client.account_limits = {
            daily_transfers: {
                dxtrade: {},
                internal: {
                    available: 1,
                },
                mt5: {},
            },
        };

        renderAccountTransferForm();

        expect(screen.getByText('You have 1 transfer remaining for today.')).toBeInTheDocument();
    });

    it('should show proper note if transfer fee is 2% and is_crypto_to_crypto_transfer', () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        mockRootStore.modules.cashier.account_transfer.selected_from.is_crypto = true;
        mockRootStore.modules.cashier.account_transfer.selected_from.currency = 'BTC';
        mockRootStore.modules.cashier.account_transfer.selected_to.is_crypto = true;
        mockRootStore.modules.cashier.account_transfer.selected_to.currency = 'BTC';
        mockRootStore.modules.cashier.account_transfer.transfer_fee = 2;

        renderAccountTransferForm();

        expect(
            screen.getByText(
                'We’ll charge a 2% transfer fee or 0 BTC, whichever is higher, for transfers between your Deriv cryptocurrency accounts. Please bear in mind that some transfers may not be possible.'
            )
        ).toBeInTheDocument();
    });

    it('should show proper note if transfer fee is 2%, is_mt_transfer, and is_dxtrade_allowed is false', () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        mockRootStore.modules.cashier.account_transfer.selected_from.is_mt = true;
        mockRootStore.modules.cashier.account_transfer.selected_to.is_mt = true;
        mockRootStore.modules.cashier.account_transfer.transfer_fee = 2;

        renderAccountTransferForm();

        expect(
            screen.getByText(
                'We’ll charge a 2% transfer fee or 0 USD, whichever is higher, for transfers between your Deriv cryptocurrency and Deriv MT5 accounts. Please bear in mind that some transfers may not be possible.'
            )
        ).toBeInTheDocument();
    });

    it('should show proper note if transfer fee is 2% and is_mt_transfer is false', () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        mockRootStore.modules.cashier.account_transfer.transfer_fee = 2;

        renderAccountTransferForm();

        expect(
            screen.getByText(
                'We’ll charge a 2% transfer fee or 0 USD, whichever is higher, for transfers between your Deriv fiat and Deriv cryptocurrency accounts. Please bear in mind that some transfers may not be possible.'
            )
        ).toBeInTheDocument();
    });

    it('should show proper note if transfer fee is null', () => {
        (isMobile as jest.Mock).mockReturnValue(true);
        mockRootStore.modules.cashier.account_transfer.transfer_fee = null;

        renderAccountTransferForm();

        expect(screen.getByText('Please bear in mind that some transfers may not be possible.')).toBeInTheDocument();
    });

    describe('<Dropdown />', () => {
        const accountsList = [
            {
                currency: 'BTC',
                is_mt: false,
                is_dxtrade: false,
                is_derivez: false,
                is_crypto: true,
                text: 'BTC',
                value: 'CR90000249',
            },
            {
                currency: 'USD',
                is_mt: false,
                is_dxtrade: false,
                is_derivez: false,
                is_crypto: false,
                text: 'USD',
                value: 'CR90000212',
            },
            {
                currency: 'USD',
                platform_icon: 'IcDerivez',
                is_mt: false,
                is_dxtrade: false,
                is_derivez: true,
                is_crypto: false,
                text: 'Deriv EZ',
                value: 'EZR80000469',
            },
            {
                currency: 'USD',
                is_mt: false,
                is_dxtrade: true,
                is_derivez: false,
                is_crypto: false,
                platform_icon: 'IcDeriv X',
                text: 'Deriv X',
                value: 'DXR1029',
            },
            {
                text: 'USD',
                currency: 'USD',
                value: 'MTR40013177',
                platform_icon: 'IcMt5Derived',
                is_crypto: false,
                is_mt: true,
                is_dxtrade: false,
                is_derivez: false,
            },
        ];

        // mockRootStore.modules.cashier.account_transfer.selected_to;
        // mockRootStore.modules.cashier.account_transfer.selected_from;

        const derivez_account = {
            currency: 'USD',
            is_mt: false,
            is_dxtrade: false,
            is_derivez: true,
            is_crypto: false,
            // platform_icon: "IcDerivez",
            text: 'Deriv EZ',
            value: 'EZR80000469',
        };

        const derivx_account = {
            currency: 'USD',
            is_mt: false,
            is_dxtrade: true,
            is_derivez: false,
            is_crypto: false,
            platform_icon: 'IcDxtradeDeriv X',
            text: 'Deriv X',
            value: 'DXR1029',
        };

        const currency_usd_account = {
            text: 'USD',
            value: 'CR90000212',
            balance: '9953.89',
            currency: 'USD',
            is_crypto: false,
            is_mt: false,
            is_dxtrade: false,
            is_derivez: false,
        };

        const currency_btc_account = {
            text: 'BTC',
            value: 'CR90000249',
            currency: 'BTC',
            is_crypto: true,
            is_mt: false,
            is_dxtrade: false,
            is_derivez: false,
        };

        const mt5_account = {
            text: 'USD',
            currency: 'USD',
            value: 'MTR40013177',
            is_crypto: false,
            is_mt: true,
            is_dxtrade: false,
            is_derivez: false,
        };
        // it('should show the deriv ez icon when deriv ez account is selected in the from or to account dropdown`', () => {

        //     renderAccountTransferForm();
        //     expect(screen.getByTestId('dt_IcDerivez')).toBeInTheDocument()

        // });

        describe('from_dropdown', () => {
            it('should check for USD icon when USD is selected in from_dropdown', () => {
                mockRootStore.modules.cashier.account_transfer.accounts_list = accountsList;
                mockRootStore.modules.cashier.account_transfer.selected_from = currency_usd_account;
                mockRootStore.modules.cashier.account_transfer.setTransferPercentageSelectorResult = jest
                    .fn()
                    .mockReturnValue(10.0);

                renderAccountTransferForm();
                expect(screen.getByTestId('dt-currency-usd')).toBeInTheDocument();
            });

            it('should check for icon BTC when BTC is selected in from dropdown', () => {
                mockRootStore.modules.cashier.account_transfer.accounts_list = accountsList;
                mockRootStore.modules.cashier.account_transfer.selected_from = currency_btc_account;
                mockRootStore.modules.cashier.account_transfer.setTransferPercentageSelectorResult = jest
                    .fn()
                    .mockReturnValue(100.0);

                renderAccountTransferForm();
                expect(screen.getByTestId('dt-currency-btc')).toBeInTheDocument();
            });

            it('should check for derivez icon when derivez is selected in from_dropdown', () => {
                mockRootStore.modules.cashier.account_transfer.accounts_list = accountsList;
                mockRootStore.modules.cashier.account_transfer.selected_from = derivez_account;
                mockRootStore.modules.cashier.account_transfer.setTransferPercentageSelectorResult = jest
                    .fn()
                    .mockReturnValue(100.0);

                renderAccountTransferForm();
                expect(screen.getByTestId('dt-IcDerivez')).toBeInTheDocument();
            });

            it('should check for MT5 icon when MT5 is selected in from_dropdown', () => {
                mockRootStore.modules.cashier.account_transfer.accounts_list = accountsList;
                mockRootStore.modules.cashier.account_transfer.selected_from = mt5_account;
                mockRootStore.modules.cashier.account_transfer.setTransferPercentageSelectorResult = jest
                    .fn()
                    .mockReturnValue(100.0);

                renderAccountTransferForm();
                expect(screen.getByTestId('dt-IcMt5Derived')).toBeInTheDocument();
            });

            it('should check for DerivX icon when DerivX is selected in from_dropdown', () => {
                mockRootStore.modules.cashier.account_transfer.accounts_list = accountsList;
                mockRootStore.modules.cashier.account_transfer.selected_from = derivx_account;
                mockRootStore.modules.cashier.account_transfer.setTransferPercentageSelectorResult = jest
                    .fn()
                    .mockReturnValue(100.0);

                renderAccountTransferForm();
                expect(screen.getByTestId('dt-IcDeriv X')).toBeInTheDocument();
            });
        });
    });
});
