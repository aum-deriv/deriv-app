import React, { useEffect } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import { useStore } from '@deriv/stores';
import { ActionSheet, TextField, TextFieldWithSteppers, useSnackbar } from '@deriv-com/quill-ui';
import { localize, Localize } from '@deriv/translations';
import { formatMoney, getCurrencyDisplayCode, getDecimalPlaces, isCryptocurrency } from '@deriv/shared';
import { useTraderStore } from 'Stores/useTraderStores';
import { getDisplayedContractTypes } from 'AppV2/Utils/trade-types-utils';
import StakeDetails from './stake-details';
import useContractsForCompany from 'AppV2/Hooks/useContractsForCompany';
import { TTradeParametersProps } from '../trade-parameters';
import useIsVirtualKeyboardOpen from 'AppV2/Hooks/useIsVirtualKeyboardOpen';

const Stake = observer(({ is_minimized }: TTradeParametersProps) => {
    const {
        amount,
        basis,
        commission,
        contract_type,
        currency,
        has_open_accu_contract,
        has_stop_loss,
        is_accumulator,
        is_multiplier,
        is_turbos,
        is_vanilla,
        is_market_closed,
        onChange,
        proposal_info,
        setDefaultStake,
        setV2ParamsInitialValues,
        stop_out,
        symbol,
        trade_type_tab,
        trade_types,
        v2_params_initial_values,
        validation_errors,
        validation_params,
    } = useTraderStore();
    const {
        client: { is_logged_in, currency: client_currency },
    } = useStore();
    const { addSnackbar } = useSnackbar();
    const [is_open, setIsOpen] = React.useState(false);
    const [is_focused, setIsFocused] = React.useState(false);
    const [should_show_error, setShouldShowError] = React.useState(true);
    const { available_contract_types } = useContractsForCompany();
    const stake_ref = React.useRef<HTMLInputElement | null>(null);

    // default_stake resetting data
    const is_crypto = isCryptocurrency(client_currency ?? '');
    const default_stake = is_crypto
        ? Number(v2_params_initial_values.stake)
        : available_contract_types?.[contract_type]?.config?.default_stake;

    useEffect(() => {
        if (client_currency !== currency) {
            onChange({ target: { name: 'currency', value: client_currency } });
            if (!isCryptocurrency(client_currency ?? '')) {
                onChange({ target: { name: 'amount', value: default_stake } });
                setV2ParamsInitialValues({ value: default_stake as number, name: 'stake' });
            }
        }
    }, [client_currency]);

    const displayed_error = React.useRef(false);
    const contract_types = getDisplayedContractTypes(trade_types, contract_type, trade_type_tab);
    // first contract type data:
    const {
        has_error: has_error_1,
        id: id_1,
        message: message_1 = '',
        payout: payout_1 = 0,
        error_field: error_field_1,
    } = proposal_info[contract_types[0]] ?? {};
    // second contract type data:
    const {
        has_error: has_error_2,
        id: id_2,
        message: message_2 = '',
        payout: payout_2 = 0,
        error_field: error_field_2,
    } = proposal_info[contract_types[1]] ?? {};
    const is_loading_proposal = !has_error_1 && !has_error_2 && (!id_1 || (!!contract_types[1] && !id_2));
    const proposal_error_message_1 =
        has_error_1 && (error_field_1 === 'amount' || error_field_1 === 'stake') ? message_1 : '';
    const proposal_error_message_2 =
        has_error_2 && (error_field_2 === 'amount' || error_field_2 === 'stake') ? message_2 : '';
    const has_both_errors = has_error_1 && has_error_2;
    const proposal_error_with_two_contract = contract_types[1] && has_both_errors;

    const proposal_error_with_one_contract = !(contract_types[1] && !has_both_errors) && proposal_error_message_1;

    const proposal_error_message = proposal_error_with_two_contract
        ? proposal_error_message_1 || proposal_error_message_2 || validation_errors?.amount?.[0]
        : proposal_error_with_one_contract || validation_errors?.amount?.[0];
    /* TODO: stop using Max payout from error text as a default max payout and stop using error text for is_max_payout_exceeded after validation_params are added to proposal API (both success & error response):
    E.g., for is_max_payout_exceeded, we have to temporarily check the error text: Max payout error always contains 3 numbers, the check will work for any languages: */
    const float_number_search_regex = /\d+(\.\d+)?/g;
    const is_max_payout_exceeded =
        proposal_error_message_1.match(float_number_search_regex)?.length === 3 ||
        proposal_error_message_2.match(float_number_search_regex)?.length === 3;
    const error_max_payout =
        is_max_payout_exceeded && proposal_error_message
            ? Number(proposal_error_message.match(float_number_search_regex)?.[1])
            : 0;
    const { payout, stake } = (validation_params[contract_types[0]] || validation_params[contract_types[1]]) ?? {};
    const { max: max_payout = error_max_payout } = payout ?? {};
    const { max: max_stake = 0, min: min_stake = 0 } = stake ?? {};
    const error_payout_1 = proposal_error_message_1
        ? Number(proposal_error_message_1.match(float_number_search_regex)?.[2])
        : 0;
    const error_payout_2 = proposal_error_message_2
        ? Number(proposal_error_message_2.match(float_number_search_regex)?.[2])
        : 0;
    const first_contract_payout = payout_1 || error_payout_1;
    const second_contract_payout = payout_2 || error_payout_2;
    const main_error_message =
        (proposal_error_message && error_payout_1 > error_payout_2
            ? proposal_error_message_2
            : proposal_error_message_1) || proposal_error_message;
    const two_contracts_error = has_both_errors || amount.toString() === '' ? main_error_message : '';
    const stake_error =
        (has_both_errors
            ? two_contracts_error
            : (!contract_types[1] || amount.toString() === '') && proposal_error_message) || '';
    const [details, setDetails] = React.useState({
        first_contract_payout,
        max_payout,
        max_stake,
        min_stake,
        second_contract_payout,
    });

    // scroll the page when a virtual keyboard pop up
    const input_id = 'stake_input';
    const { is_key_board_visible: should_scroll } = useIsVirtualKeyboardOpen(input_id);

    React.useEffect(() => {
        if (should_scroll) window?.scrollTo({ top: 225, behavior: 'smooth' });
    }, [should_scroll]);

    React.useEffect(() => {
        if (stake_error && !is_minimized && !is_open) {
            displayed_error.current = true;
            addSnackbar({
                message: <Localize i18n_default_text='Please adjust your stake.' />,
                status: 'fail',
                hasCloseButton: true,
                style: {
                    marginBottom: is_logged_in ? '48px' : '-8px',
                    width: 'calc(100% - var(--core-spacing-800)',
                },
            });
        }
    }, [stake_error]);

    React.useEffect(() => {
        displayed_error.current = false;
    }, [contract_type, symbol]);

    React.useEffect(() => {
        if (default_stake) setDefaultStake(default_stake);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [default_stake]);

    React.useEffect(() => {
        const initial_stake = v2_params_initial_values?.stake;
        if (initial_stake && amount !== initial_stake) {
            onChange({ target: { name: 'amount', value: initial_stake } });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (is_open && v2_params_initial_values.stake !== amount) {
            setV2ParamsInitialValues({ value: amount, name: 'stake' });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_open]);

    React.useEffect(() => {
        if (basis !== 'stake') onChange({ target: { name: 'basis', value: 'stake' } });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [basis]);

    React.useEffect(() => {
        const stake_element = stake_ref.current;
        const checkFocus = () => {
            setIsFocused(!!(stake_element && stake_element.contains(document.activeElement)));
        };
        document.addEventListener('focusin', checkFocus);
        document.addEventListener('focusout', checkFocus);

        return () => {
            document.removeEventListener('focusin', checkFocus);
            document.removeEventListener('focusout', checkFocus);
        };
    });

    React.useEffect(() => {
        if (is_open) {
            if (
                (details.first_contract_payout !== first_contract_payout && first_contract_payout) ||
                (details.max_payout !== max_payout && max_payout) ||
                (details.max_stake !== max_stake && max_stake) ||
                (details.min_stake !== min_stake && min_stake) ||
                (details.second_contract_payout !== second_contract_payout && second_contract_payout)
            ) {
                setDetails({
                    first_contract_payout,
                    max_payout,
                    max_stake,
                    min_stake,
                    second_contract_payout,
                });
            }
        }
    }, [details, is_open, max_payout, max_stake, min_stake, first_contract_payout, second_contract_payout]);

    React.useEffect(() => {
        if (is_focused) {
            if (!amount) {
                setShouldShowError(false);
            }
        }
    }, [is_focused, amount]);

    const getInputMessage = () =>
        (should_show_error && stake_error) ||
        (!!details.min_stake && !!details.max_stake && (
            <Localize
                i18n_default_text='Acceptable range: {{min_stake}} to {{max_stake}} {{currency}}'
                values={{
                    currency: getCurrencyDisplayCode(currency),
                    min_stake: formatMoney(currency, +details.min_stake, true),
                    max_stake: formatMoney(currency, +details.max_stake, true),
                }}
            />
        ));

    const handleOnChange = (e: { target: { name: string; value: string } }) => {
        setShouldShowError(!!e.target.value);
        onChange({ target: { name: 'amount', value: e.target.value } });
    };

    const onClose = React.useCallback(
        (is_saved = false) => {
            if (is_open) {
                if (!is_saved) {
                    onChange({ target: { name: 'amount', value: v2_params_initial_values.stake } });
                }
                if (v2_params_initial_values.stake !== amount) {
                    setV2ParamsInitialValues({ value: amount, name: 'stake' });
                }
                setIsOpen(false);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [is_open, v2_params_initial_values.stake, amount]
    );

    return (
        <>
            <TextField
                disabled={has_open_accu_contract || is_market_closed}
                variant='fill'
                readOnly
                label={<Localize i18n_default_text='Stake' key={`stake${is_minimized ? '-minimized' : ''}`} />}
                noStatusIcon
                onClick={() => setIsOpen(true)}
                value={`${v2_params_initial_values?.stake ?? amount} ${getCurrencyDisplayCode(currency)}`}
                className={clsx('trade-params__option', is_minimized && 'trade-params__option--minimized')}
                status={stake_error && !is_open ? 'error' : undefined}
            />
            <ActionSheet.Root
                isOpen={is_open}
                onClose={onClose}
                position='left'
                expandable={false}
                shouldBlurOnClose={is_open}
            >
                <ActionSheet.Portal shouldCloseOnDrag>
                    <ActionSheet.Header title={<Localize i18n_default_text='Stake' />} />
                    <ActionSheet.Content className='stake-content'>
                        <TextFieldWithSteppers
                            allowDecimals
                            allowSign={false}
                            className='text-field--custom'
                            customType='commaRemoval'
                            data-testid='dt_input_with_steppers'
                            decimals={getDecimalPlaces(currency)}
                            inputMode='decimal'
                            message={getInputMessage()}
                            minusDisabled={Number(amount) - 1 <= 0}
                            name='amount'
                            noStatusIcon
                            onChange={handleOnChange}
                            placeholder={localize('Amount')}
                            ref={stake_ref}
                            regex={/[^0-9.,]/g}
                            status={should_show_error && stake_error ? 'error' : 'neutral'}
                            shouldRound={false}
                            textAlignment='center'
                            unitLeft={getCurrencyDisplayCode(currency)}
                            value={amount}
                            variant='fill'
                            id={input_id}
                        />
                        <StakeDetails
                            commission={commission}
                            contract_type={contract_type}
                            contract_types={contract_types}
                            currency={currency}
                            details={details}
                            has_stop_loss={has_stop_loss}
                            is_loading_proposal={is_loading_proposal}
                            is_multiplier={is_multiplier}
                            is_max_payout_exceeded={is_max_payout_exceeded}
                            should_show_payout_details={!is_accumulator && !is_multiplier && !is_turbos && !is_vanilla}
                            stake_error={stake_error}
                            stop_out={stop_out}
                        />
                    </ActionSheet.Content>
                    <ActionSheet.Footer
                        alignment='vertical'
                        shouldCloseOnPrimaryButtonClick={false}
                        primaryAction={{
                            content: <Localize i18n_default_text='Save' />,
                            onAction: () => {
                                if (!stake_error) {
                                    onClose(true);
                                    onChange({ target: { name: 'amount', value: amount } });
                                } else {
                                    setShouldShowError(true);
                                }
                            },
                        }}
                    />
                </ActionSheet.Portal>
            </ActionSheet.Root>
        </>
    );
});

export default Stake;
