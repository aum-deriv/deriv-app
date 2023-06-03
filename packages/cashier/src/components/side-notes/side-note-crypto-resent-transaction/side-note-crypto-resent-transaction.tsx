import React, { useCallback } from 'react';
import { useFetch } from '@deriv/api';
import { Button, Loading, SideNote, Text } from '@deriv/components';
import { epochToMoment } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import { useCashierStore } from '../../../stores/useCashierStores';
import { TTransactionItem } from '../../../types';
import './side-note-crypto-resent-transaction.scss';

const SideNoteCryptoRecentTransaction: React.FC = observer(() => {
    const { ui } = useStore();
    const { is_mobile } = ui;
    const { transaction_history } = useCashierStore();
    const { setIsCryptoTransactionsVisible } = transaction_history;
    // const { subscribe, data, is_loading, error } = useSubscription('cashier_payments');
    const { data, isLoading, error } = useFetch('cashier_payments');
    const transactions = data?.cashier_payments?.crypto;
    const has_transactions = transactions?.length > 0;
    const recent_transactions: TTransactionItem | undefined = has_transactions ? transactions?.[0] : undefined;
    const currency = 'BTC';

    // useEffect(() => {
    //     subscribe();
    // }, [subscribe]);

    const TransactionDetail = useCallback(() => {
        if (!recent_transactions) return null;

        const { transaction_type, amount, submit_date, address_url, transaction_hash, confirmations } =
            recent_transactions;
        const is_deposit = transaction_type === 'deposit';
        const date = epochToMoment(submit_date || 0).format('MMM D, YYYY');
        const address = `${address_url.substring(0, 4)}....${address_url.substring(address_url.length - 4)}`;
        const hash = `${transaction_hash?.substring(0, 4)}....${transaction_hash?.substring(
            transaction_hash?.length - 4
        )}`;

        return (
            <div className='deposit-crypto-recent-transaction-side-note__content'>
                <Text size={'xxs'}>
                    {is_deposit
                        ? localize('Deposit {{currency}}', { currency })
                        : localize('Withdrawal {{currency}}', { currency })}
                </Text>
                <Text
                    size={'xxxs'}
                    color={'less-prominent'}
                    className='deposit-crypto-recent-transaction-side-note__date'
                >
                    {localize('{{amount}} {{currency}} on {{date}}', { amount, currency, date })}
                </Text>
                <Text size={'xxxs'}>
                    <Localize
                        i18n_default_text='Address: <0>{{address}}</0>'
                        values={{ address }}
                        components={[<Text key={0} size={'xxxs'} color={'red'} />]}
                    />
                </Text>
                <Text size={'xxxs'}>
                    <Localize
                        i18n_default_text='Transaction hash: <0>{{hash}}</0>'
                        values={{ hash }}
                        components={[<Text key={0} size={'xxxs'} color={'red'} />]}
                    />
                </Text>
                <Text size={'xxxs'}>
                    <Localize
                        i18n_default_text='Confirmations: <0>{{count}}/12</0>'
                        values={{ count: confirmations }}
                        components={[<Text key={0} size={'xxxs'} color={'red'} />]}
                    />
                </Text>
            </div>
        );
    }, [recent_transactions]);

    return (
        <SideNote>
            <div className='deposit-crypto-recent-transaction-side-note'>
                <Text size={is_mobile ? 'xxs' : 'xs'} weight='bold'>
                    {localize('BTC recent transactions')}
                </Text>
                <div className='deposit-crypto-recent-transaction-side-note__divider' />
                {isLoading && <Loading is_fullscreen={false} />}
                {!isLoading && !has_transactions && (
                    <Text size={is_mobile ? 'xxs' : 'xs'}>{localize('No recent transactions.')}</Text>
                )}
                {!isLoading && has_transactions && <TransactionDetail />}
                <div className='deposit-crypto-recent-transaction-side-note__divider' />
                <Button
                    text={localize('View all')}
                    onClick={() => setIsCryptoTransactionsVisible(true)}
                    secondary
                    small
                    className='deposit-crypto-recent-transaction-side-note__button'
                />
            </div>
        </SideNote>
    );
});

export default SideNoteCryptoRecentTransaction;
